import React from 'react';
import { View } from 'react-native';

// Web-compatible blur effect fallback
export const BlurView = ({ children, style, blurType = 'light', ...props }) => {
  const blurStyle = {
    backgroundColor: blurType === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  return (
    <View style={[style, blurStyle]} {...props}>
      {children}
    </View>
  );
};

export default BlurView;