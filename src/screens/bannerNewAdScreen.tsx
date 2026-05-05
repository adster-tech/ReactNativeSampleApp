// File: js/screens/BannerNewAdScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import { Header } from '../components/header';
import { NavigationProp } from '@react-navigation/native';
import {
  BannerAdEvent,
  BannerAdView,
} from 'razorpay-ads-react-native';
import { showToastMessage } from '../utils/showToastMessage';
import { Button } from '../components/button';
import { PlacementInfo } from '../components/PlacementInfo';
import { logPlacementRequest } from '../utils/logPlacementRequest';
import { samplePlacementNames } from '../constants/adPlacements';

const bannerPlacementName = samplePlacementNames.banner300x250;

export const BannerNewAdScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  // state
  const [loadError, setLoadError] = useState(false);
  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [adKey, setAdKey] = useState(0);

  // pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);

  // common reset & reload logic
  const resetAndReload = useCallback(() => {
    setLoadError(false);
    setToastMessages([]);
    setLoading(true);
    setAdKey((k) => k + 1);
  }, []);

  // pull‑to‑refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetAndReload();
  }, [resetAndReload]);

  useEffect(() => {
    logPlacementRequest('Banner 300x250', bannerPlacementName);
  }, [adKey]);

  return (
    <View style={styles.container}>
      <Header
        title="Banner Ad 300X250"
        back
        onPressBack={() => navigation.canGoBack() && navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.viewContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <PlacementInfo format="Banner 300x250" placement={bannerPlacementName} />

        <BannerAdView
          key={`banner-new-${adKey}`}
          bannerContainerStyle={styles.bannerContainer}
          placementName={bannerPlacementName}
          onAdLoaded={(event: BannerAdEvent) => {
            const message = event.nativeEvent.message;
            showToastMessage('Banner Ad loaded successfully');
            setToastMessages((prev) => [...prev, message]);
            setLoadError(false);
            setLoading(false);
            setRefreshing(false);
          }}
          onAdLoadFailure={(event: BannerAdEvent) => {
            const error = event.nativeEvent.error;
            showToastMessage('Banner Ad failed to load');
            setToastMessages((prev) => [...prev, `Load failure: ${error}`]);
            setLoadError(true);
            setLoading(false);
            setRefreshing(false);
          }}
          onAdClicked={(event: BannerAdEvent) => {
            const message = event.nativeEvent.message;
            showToastMessage('Banner Ad clicked');
            setToastMessages((prev) => [...prev, message]);
          }}
          onAdImpression={(event: BannerAdEvent) => {
            const message = event.nativeEvent.message;
            showToastMessage('Banner Ad impression');
            setToastMessages((prev) => [...prev, message]);
          }}
          onAdRevenuePaid={(event: BannerAdEvent) => {
            const msg = event.nativeEvent.message;
            const revenue = event.nativeEvent.revenue;
            console.log('Banner Ad Revenue Paid: ' + revenue, msg);
            showToastMessage('Banner Ad Revenue Paid');
          }}
        />

        {loadError && (
          <Button title="Reload Banner Ad" onPress={resetAndReload} />
        )}

        {toastMessages.map((msg, idx) => (
          <Text key={idx} style={styles.toastMessage}>
            {msg}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 20,
  },
  bannerContainer: {
    marginVertical: 20,
    width: Platform.OS === 'ios' ? 300 : 320,
    height: Platform.OS === 'ios' ? 250 : 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  toastMessage: {
    fontSize: 15,
    color: 'black',
    width: '80%',
    textAlign: 'center',
  },
});
