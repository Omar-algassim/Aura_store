import axios from 'axios';

export default (plugin) => {
  plugin.services.email = {
    send: async (options) => {
      try {
        const { to, subject, html } = options;

        if (!to || !subject) {
          throw new Error('Missing required email fields: to, subject');
        }

        const payload = {
          to,
          subject,
          html,
        };

        const response = await axios.post(
          process.env.EMAIL_PROVIDER_API,
          payload,
          {
            headers: {
              Authorization: `Bearer ${process.env.EMAIL_PROVIDER_AUTH_TOKEN}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          }
        );

        strapi.log.info('Email sent successfully', {
          to: payload.to,
          subject: payload.subject,
        });

        return response.data;
      } catch (error) {
        strapi.log.error('Email sending failed', {
          error: error.message,
          to: options.to,
          subject: options.subject,
        });

        throw new Error(
          `Email sending failed: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    },
  };

  return plugin;
};
