// src/extensions/users-permissions/strapi-server.ts

import { Context } from 'koa';
import { errors } from '@strapi/utils';

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

    // Hash password
    const hashedPassword = await strapi.service('plugin::users-permissions.user').hashPassword({
      password: body.password,
    });

    // Create user
    const user = await strapi.query('plugin::users-permissions.user').create({
      data: {
        ...body,
        username,
        password: hashedPassword,
        provider: 'local',
        confirmed: !settings.email_confirmation,
        role: settings.default_role,
      },
    });

    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        if (body.email) {
          await strapi.service('plugin::users-permissions.user').sendConfirmationEmail(user);
        } else {
          // else: use the sms code confirmation service
          // for now we will just set confirmed to true
          await strapi.db.query("plugin::users-permissions.user")
          .update({
            where: { id: user.id },
            data: { confirmed: true },
            populate: ['role'],
          });
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

  plugin.controllers.auth = async ({strapi}) => {
    return {
      ...await baseControllers({strapi}),
      register,
    }
  };

  console.log(`\n\nDone Creating the custom Auth Register\n\n`);
  // console.log(`\n\nThe plugin baseControllers are: ${baseControllers}\n\n`);
  console.log(`\n\nThe plugin controllers are: ${plugin.controllers.auth}\n\n`);
  return plugin;
};
