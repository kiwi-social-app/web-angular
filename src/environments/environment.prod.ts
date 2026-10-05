export const environment = {
  production: true,
  apiUrl: '/api',
  wsUrl: 'wss://kiwi-backend-448989396094.europe-west1.run.app/api/ws',
  // Semantic search needs an embeddings provider, which production doesn't have yet
  searchEnabled: false,
  firebase: {
    apiKey: 'AIzaSyBa0jYj5WZhDU7O24ySqAoq1niJW0z-mX8',
    authDomain: 'kiwi-social.firebaseapp.com',
    projectId: 'kiwi-social',
    storageBucket: 'kiwi-social.firebasestorage.app',
    messagingSenderId: '448989396094',
    appId: '1:448989396094:web:1827bc240298f9ccacac2f',
    measurementId: 'G-LRLYL8BMM8',
  },
};
