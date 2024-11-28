export default () => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["phone_number", "first_name", "last_name"],
      },
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
      host: process.env.SMTP_HOST,  // mailtrap.io
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USERNAME,  // mailtrap.io
        pass: process.env.SMTP_PASSWORD  // mailtrap.io
      },
    },
    settings: {
      defaultFrom: 'mojjoj982@gmail.com',  // need to be changed to domain email
      defaultReplyTo: 'mojjoj982@gmail.com',  // need to be changed to domain email
    },
    }
  }
});
