
/**
 * Firebase Messaging Service Worker
 * Handles push notifications in the background
 */

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase configuration (same as client)
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDevelopment",
  authDomain: "foodzap-demo.firebaseapp.com",
  projectId: "foodzap-demo",
  storageBucket: "foodzap-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'FoodZap';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/assets/logo-192x192.png',
    badge: '/assets/badge-72x72.png',
    tag: payload.data?.type || 'default',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'View Order'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ],
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received:', event);

  event.notification.close();

  // Determine URL to open based on notification data
  let url = '/pages/index.html';
  const data = event.notification.data;

  if (data?.orderId) {
    url = `/pages/order-tracking.html?orderId=${data.orderId}`;
  } else if (data?.type === 'PROMOTION') {
    url = '/pages/offers.html';
  }

  // Handle action buttons
  if (event.action === 'close') {
    return;
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then((client) => {
            if ('navigate' in client) {
              return client.navigate(url);
            }
          });
        }
      }

      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle push event (for non-Firebase push)
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push received:', event);

  let data = {};
  try {
    data = event.data?.json() || {};
  } catch (e) {
    data = {
      notification: {
        title: 'FoodZap',
        body: event.data?.text() || 'You have a new notification'
      }
    };
  }

  const title = data.notification?.title || 'FoodZap';
  const options = {
    body: data.notification?.body || '',
    icon: data.notification?.icon || '/assets/logo-192x192.png',
    badge: '/assets/badge-72x72.png',
    tag: data.data?.type || 'default',
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle service worker install
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker installed');
  self.skipWaiting();
});

// Handle service worker activate
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker activated');
  event.waitUntil(clients.claim());
});
