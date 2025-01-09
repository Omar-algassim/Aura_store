// src/extensions/users-permissions/strapi-server.ts

import { Context } from "koa";
import { errors } from "@strapi/utils";
import axios from "axios";
import crypto from "crypto";
import _ from "lodash";
import { env } from "@strapi/utils";

const { ApplicationError, ForbiddenError, ValidationError } = errors;

interface CallbackBody {
  identifier: string;
  password: string;
}
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

const getService = (name: string) => {
  return strapi.plugin("users-permissions").service(name);
};

const sanitizeUser = (user: any, ctx: any) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};
const sendWhatsappMessage = async (
  user: any,
  token: string,
  template: string
) => {
  const phone_number = user.phone_number;
  if (!phone_number) {
    throw new ApplicationError("cannot find the user phone number");
  }
  //send whatsapp message using facebook api
  const whats_token =
    "EAAPZCARdfZCBIBO6B602HIXYHdELBub6z5Mxi3899aq8pSiI0LZAL1oiD2hmG0JWwSGaZCq6pVcpjqRLCGvZA8TbUUMd4W8JmwyZAjZCplULIWWjDtDbPdg5G6ThePSqqZAHfUlK4OWZCPG5wCUcHBeuXwfA4IDx8Flz3UDDj1lPo0uhaZCZAMXZCCfcWPxcVVvi8XTl8Bz4AuQM2NJ5PslNbQZBK95m5E50RDwZDZD";
  const sender = "487217607808179";
  const url = `https://graph.facebook.com/v12.0/${sender}/messages`;
  const phone_num = phone_number.replace(/\s/g, "");
  const clean_num = phone_num ? `${phone_num.slice(1)}` : phone_num;
  const sep_token = `${token.slice(0, 3)}-${token.slice(3, 6)}`;
  console.log("clean_num", clean_num);
  const headrs = {
    Authorization: `Bearer ${whats_token}`,
    "Content-Type": "application/json",
  };
  const data = {
    messaging_product: "whatsapp",
    to: clean_num,
    type: "template",
    template: {
      name: template,
      language: {
        code: "en_US",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: sep_token,
            },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: token,
            },
          ],
        },
      ],
    },
  };

  axios
    .post(url, data, { headers: headrs })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(JSON.stringify(error, null, 2));
    });
};
const validateCallbackBody = async (params: CallbackBody) => {
  if (!params.identifier || !params.password) {
    throw new ApplicationError("identifier and password is required");
  }
};
const validateSendEmailConfirmationBody = async (body: ForgotPasswordBody) => {
  if (!body.email && !body.phone_number) {
    throw new ApplicationError("Either email or phone number isrequired");
  }

  if (body.email && body.phone_number) {
    throw new ApplicationError("please provide Email or phone number not both");
  }

  if (body.phone_number && !/^\+?[\d\s-]{10,}$/.test(body.phone_number)) {
    throw new ApplicationError("Please provide a valid phone number");
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw new ApplicationError("Please provide a valid email");
  }
  return body;
};
const validateForgotPasswordBody = async (body: ForgotPasswordBody) => {
  if (!body.email && !body.phone_number) {
    throw new ApplicationError("Either email or phone number is required");
  }

  if (body.phone_number && !/^\+?[\d\s-]{10,}$/.test(body.phone_number)) {
    throw new ApplicationError("Please provide a valid phone number");
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw new ApplicationError("Please provide a valid email");
  }

  return body;
};
const validateEmailConfirmationBody = async (query: any) => {
  const { confirmation } = query;
  if (!confirmation) {
    throw new ApplicationError("Confirmation token is required");
  }

  return { confirmation };
};

const validateRegistrationData = (data: CustomRegistrationBody) => {
  if (!data.email && !data.phone_number) {
    throw new Error("Either email or phone number is required");
  }

  if (data.email && data.phone_number) {
    throw new Error("Please provide either email or phone number, not both");
  }

  if (data.phone_number && !/^\+?[\d\s-]{10,}$/.test(data.phone_number)) {
    throw new Error("Please provide a valid phone number");
  }
};

