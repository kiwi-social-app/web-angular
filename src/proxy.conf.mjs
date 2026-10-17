const target = process.env.API_TARGET ?? 'http://localhost:8080';

export default {
  '/api': {
    target,
    secure: true,
    changeOrigin: true,
    ws: true,
    headers: { origin: new URL(target).origin },
  },
};
