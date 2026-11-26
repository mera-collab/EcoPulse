import { useWindowDimensions } from 'react-native';

// One hook that adapts the layout to phones, foldables, tablets and web/desktop.
export default function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isDesktop = width >= 1024;
  const columns = isDesktop ? 3 : isTablet ? 2 : 1;
  const scale = Math.min(Math.max(width / 390, 0.9), 1.25); // gentle text/spacing scaling
  const s = (n) => Math.round(n * scale);
  const pad = isTablet ? 32 : 20;
  const gap = isTablet ? 16 : 12;
  const contentWidth = Math.min(width, isDesktop ? 1100 : isTablet ? 820 : 650);
  const innerWidth = contentWidth - pad * 2;
  const cardWidth = (cols) => (innerWidth - gap * (cols - 1)) / cols;
  return { width, height, isTablet, isDesktop, landscape: width > height,
           columns, s, pad, gap, contentWidth, innerWidth, cardWidth };
}