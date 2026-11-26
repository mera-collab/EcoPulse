import { Platform } from 'react-native';

// Sustainable palette: deep forest, moss, sage, warm sand and a clay accent.
export const colors = {
  bg: '#F6F3EA', surface: '#FFFFFF', ink: '#14231B', muted: '#5E6F64',
  forest: '#0F3D2E', moss: '#2F6F4F', sage: '#DCE8DC', mint: '#EAF2EA',
  clay: '#C8793A', line: '#E4E0D2', good: '#2F7D4F', goodBg: '#E3F1E6',
  bad: '#B3412F', badBg: '#F8E4DF', white: '#FFFFFF',
};
export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });