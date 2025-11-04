"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    await signIn("email", { email, redirect: false });
    setStatus("sent");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Entra na tua conta</h1>
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@email.com"
          />
        </div>
        <Button type="submit" className="w-full" disabled={status === "loading"}>
          Enviar link mágico
        </Button>
        {status === "sent" && (
          <p className="text-sm text-green-600">Verifica o teu email para entrar.</p>
        )}
      </form>
      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
          Continua com Google
        </Button>
      </div>
    </div>
  );
}
