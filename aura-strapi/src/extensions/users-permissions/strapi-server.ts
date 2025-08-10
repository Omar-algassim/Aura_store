// src/extensions/users-permissions/strapi-server.ts

import { Context } from 'koa';
import { errors } from '@strapi/utils';
import sendWhatsappMessage from './service';
import crypto from 'crypto';
import _ from 'lodash';
import {
  validateCallbackBody,
  validateSendEmailConfirmationBody,
  validateForgotPasswordBody,
  validateEmailConfirmationBody,
  validateRegistrationData,
} from './validation';

const { ApplicationError, ForbiddenError, ValidationError } = errors;

const getService = (name: string) => {
  return strapi.plugin('users-permissions').service(name);
};

const sanitizeUser = (user: any, ctx: any) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

export default async (plugin: any) => {
  const baseControllers = await plugin.controllers.auth;

  const register = async (ctx: Context) => {
    const { body } = ctx.request;
    const pluginStore = await strapi.store({
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = (await pluginStore.get({ key: 'advanced' })) as any;
    if (!settings.allow_register) {
      throw new ApplicationError('Register action is currently disabled');
    }

    const alwaysAllowedKeys = [
      'username',
      'password',
      'email',
      'phone_number',
      'country_code',
    ];
    // Validate request body
    try {
      validateRegistrationData(body);
    } catch (error: any) {
      return ctx.badRequest(error.message);
    }

    // Generate username if not provided
    const username =
      body.username ||
      (body.email ? body.email.split('@')[0] : `user_${Date.now()}`);

    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });
    //check the role
    if (!role) {
      throw new ApplicationError('Impossible to find the default role');
    }

    // Check if user exists
    const userExists = await strapi
      .query('plugin::users-permissions.user')
      .findOne({
        where: {
          $or: [{ email: body.email }, { phone_number: body.phone_number }],
        },
      });

    if (userExists) {
      return ctx.badRequest(new ApplicationError('User already exists'));
    }

    const newUser = {
      ...body,
      role: role.id,
      email: body.email ? body.email.toLowerCase() : undefined,
      username,
      phone_number: body.phone_number,
      country_code: body.country_code,
      confirmed: !settings.email_confirmation,
    };

    const user = await strapi
      .service('plugin::users-permissions.user')
      .add(newUser);
    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        sendEmailConfirmation(ctx);
        // if (body.email) {
        //   await strapi
        //     .service("plugin::users-permissions.user")
        //     .sendConfirmationEmail(user);
        // } else {
        //   sendWhatsappMessage(user, "1234", "account_verify");
        // }
      } catch (err) {
        return ctx.badRequest([
          { messages: [{ id: 'Auth.error.email.invalid' }] },
        ]);
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

  const emailConfirmation = async (
    ctx: Context,
    next: Request,
    returnUser: boolean
  ) => {
    const { confirmation: confirmationToken } =
      await validateEmailConfirmationBody(ctx.query);

    const userService = getService('user');
    const jwtService = getService('jwt');

    const [user] = await userService.fetchAll({
      filters: { confirmationToken },
    });

    if (!user) {
      throw new ValidationError('Invalid token');
    }

    if (returnUser || confirmationToken.length === 6) {
      await userService.edit(user.id, {
        confirmed: true,
        phoneNumberConfirmed: true,
        confirmationToken: null,
      });
      ctx.send({
        jwt: jwtService.issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } else {
      await userService.edit(user.id, {
        confirmed: true,
        emailConfirmed: true,
        confirmationToken: null,
      });
      const settings: any = await strapi
        .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
        .get();

      ctx.redirect(settings.email_confirmation_redirection || '/');
    }
  };

  const forgotPassword = async (ctx: Context) => {
    const { email } = await validateForgotPasswordBody(ctx.request.body);

    const pluginStore = await strapi.store({
      type: 'plugin',
      name: 'users-permissions',
    });

    const emailSettings = await pluginStore.get({ key: 'email' });
    const advancedSettings: any = await pluginStore.get({ key: 'advanced' });

    // Find the user by email or phone number.
    if (email) {
      var user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: { email: email.toLowerCase() } });
    } else {
      const { phone_number } = await validateForgotPasswordBody(
        ctx.request.body
      );
      var user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: { phone_number } });
    }
    if (!user || user.blocked) {
      return ctx.send({ error: 'user Blocked or not found' });
    }

    const userInfo = await sanitizeUser(user, ctx);

    // Generate random token.
    const resetPasswordToken = crypto.randomBytes(3).toString('hex');

    const resetPasswordSettings: any = _.get(
      emailSettings,
      'reset_password.options',
      {}
    );
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
      const data = {
        template: 'reset_password',
        token: resetPasswordToken,
      };
      await sendWhatsappMessage(user, data);
      ctx.send({ res: 200 });
    }

    ctx.send({ ok: true, email });
  };

  const sendEmailConfirmation = async (ctx: Context) => {
    const { email, phone_number } = await validateSendEmailConfirmationBody(
      ctx.request.body
    );
    if (!email) {
      var user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: { phone_number },
        });
    } else {
      var user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: { email: email.toLowerCase() },
        });
    }

    if (!user) {
      return ctx.send({ email, sent: true });
    }

    if (user.confirmed) {
      throw new ApplicationError('Already confirmed');
    }

    if (user.blocked) {
      throw new ApplicationError('User blocked');
    }
    if (email) {
      await getService('user').sendConfirmationEmail(user);
      ctx.send({
        email: user.email,
        sent: true,
      });
    } else {
      const confirmationToken = crypto.randomBytes(3).toString('hex');
      await getService('user').edit(user.id, { confirmationToken });

      const data = {
        template: 'verify_code',
        token: confirmationToken,
      };

      await sendWhatsappMessage(user, data);
      ctx.send({
        email: user.phone_number,
        sent: true,
      });
    }
  };

  const callback = async (ctx: Context) => {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
    const grantSettings = await store.get({ key: 'grant' });

    const grantProvider = provider === 'local' ? 'email' : provider;

    if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
      throw new ApplicationError('This provider is disabled');
    }

    if (provider === 'local') {
      await validateCallbackBody(params);

      const { identifier } = params;

      // Check if the user exists.
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: {
            // provider,
            $or: [
              { email: identifier.toLowerCase() },
              { phone_number: identifier },
            ],
          },
        });

      if (!user) {
        throw new ValidationError('user not found');
      }

      if (!user.password) {
        throw new ValidationError('Invalid identifier or password');
      }

      const validPassword = await getService('user').validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        throw new ValidationError('Invalid identifier or password');
      }

      const advancedSettings = await store.get({ key: 'advanced' });
      const requiresConfirmation = _.get(
        advancedSettings,
        'email_confirmation'
      );

      if (requiresConfirmation && user.confirmed !== true) {
        // throw new ApplicationError('Your account is not confirmed');
        return ctx.send({ user: await sanitizeUser(user, ctx) });
      }

      if (user.blocked === true) {
        throw new ApplicationError(
          'Your account has been blocked by an administrator'
        );
      }

      return ctx.send({
        jwt: getService('jwt').issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    }

    // Connect the user with the third-party provider.
    try {
      const user = await getService('providers').connect(provider, ctx.query);

      if (user.blocked) {
        throw new ForbiddenError(
          'Your account has been blocked by an administrator'
        );
      }

      return ctx.send({
        jwt: getService('jwt').issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } catch (error) {
      if (error.message === 'Email is already taken.') {
        return ctx.badRequest('email_taken');
      }
      // throw new ApplicationError(error.message);
      if (error.code === 'ETIMEDOUT') {
        return ctx.badRequest('timeout');
      }
      strapi.log.error('ApplicationError:', error.message);
      return ctx.badRequest('server');
    }
  };

  plugin.controllers.auth = ({ strapi }) => {
    return {
      ...baseControllers({ strapi }),
      register,
      sendEmailConfirmation,
      callback,
      emailConfirmation,
      forgotPassword,
    };
  };

  // custom route to update user
  plugin.controllers.user.updateMe = async (ctx: Context) => {
    const userId = ctx.state.user.documentId;
    // console.
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: {
        documentId: userId,
      },
    });
    // console.log('Updating user', userId, user);
    // console.log('With data', ctx.request.body);
    if (!user) {
      return ctx.notFound('User not found');
    }
    if (user.blocked) {
      return ctx.forbidden('User is blocked');
    }
    const email = ctx.request.body.email;
    if (email && email !== user.email) {
      const existingUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { email: email.toLowerCase() },
        });
      if (existingUser) {
        return ctx.badRequest('Email already in use');
      }
    }
    if (ctx.request.body.phone_number) {
      const existingUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: { phone_number: ctx.request.body.phone_number },
        });
      if (existingUser && existingUser.documentId !== userId) {
        return ctx.badRequest('Phone number already in use');
      }
    }
    try {
      const { body } = ctx.request;
      const result = await strapi
        .query('plugin::users-permissions.user')
        .update({
          where: { documentId: userId },
          data: body,
        });
      // console.log('User updated', result);
      return (ctx.response.status = 201);
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  };

  plugin.routes['content-api'].routes.push({
    method: 'PUT',
    path: '/users/me',
    handler: 'user.updateMe',
  });
  return plugin;
};
