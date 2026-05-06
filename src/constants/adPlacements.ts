import { Platform } from 'react-native';

const selectPlacement = (ios: string, android: string) =>
  Platform.select({
    ios,
    default: android,
  }) as string;

export const samplePlacementNames = {
  banner: selectPlacement('adster_banner_320x50', 'adster_banner_320x50'),
  banner320x50: selectPlacement('adster_banner_320x50', 'adster_banner_320x50'),
  banner300x250: selectPlacement('adster_banner_300x250', 'adster_banner_300x250'),
  interstitial: selectPlacement('adster_interstitial_test', 'adster_interstitial_test'),
  rewarded: selectPlacement('adster_rewarded_test', 'adster_rewarded_test'),
  native: selectPlacement('adster_native_test', 'adster_native_test'),
  unified: selectPlacement('adster_unified_test', 'adster_unified_test'),
  adaptiveBanner: selectPlacement('adster_banner_320x50', 'adster_banner_320x50'),
} as const;
