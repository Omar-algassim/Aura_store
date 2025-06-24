import cronTasks from './cron-tasks';

export default ({ env }) => ({
  host: env('HOST', 'localhost'),
  port: env.int('PORT', 1337),
  url: env('URL', 'http://127.0.0.1:1337'),
  app: {
    keys: env.array('APP_KEYS', ['myKeyA', 'myKeyB']),
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
});
