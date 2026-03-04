"use client";

import { useEffect, useState } from "react";
import { Button, Box, Typography, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddBoxIcon from "@mui/icons-material/AddBox";

// Tipagem correta (não incluída no TypeScript padrão)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Detecta iOS (iPhone, iPad, iPod)
function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

// Detecta se está em modo standalone (PWA já instalado)
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroidButton, setShowAndroidButton] = useState(false);
  const [showIOSBanner, setShowIOSBanner] = useState(false);

  useEffect(() => {
    // Guard SSR
    if (typeof window === "undefined") return;

    // Se já está instalado como PWA, não mostra nada
    if (isStandalone()) return;

    // iOS Safari: não tem beforeinstallprompt, mostra banner de instrução
    if (isIOS()) {
      setShowIOSBanner(true);
      return;
    }

    // Android/Chrome/Edge: captura o evento de instalação nativo
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowAndroidButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Instala via prompt nativo (Android/Chrome/Edge)
  const installApp = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowAndroidButton(false);
    if (outcome === "accepted") {
      console.log("✅ PWA instalado.");
    }
  };

  // Botão Android/Chrome — instalação programática
  if (showAndroidButton) {
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

  // Banner iOS — instrução manual (único jeito no Safari)
  if (showIOSBanner) {
    return (
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "primary.light",
          backgroundColor: "primary.50",
          position: "relative",
          maxWidth: 400,
        }}
      >
        <IconButton
          size="small"
          onClick={() => setShowIOSBanner(false)}
          sx={{ position: "absolute", top: 6, right: 6 }}
          aria-label="Fechar"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ mt: 0.5, color: "primary.main" }}>📲</Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
            Instale o app no iPhone
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            1. Toque em{" "}
            <IosShareIcon sx={{ fontSize: 16, color: "primary.main" }} />{" "}
            <strong>Compartilhar</strong>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            2. Toque em{" "}
            <AddBoxIcon sx={{ fontSize: 16, color: "primary.main" }} />{" "}
            <strong>Adicionar à Tela de Início</strong>
          </Typography>
        </Box>
      </Paper>
    );
  }

  return null;
}
