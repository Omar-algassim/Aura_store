export default ({ env }) => ({
  'users-permissions': {
    config: {
      register: {
        allowedFields: ['phone_number', 'first_name', 'last_name'],
      },
    },
  },
  upload: {
    config: {
      sizeLimit: 20 * 1024 * 1024, // 20 MB,
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('EMAIL_HOST', 'mail.privateemail.com'),
        port: parseInt(env('EMAIL_PORT', 10)) || 587,
        secure: false,
        auth: {
          user: env('EMAIL_FROM', 'info@auraglowups.com'),
          pass: env('EMAIL_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'info@auraglowups.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'info@auraglowups.com'),
      },
    },
  },
});
