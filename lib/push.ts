import webpush from "web-push";

const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;
const privateKey = process.env.WEB_PUSH_PRIVATE_KEY;
const contact = process.env.WEB_PUSH_CONTACT ?? "mailto:alerts@launchpulse.app";

if (publicKey && privateKey) {
  webpush.setVapidDetails(contact, publicKey, privateKey);
}

export async function sendPushNotification(subscription: { endpoint: string; keys: { p256dh: string; auth: string } }, payload: Record<string, any>) {
  if (!publicKey || !privateKey) {
    console.warn("Web Push não configurado");
    return;
  }

  await webpush.sendNotification(subscription, JSON.stringify(payload));
}
