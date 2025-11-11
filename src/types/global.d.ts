// global.d.ts
import 'react-native';

declare module 'react-native' {
  interface ViewStyle {
    position?: 'absolute' | 'relative' | 'fixed';
  }
}

// ✅ Make window available globally
declare global {
  const window: any;
}

export {};
