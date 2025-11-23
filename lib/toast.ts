import { ToastVanilla } from 'toast-vanilla';

export const toast = new ToastVanilla({
  maxItemToRender: 5,
  position: 'bottom-right',
  duration: 4000,
  styles: {
    background: 'var(--card)',
    primaryTextColor: 'var(--primary)',
    primaryTextColorForeground: 'var(--primary-foreground)',
    secondaryTextColor: 'var(--secondary)',
    secondaryTextColorForeground: 'var(--secondary-foreground)',
    border: 'var(--border)',
  },
});
