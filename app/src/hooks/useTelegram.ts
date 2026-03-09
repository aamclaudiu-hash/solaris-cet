import { useEffect, useState } from 'react';

interface TelegramWebApp {
  expand: () => void;
  ready: () => void;
  enableClosingConfirmation: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (fn: () => void) => void;
  };
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (fn: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface UseTelegramResult {
  isTelegram: boolean;
  tg: TelegramWebApp | null;
  haptic: (style?: 'light' | 'medium' | 'heavy') => void;
}

const getTelegramWebApp = (): TelegramWebApp | null => {
  const webApp = window.Telegram?.WebApp;
  return webApp?.initData ? webApp : null;
};

export const useTelegram = (): UseTelegramResult => {
  // Lazily detect Telegram WebApp at initialization time (not inside an effect)
  const [tg] = useState<TelegramWebApp | null>(getTelegramWebApp);
  const isTelegram = tg !== null;

  useEffect(() => {
    if (!tg) return;

    tg.expand();
    tg.ready();
    tg.enableClosingConfirmation();

    // Apply Telegram theme colours as CSS variables
    if (tg.themeParams.bg_color) {
      document.documentElement.style.setProperty(
        '--tg-theme-bg-color',
        tg.themeParams.bg_color
      );
    }
    if (tg.themeParams.text_color) {
      document.documentElement.style.setProperty(
        '--tg-theme-text-color',
        tg.themeParams.text_color
      );
    }
  }, [tg]);

  const haptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    tg?.HapticFeedback?.impactOccurred(style);
  };

  return { isTelegram, tg, haptic };
};
