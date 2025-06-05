import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="character"
        options={{
          title: 'Character',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="weapons"
        options={{
          title: 'Weapons',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sword.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="armor"
        options={{
          title: 'Armor',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="spells"
        options={{
          title: 'Spells',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bag.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
