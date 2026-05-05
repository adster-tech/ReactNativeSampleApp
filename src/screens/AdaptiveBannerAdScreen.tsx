// File: js/screens/AdaptiveBannerAdScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigation';
import { Header } from '../components/header';
import { AdaptiveBannerAd } from '../components/AdaptiveBannerAd';
import { showToastMessage } from '../utils/showToastMessage';
import { PlacementInfo } from '../components/PlacementInfo';
import { logPlacementRequest } from '../utils/logPlacementRequest';
import { samplePlacementNames } from '../constants/adPlacements';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdaptiveBannerAdScreen'
>;

// compute once: screen width in dp
const screenWidthDp = Dimensions.get('window').width / PixelRatio.get();
const iosAdaptiveBannerWidth = 320;
const iosAdaptiveBannerHeight = 50;

export default function AdaptiveBannerAdScreen({
  route,
  navigation,
}: Props) {
  const initialMode = route.params?.mode ?? 'anchored';
  const [mode, setMode] = useState<'inline' | 'anchored' | 'orientation'>(
    initialMode,
  );
  const placementId = samplePlacementNames.adaptiveBanner;
  const placementName = placementId;
  const inlineWidthDp = mode === 'inline' ? 320 : undefined;

  // banner state
  const [height, setHeight] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolvedHeight =
    height || (Platform.OS === 'ios' ? iosAdaptiveBannerHeight : 0);

  // refresh controls
  const [refreshing, setRefreshing] = useState(false);
  const [bannerKey, setBannerKey] = useState(0);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');

  // messages log
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    setLoaded(false);
    setError(null);
    setHeight(0);
    if (mode === 'anchored') {
      setPosition(Math.random() < 0.5 ? 'top' : 'bottom');
    }
  }, [mode, bannerKey]);

  useEffect(() => {
    logPlacementRequest(`Adaptive Banner (${mode})`, placementName);
  }, [bannerKey, mode, placementName]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setLoaded(false);
    setError(null);
    setMessages([]);         // clear old messages
    setBannerKey((k) => k + 1);
  }, []);

  const logAndToast = (msg: string) => {
    showToastMessage(msg);
    setMessages((prev) => [...prev, msg]);
  };

  const renderBanner = () => (
    <View
      style={[
        styles.adWrapper,
        Platform.OS === 'ios' && {
          width: iosAdaptiveBannerWidth,
          alignSelf: 'center',
        },
        mode === 'inline' && {
          width:
            Platform.OS === 'ios'
              ? iosAdaptiveBannerWidth
              : `${(inlineWidthDp! / screenWidthDp) * 100}%`,
          alignSelf: 'center',
        },
        { height: resolvedHeight },
      ]}
    >
      <AdaptiveBannerAd
        key={bannerKey}
        placementId={placementId}
        mode={mode}
        inlineWidthDp={inlineWidthDp}
        style={{
          width: Platform.OS === 'ios' ? iosAdaptiveBannerWidth : '100%',
          height: resolvedHeight,
        }}
        onAdLoaded={(e) => {
          const msg = 'Adaptive Ad loaded successfully';
          const impressionMsg = 'Adaptive Ad Impression';
          console.log(msg, e.nativeEvent);
          logAndToast(msg);
          logAndToast(impressionMsg);
          setHeight(e.nativeEvent.adHeight);
          setLoaded(true);
          setRefreshing(false);
        }}
        onAdFailedToLoad={(e) => {
          const msg = `Ad failed to load: ${e.nativeEvent.error}`;
          logAndToast(msg);
          if (mode === 'inline' && e.nativeEvent.error.includes('No fill')) {
            setMode('anchored');
          } else {
            setError(e.nativeEvent.error);
            setRefreshing(false);
          }
        }}
        onAdImpression={() => {
          const msg = 'Ad impression recorded';
          logAndToast(msg);
        }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <Header
          title={`Adaptive Banner (${mode})`}
          back
          onPressBack={() => navigation.goBack()}
        />
      </View>

      {/* Anchored ad at top */}
      {mode === 'anchored' && position === 'top' && (
        <View style={styles.anchoredTopBannerContainer}>{renderBanner()}</View>
      )}

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={[
          styles.container,
          mode === 'anchored' && position === 'top'
            ? styles.containerWithTopAnchoredBanner
            : null,
          mode === 'anchored' && position === 'bottom'
            ? styles.containerWithBottomAnchoredBanner
            : null,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <PlacementInfo
          format={`Adaptive Banner (${mode})`}
          placement={placementName}
        />
        {!loaded && !error && <ActivityIndicator style={styles.spinner} />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Inline banner */}
        {mode === 'inline' && renderBanner()}

        {/* Message log */}
        {messages.map((m, i) => (
          <Text key={i} style={styles.messageText}>
            {m}
          </Text>
        ))}
      </ScrollView>

      {/* Anchored ad at bottom */}
      {mode === 'anchored' && position === 'bottom' && (
        <View style={styles.anchoredBottomBannerContainer}>
          {renderBanner()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  container: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  containerWithTopAnchoredBanner: {
    paddingTop: Platform.OS === 'ios' ? 170 : 150,
  },
  containerWithBottomAnchoredBanner: {
    paddingBottom: Platform.OS === 'ios' ? 110 : 90,
  },
  spinner: {
    marginTop: 20,
  },
  adWrapper: {
    width: '100%',
    overflow: 'visible',
    marginTop: 16,
    minHeight: 50,
  },
  anchoredTopBannerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 92 : 80,
    left: 0,
    right: 0,
    zIndex: 5,
    alignItems: 'center',
  },
  anchoredBottomBannerContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    zIndex: 5,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});
