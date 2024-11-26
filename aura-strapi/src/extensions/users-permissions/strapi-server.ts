// src/extensions/users-permissions/strapi-server.ts

import { Context } from 'koa';
import { errors } from '@strapi/utils';
import axios from 'axios';

const { ApplicationError } = errors;

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

const sendConfirmationMessage = (user: any) => {
  const phone_num = user.phone_number;
  if (!phone_num) {
    throw new ApplicationError('cannot find the user phone number')
  }
  //send whatsapp message using facebook api
  const whats_token = process.env.WHATS_ACCESS_TOKEN;
  const sender = process.env.SEND_NUMBER;
  const url = `https://graph.facebook.com/v12.0/${sender}/messages`;
  // const clean_num = phone_num ? `+${phone_num.slice(1)}` : phone_num;

  axios.post(url, {
      Authorization: whats_token,
      messaging_product: "whatsapp",
      to: clean_num,
      type: "template",
      template: {
          name: "hello_world",
          language: {
              code: "en_US"
          }
      }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
};
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
    // // Hash password
    // const hashedPassword = await strapi.service('plugin::users-permissions.user').hashPassword({
    //   password: body.password,
    // });

    // // Create user
    // const user = await strapi.query('plugin::users-permissions.user').create({
    //   data: {
    //     ...body,
    //     username,
    //     password: hashedPassword,
    //     provider: 'local',
    //     confirmed: !settings.email_confirmation,
    //     role: settings.default_role,
    //   },
    // });

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
    }
  };
  return plugin;
};
