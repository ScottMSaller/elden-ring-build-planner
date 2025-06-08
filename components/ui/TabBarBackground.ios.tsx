import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function BlurTabBarBackground() {
  return (
    <>
      <BlurView
        // System chrome material automatically adapts to the system's theme
        // and matches the native tab bar appearance on iOS.
        tint="dark"
        intensity={100}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
    </>
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
