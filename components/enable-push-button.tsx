"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function EnablePushButton({ productId }: { productId?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "enabled">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setStatus("loading");
    setError(null);

    try {
      if (!("Notification" in window)) {
        throw new Error("O teu browser não suporta notificações push.");
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Precisamos da tua autorização para enviar notificações.");
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const vapidKey = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY;
      if (!vapidKey) {
        throw new Error("Chave pública Web Push não configurada.");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription, productId }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível guardar a subscrição.");
      }

      setStatus("enabled");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setStatus("idle");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="outline" onClick={handleClick} disabled={status === "loading"}>
        {status === "enabled" ? "Notificações ativas" : "Ativar notificações push"}
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
