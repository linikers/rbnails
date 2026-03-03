"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";

// Tipagem correta do evento (não existe no tslib padrão)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Guard SSR: só executa no browser
    if (typeof window === "undefined") return;

    // Verifica se o app já está rodando como PWA instalado
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // Compatibilidade iOS Safari
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    // Se já está instalado, não mostra o botão
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Cleanup para evitar memory leak
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    // Independente da escolha, limpa o estado
    setDeferredPrompt(null);
    setShowButton(false);

    if (outcome === "accepted") {
      console.log("✅ PWA instalado pelo usuário.");
    }
  };

  // Não renderiza nada se não deve mostrar (SSR-safe)
  if (!showButton) return null;

  return (
    <Button
      onClick={installApp}
      variant="contained"
      size="small"
      sx={{ textTransform: "none", gap: 1 }}
    >
      📲 Instalar App
    </Button>
  );
}
