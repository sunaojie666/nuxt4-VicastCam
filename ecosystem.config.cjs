module.exports = {
  apps: [
    {
      name: 'www-vicastcam-com',
      cwd: __dirname,
      script: '.output/server/index.mjs',
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
        NUXT_PUBLIC_SITE_URL: 'https://www.vicastcam.com',
        NUXT_SITE_URL: 'https://www.vicastcam.com',
        NUXT_PUBLIC_STRAPI_URL: 'https://cms.vicastcam.com',
      },
    },
  ],
};
