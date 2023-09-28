export default [
  {
    context: ['/api'],
    target: 'http://localhost:8001/',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
  },
];
