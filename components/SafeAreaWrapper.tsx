import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SafeAreaWrapperProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function SafeAreaWrapper({ children, style }: SafeAreaWrapperProps) {
  return (
    <SafeAreaView style={[styles.wrapper, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 16,
  },
});
