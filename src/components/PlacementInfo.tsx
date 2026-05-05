import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

export const PlacementInfo = ({
  format,
  placement,
}: {
  format: string;
  placement: string;
}) => {
  return (
    <Text style={styles.text}>
      {format} placement: {placement}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    width: '90%',
    color: '#4a4a4a',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Menlo',
      default: 'monospace',
    }),
  },
});
