import React from 'react';
import {
  Platform,
  requireNativeComponent,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {
  BannerAdEvent,
  BannerAdView,
} from 'razorpay-ads-react-native';
import { samplePlacementNames } from '../constants/adPlacements';

interface Props extends ViewProps {
  placementId: string;
  mode?: 'inline' | 'anchored' | 'orientation';
  inlineWidthDp?: number;
  onAdLoaded?: (event: any) => void;
  onAdFailedToLoad?: (event: any) => void;
  onAdImpression?: (event: any) => void;
}

const NativeAdaptiveBannerAd = requireNativeComponent<Props>('RNBannerAdView');

export const AdaptiveBannerAd = ({
  onAdFailedToLoad,
  onAdImpression,
  onAdLoaded,
  placementId: _placementId,
  style,
  ...rest
}: Props) => {
  if (Platform.OS === 'ios') {
    const flattenedStyle = StyleSheet.flatten(style) || {};
    const bannerStyle: ViewStyle = {
      ...flattenedStyle,
      width:
        typeof flattenedStyle.width === 'number' ? flattenedStyle.width : 320,
      height:
        typeof flattenedStyle.height === 'number' ? flattenedStyle.height : 50,
      alignSelf: 'center',
    };

    return (
      <BannerAdView
        bannerContainerStyle={bannerStyle}
        placementName={samplePlacementNames.adaptiveBanner}
        onAdLoaded={(event: BannerAdEvent) => {
          onAdLoaded?.({
            nativeEvent: {
              ...event.nativeEvent,
              adHeight: 50,
            },
          });
        }}
        onAdLoadFailure={(event: BannerAdEvent) => {
          onAdFailedToLoad?.(event);
        }}
        onAdImpression={(event: BannerAdEvent) => {
          onAdImpression?.(event);
        }}
      />
    );
  }

  return (
    <NativeAdaptiveBannerAd
      {...rest}
      placementId={_placementId}
      style={style}
      onAdLoaded={onAdLoaded}
      onAdFailedToLoad={onAdFailedToLoad}
      onAdImpression={onAdImpression}
    />
  );
};
