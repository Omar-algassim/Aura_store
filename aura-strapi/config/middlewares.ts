export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'https://auraglowups.com',
        'https://www.auraglowups.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      headers: [
        // Essential
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',

        // Browser/standard
        'Accept-Encoding',
        'Accept-Language',
        'Cache-Control',
        'Pragma',
        'Referer',
        'User-Agent',

        // Security / Auth
        'X-Requested-With',
        'X-CSRF-Token',
      ],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
