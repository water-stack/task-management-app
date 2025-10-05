import { apiService } from './api';

// Convert Base64 public VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function getVapidPublicKey() {
  try {
    const res = await apiService.getVapidPublicKey();
    if (res && res.success && res.key) return res.key;
  } catch (_) {
    // ignore and fallback to env
  }
  const envKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
  if (!envKey) {
    throw new Error('VAPID public key is not configured. Set it on the server or in REACT_APP_VAPID_PUBLIC_KEY.');
  }
  return envKey;
}

export async function ensureSubscribed() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Workers are not supported in this browser.');
  }
  if (!('PushManager' in window)) {
    throw new Error('Push API is not supported in this browser.');
  }
  if (!('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser.');
  }

  // Request permission if needed
  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  const registration = await navigator.serviceWorker.ready;

  // Check existing subscription
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    const vapidPublicKey = await getVapidPublicKey();
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
  }

  // Persist subscription on backend
  const subJSON = subscription.toJSON ? subscription.toJSON() : subscription;
  await apiService.subscribePush(subJSON);

  return subscription;
}

export async function unsubscribePush() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      try {
        await apiService.unsubscribePush(subscription.endpoint);
      } catch (_) {
        // ignore server errors during logout
      }
      await subscription.unsubscribe();
    }
  } catch (_) {
    // ignore
  }
}

export const pushService = {
  ensureSubscribed,
  unsubscribePush,
};