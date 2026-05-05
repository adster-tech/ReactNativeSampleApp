import { Platform } from 'react-native';

const selectPlacement = (ios: string, android: string) =>
  Platform.select({
    ios,
    default: android,
  }) as string;

export const samplePlacementNames = {
  banner: selectPlacement('adster_banner_320x50', 'Adster_Banner_Test'),
  banner320x50: selectPlacement('adster_banner_320x50', 'adster_banner_320x50'),
  banner300x250: selectPlacement('adster_banner_300x250', 'gam_banner_0'),
  interstitial: selectPlacement('adster_interstitial_test', 'Adster_Interstitial_Test'),
  rewarded: selectPlacement('adster_rewarded_test', 'gam_rewarded_0'),
  native: selectPlacement('adster_native_test', 'Adster_Native_Test'),
  unified: selectPlacement('adster_unified_test', 'Adster_Unified_Test'),
  adaptiveBanner: selectPlacement('adster_banner_320x50', 'adster_banner_320x50'),
} as const;
