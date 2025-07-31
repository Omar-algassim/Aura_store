import axios from 'axios';

export default async (plugin) => {
  plugin.services.email = {
    send: async (options) => {
      const { to, subject, html } = options;
      const response = await axios.post(
        process.env.EMAIL_PROVIDER_API,
        {
          to,
          subject,
          html,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.EMAIL_PROVIDER_AUTH_TOKEN}`,
          },
        }
      );
      return response.data;
    },
  };
};
