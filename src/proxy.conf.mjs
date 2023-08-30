export default [
  {
    context: ['/api'],
    target: 'https://shongo-dev.cesnet.cz:8001/',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
];
