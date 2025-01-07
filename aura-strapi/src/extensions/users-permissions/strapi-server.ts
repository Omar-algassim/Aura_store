// src/extensions/users-permissions/strapi-server.ts

import { Context } from 'koa';
import { errors } from '@strapi/utils';
import axios from 'axios';
import crypto from 'crypto';
import _ from 'lodash';
import { getService } from '@strapi/plugin-users-permissions/server/utils';

const { ApplicationError } = errors;

interface ForgotPasswordBody {
  email?: string;
  phone_number?: string;
}

interface CustomRegistrationBody {
  email?: string;
  phone_number?: string;
  password: string;
  username?: string;
}

const sanitizeUser = (user:any, ctx:any) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};
const sendResetPasswordMessage = async (user: any, message: any) => {
  const phone_number = user.phone_number;
  if (!phone_number) {
    throw new ApplicationError('cannot find the user phone number')
  }
  //send whatsapp message using facebook api
  const whats_token = process.env.WHATS_ACCESS_TOKEN;
  const sender = process.env.SEND_NUMBER;
  const url = `https://graph.facebook.com/v12.0/${sender}/messages`;
  const phone_num = phone_number.replace(/\s/g, '');
  const clean_num = phone_num ? `${phone_num.slice(1)}` : phone_num;
  const headrs = {
    Authorization: `Bearer ${whats_token}`,
    'Content-Type': 'application/json'
  };
  const data = {
    messaging_product: "whatsapp",
    to: clean_num,
    type: "template",
    template: {
        name: "hello_world", //change this to the reset message tamplate
        language: {
          code: "en_US"
      }
  }
};

  axios.post(url, data, { headers: headrs })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

const sendConfirmationMessage = (user: any) => {
  const phone_num = user.phone_number;
  if (!phone_num) {
    throw new ApplicationError('cannot find the user phone number')
  }
  //send whatsapp message using facebook api
  const whats_token = process.env.WHATS_ACCESS_TOKEN;
  const sender = process.env.SEND_NUMBER;
  const url = `https://graph.facebook.com/v12.0/${sender}/messages`;
  const clean_num = phone_num ? `+${phone_num.slice(1)}` : phone_num;
  const headrs = {
    Authorization: `Bearer ${whats_token}`,
    'Content-Type': 'application/json'
  };
  const data = {
    messaging_product: "whatsapp",
    to: clean_num,
    type: "template",
    template: {
        name: "hello_world",
        language: {
            code: "en_US"
        }
    }
  };

  axios.post(url, data, { headers: headrs })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
};

const validateForgotPasswordBody = async (body: ForgotPasswordBody) => {
  if (!body.email && !body.phone_number) {
    throw new Error('Either email or phone number is required');
  }

  if (body.email && body.phone_number) {
    throw new Error('Please provide either email or phone number, not both');
  }

  if (body.phone_number && !/^\+?[\d\s-]{10,}$/.test(body.phone_number)) {
    throw new Error('Please provide a valid phone number');
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw new Error('Please provide a valid email');
  }

  return body;
}

const validateRegistrationData = (data: CustomRegistrationBody) => {
  if (!data.email && !data.phone_number) {
    throw new Error('Either email or phone number is required');
  }

  if (data.email && data.phone_number) {
    throw new Error('Please provide either email or phone number, not both');
  }

  if (data.phone_number && !/^\+?[\d\s-]{10,}$/.test(data.phone_number)) {
    throw new Error('Please provide a valid phone number');
  }
};

export default async (plugin: any) => {
  const baseControllers = await plugin.controllers.auth;

  // TODO: Implement the sms code confirmation service
  
  const register = async (ctx: Context) => {
    const { body } = ctx.request;
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });

    const settings = await pluginStore.get({ key: 'advanced' }) as any;
    if (!settings.allow_register) {
      throw new ApplicationError('Register action is currently disabled');
    }

    // const { register } = strapi.config.get('plugin::users-permissions');
    
    const alwaysAllowedKeys = ['username', 'password', 'email', 'phone_number'];
    // Validate request body
    try {
      validateRegistrationData(body);
    } catch (error: any) {
      return ctx.badRequest(error.message);
    }

    // Generate username if not provided
    const username = body.username || 
      (body.email ? body.email.split('@')[0] : `user_${Date.now()}`);

    const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: settings.default_role } });
    //check the role
    if (!role) {
      throw new ApplicationError('Impossible to find the default role');
    }
  
    // Check if user exists
    const userExists = await strapi.query('plugin::users-permissions.user').findOne({
      where: {
        $or: [
          { email: body.email },
          { phone_number: body.phone_number }
        ]
      }
    });

    if (userExists) {
      throw new ApplicationError('Username, email, or phone number already taken');
    }

    const newUser = {
      ...body,
      role: role.id,
      email: body.email ? body.email.toLowerCase() : undefined,
      username,
      phone_number: body.phone_number,
      confirmed: !settings.email_confirmation,
    };

    const user = await strapi.service('plugin::users-permissions.user').add(newUser);
    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        if (body.email) {
          await strapi.service('plugin::users-permissions.user').sendConfirmationEmail(user);
        } else {
          // else: use the sms code confirmation service
          // for now we will just set confirmed to true
          sendConfirmationMessage(user);
          // await strapi.db.query("plugin::users-permissions.user")
          // .update({
          //   where: { id: user.id },
          //   data: { confirmed: true },
          //   populate: ['role'],
          // });
        }
      } catch (err) {
        return ctx.badRequest([{ messages: [{ id: 'Auth.error.email.invalid' }] }]);
      }

      return ctx.send({ user: sanitizedUser });
    }

    const jwt = strapi.service('plugin::users-permissions.jwt').issue({
      id: user.id,
    });

    return ctx.send({
      jwt,
      user: sanitizedUser,
    });
  };

  plugin.controllers.auth = ({ strapi }) => {
    return {
      ...baseControllers({ strapi }),
      register,
      async forgotPassword (ctx: Context) {
        const { email } = await validateForgotPasswordBody(ctx.request.body);
        
        const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
        
        const emailSettings = await pluginStore.get({ key: 'email' });
        const advancedSettings = await pluginStore.get({ key: 'advanced' });
        
        // Find the user by email or phone number.
        if (email) { 
          var user = await strapi.db
          .query('plugin::users-permissions.user')
          .findOne({ where: { email: email.toLowerCase() } });
        } else {
          const { phone_number } = await validateForgotPasswordBody(ctx.request.body); 
          var user = await strapi.db
          .query('plugin::users-permissions.user')
          .findOne({ where: { phone_number } });
        }
        if (!user || user.blocked) {
          return ctx.send({ ok: true });
        }
    
        // Generate random token.
        const userInfo = await sanitizeUser(user, ctx);
    
        const resetPasswordToken = crypto.randomBytes(64).toString('hex');
    
        const resetPasswordSettings = _.get(emailSettings, 'reset_password.options', {});
        const emailBody = await getService('users-permissions').template(
          resetPasswordSettings.message,
          {
            URL: advancedSettings.email_reset_password,
            SERVER_URL: strapi.config.get('server.absoluteUrl'),
            ADMIN_URL: strapi.config.get('admin.absoluteUrl'),
            USER: userInfo,
            TOKEN: resetPasswordToken,
          }
        );
    
        const emailObject = await getService('users-permissions').template(
          resetPasswordSettings.object,
          {
            USER: userInfo,
          }
        );
    
        const emailToSend = {
          to: user.email,
          from:
            resetPasswordSettings.from.email || resetPasswordSettings.from.name
              ? `${resetPasswordSettings.from.name} <${resetPasswordSettings.from.email}>`
              : undefined,
          replyTo: resetPasswordSettings.response_email,
          subject: emailObject,
          text: emailBody,
          html: emailBody,
        };
    
        // NOTE: Update the user before sending the email so an Admin can generate the link if the email fails
        await getService('user').edit(user.id, { resetPasswordToken });

        // Send an email to the user or whatsapp message if there use phone number.
        if (email) {
          await strapi.plugin('email').service('email').send(emailToSend);
        } else {
          sendResetPasswordMessage(user, emailBody);
        }
    
        ctx.send({ ok: true });
      },

    }
  };
  return plugin;
};
