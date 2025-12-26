// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: '/api',
  wsUrl: '/ws',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
