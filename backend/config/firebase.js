/**
 * Firebase Configuration
 * Push notifications and real-time services
 */

const admin = require('firebase-admin');

let firebaseApp = null;

const initializeFirebase = () => {
  try {
    if (firebaseApp) return firebaseApp;

    // Check if Firebase credentials are available
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
      console.log('⚠️  Firebase credentials not found. Push notifications will be disabled.');
      console.log('   Set FIREBASE_PROJECT_ID and FIREBASE_CLIENT_EMAIL in .env to enable.');
      return null;
    }

    // Initialize with service account or application default
    const config = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      credential: admin.credential.cert({
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token'
      })
    };

    firebaseApp = admin.initializeApp(config);
    console.log('✅ Firebase initialized successfully');
    
    return firebaseApp;
  } catch (error) {
    console.error('⚠️  Firebase initialization error:', error.message);
    console.log('   Push notifications will be disabled.');
    return null;
  }
};

const getMessaging = () => {
  const app = initializeFirebase();
  return app ? admin.messaging() : null;
};

const getFirestore = () => {
  const app = initializeFirebase();
  return app ? admin.firestore() : null;
};

module.exports = {
  initializeFirebase,
  getMessaging,
  getFirestore,
  admin
};
