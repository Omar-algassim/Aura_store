export default () => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["phone_number", "first_name", "last_name"],
      },
      upload: {
        config: {
          sizeLimit: 20 * 1024 * 1024, // 20mb,
        },
      },
    },
  },
});
