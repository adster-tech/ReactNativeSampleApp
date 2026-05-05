import { Platform, ToastAndroid } from 'react-native';

export const showToastMessage = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
    return;
  }

  console.log('[Adster Sample Toast]', message);
};