export default async (plugin: any) => {
  const baseControllers = await plugin.controllers.auth;

  const register = async (ctx: Context) => {
    const { body } = ctx.request;
    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    const settings = (await pluginStore.get({ key: "advanced" })) as any;
    if (!settings.allow_register) {
      throw new ApplicationError("Register action is currently disabled");
    }

    const alwaysAllowedKeys = ["username", "password", "email", "phone_number"];
    // Validate request body
    try {
      validateRegistrationData(body);
    } catch (error: any) {
      return ctx.badRequest(error.message);
    }

    // Generate username if not provided
    const username =
      body.username ||
      (body.email ? body.email.split("@")[0] : `user_${Date.now()}`);

    const role = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: settings.default_role } });
    //check the role
    if (!role) {
      throw new ApplicationError("Impossible to find the default role");
    }

    // Check if user exists
    const userExists = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          $or: [{ email: body.email }, { phone_number: body.phone_number }],
        },
      });

    if (userExists) {
      throw new ApplicationError(
        "Username, email, or phone number already taken"
      );
    }

    const newUser = {
      ...body,
      role: role.id,
      email: body.email ? body.email.toLowerCase() : undefined,
      username,
      phone_number: body.phone_number,
      confirmed: !settings.email_confirmation,
    };

    const user = await strapi
      .service("plugin::users-permissions.user")
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
          { messages: [{ id: "Auth.error.email.invalid" }] },
        ]);
      }

      return ctx.send({ user: sanitizedUser });
    }

    const jwt = strapi.service("plugin::users-permissions.jwt").issue({
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

    const userService = getService("user");
    const jwtService = getService("jwt");

    const [user] = await userService.fetchAll({
      filters: { confirmationToken },
    });

    if (!user) {
      throw new ValidationError("Invalid token");
    }

    await userService.edit(user.id, {
      confirmed: true,
      confirmationToken: null,
    });

    if (returnUser || confirmationToken.length === 6) {
      ctx.send({
        jwt: jwtService.issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } else {
      const settings: any = await strapi
        .store({ type: "plugin", name: "users-permissions", key: "advanced" })
        .get();

      ctx.redirect(settings.email_confirmation_redirection || "/");
    }
  };

  const forgotPassword = async (ctx: Context) => {
    const { email } = await validateForgotPasswordBody(ctx.request.body);

    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    const emailSettings = await pluginStore.get({ key: "email" });
    const advancedSettings: any = await pluginStore.get({ key: "advanced" });

    // Find the user by email or phone number.
    if (email) {
      var user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { email: email.toLowerCase() } });
    } else {
      const { phone_number } = await validateForgotPasswordBody(
        ctx.request.body
      );
      var user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { phone_number } });
    }
    if (!user || user.blocked) {
      return ctx.send({ error: "user Blocked or not found" });
    }

    const userInfo = await sanitizeUser(user, ctx);

    // Generate random token.
    const resetPasswordToken = crypto.randomBytes(3).toString("hex");

    const resetPasswordSettings: any = _.get(
      emailSettings,
      "reset_password.options",
      {}
    );
    const emailBody = await getService("users-permissions").template(
      resetPasswordSettings.message,
      {
        URL: advancedSettings.email_reset_password,
        SERVER_URL: strapi.config.get("server.absoluteUrl"),
        ADMIN_URL: strapi.config.get("admin.absoluteUrl"),
        USER: userInfo,
        TOKEN: resetPasswordToken,
      }
    );

    const emailObject = await getService("users-permissions").template(
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
    await getService("user").edit(user.id, { resetPasswordToken });

    // Send an email to the user or whatsapp message if there use phone number.
    if (email) {
      await strapi.plugin("email").service("email").send(emailToSend);
    } else {
      await sendWhatsappMessage(user, resetPasswordToken, "reset_password");
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
        .query("plugin::users-permissions.user")
        .findOne({
          where: { phone_number },
        });
    } else {
      var user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email: email.toLowerCase() },
        });
    }

    if (!user) {
      return ctx.send({ email, sent: true });
    }

    if (user.confirmed) {
      throw new ApplicationError("Already confirmed");
    }

    if (user.blocked) {
      throw new ApplicationError("User blocked");
    }
    if (email) {
      await getService("user").sendConfirmationEmail(user);
      ctx.send({
        email: user.email,
        sent: true,
      });
    } else {
      const confirmationToken = crypto.randomBytes(3).toString("hex");
      await getService("user").edit(user.id, { confirmationToken });
      sendWhatsappMessage(user, confirmationToken, "verify_code");
      ctx.send({
        email: user.phone_number,
        sent: true,
      });
    }
  };

  const callback = async (ctx: Context) => {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;

    const store = strapi.store({ type: "plugin", name: "users-permissions" });
    const grantSettings = await store.get({ key: "grant" });

    const grantProvider = provider === "local" ? "email" : provider;

    if (!_.get(grantSettings, [grantProvider, "enabled"])) {
      throw new ApplicationError("This provider is disabled");
    }

    if (provider === "local") {
      await validateCallbackBody(params);

      const { identifier } = params;

      // Check if the user exists.
      const user = await strapi.db
        .query("plugin::users-permissions.user")
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
        throw new ValidationError("user not found");
      }

      if (!user.password) {
        throw new ValidationError("Invalid identifier or password");
      }

      const validPassword = await getService("user").validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        throw new ValidationError("Invalid identifier or password");
      }

      const advancedSettings = await store.get({ key: "advanced" });
      const requiresConfirmation = _.get(
        advancedSettings,
        "email_confirmation"
      );

      if (requiresConfirmation && user.confirmed !== true) {
        throw new ApplicationError("Your account is not confirmed");
      }

      if (user.blocked === true) {
        throw new ApplicationError(
          "Your account has been blocked by an administrator"
        );
      }

      return ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    }

    // Connect the user with the third-party provider.
    try {
      const user = await getService("providers").connect(provider, ctx.query);

      if (user.blocked) {
        throw new ForbiddenError(
          "Your account has been blocked by an administrator"
        );
      }

      return ctx.send({
        jwt: getService("jwt").issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } catch (error) {
      throw new ApplicationError(error.message);
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
  return plugin;
};
