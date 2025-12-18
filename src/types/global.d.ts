import 'react-native';

declare module 'react-native' {
  interface ViewStyle {
    position?: 'absolute' | 'relative' | 'fixed';
  }
}

declare global {
  const window: any;
}

export {};
