import React from 'react';
import { Platform, View, Text } from 'react-native';

// Web-compatible component imports
export const getLinearGradient = () => {
  if (Platform.OS === 'web') {
    try {
      return require('react-native-web-linear-gradient').default;
    } catch (e) {
      // Fallback for web
      return ({ colors, style, children, ...props }) => (
        <View style={[style, { backgroundColor: colors[0] }]} {...props}>
          {children}
        </View>
      );
    }
  }
  return require('react-native-linear-gradient').default;
};

export const getIcon = () => {
  if (Platform.OS === 'web') {
    // Web fallback icon component
    return ({ name, size = 24, color = '#000', style, ...props }) => {
      const iconMap = {
        'home': '🏠',
        'home-outline': '🏠',
        'trophy': '🏆',
        'trophy-outline': '🏆',
        'flame': '🔥',
        'flame-outline': '🔥',
        'trending-up': '📈',
        'trending-up-outline': '📈',
        'wallet': '💰',
        'wallet-outline': '💰',
        'chevron-back': '←',
        'chevron-forward': '→',
        'add': '+',
        'refresh': '↻',
        'filter': '⚙️',
        'search': '🔍',
        'heart': '❤️',
        'heart-outline': '♡',
        'checkmark': '✓',
        'close': '✕',
        'american-football': '🏈',
        'basketball': '🏀',
        'baseball': '⚾',
        'ice-cream': '🏒',
        'school': '🎓',
        'analytics': '📊',
        'pulse': '💓',
        'cash': '💵',
        'people': '👥',
        'diamond': '💎',
        'location': '📍',
        'eye': '👁️',
        'water': '💧',
        'person-circle-outline': '👤',
        'add-circle-outline': '➕',
        'time': '⏰',
        'checkmark-circle': '✅',
        'close-circle': '❌',
        'list': '📋',
        'swap-vertical': '↕️',
        'person': '👤',
        'remove': '➖',
        'trending-down': '📉',
        'stats-chart': '📊',
        'calendar': '📅',
        'newspaper': '📰',
        'share': '📤',
        'trash': '🗑️',
        'help': '❓',
      };
      
      const iconText = iconMap[name] || '•';
      
      return (
        <Text style={[{
          fontSize: size,
          color,
          lineHeight: size,
          textAlign: 'center',
        }, style]} {...props}>
          {iconText}
        </Text>
      );
    };
  }
  return require('react-native-vector-icons/Ionicons').default;
};

export const getBlurView = () => {
  if (Platform.OS === 'web') {
    return require('../components/WebBlur').BlurView;
  }
  return require('@react-native-community/blur').BlurView;
};

export const getHapticFeedback = () => {
  if (Platform.OS === 'web') {
    return require('../components/WebHaptics').default;
  }
  return require('react-native-haptic-feedback').default;
};

export const getCharts = () => {
  if (Platform.OS === 'web') {
    return require('../components/WebCharts');
  }
  return require('react-native-chart-kit');
};