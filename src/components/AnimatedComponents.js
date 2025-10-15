import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Fade In Animation Component
export const FadeInView = ({ children, delay = 0, duration = 500, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, delay, duration]);

  return (
    <Animated.View style={[style, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

// Slide In From Bottom Animation
export const SlideInView = ({ children, delay = 0, duration = 600, style }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [slideAnim, opacityAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Scale Animation Component
export const ScaleView = ({ children, delay = 0, duration = 500, style }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration * 0.8,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [scaleAnim, opacityAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Pulse Animation for Live Indicators
export const PulseView = ({ children, style, pulseColor = '#FF3B30' }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Shimmer Loading Effect
export const ShimmerView = ({ width: shimmerWidth = 200, height: shimmerHeight = 20, style }) => {
  const shimmerAnim = useRef(new Animated.Value(-shimmerWidth)).current;

  useEffect(() => {
    const shimmer = () => {
      shimmerAnim.setValue(-shimmerWidth);
      Animated.timing(shimmerAnim, {
        toValue: shimmerWidth,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => shimmer());
    };

    shimmer();
  }, [shimmerAnim, shimmerWidth]);

  return (
    <View
      style={[
        {
          width: shimmerWidth,
          height: shimmerHeight,
          backgroundColor: '#E1E9EE',
          overflow: 'hidden',
          borderRadius: 4,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: '#F7F8FA',
            transform: [{ translateX: shimmerAnim }],
          },
        ]}
      />
    </View>
  );
};

// Bounce Animation for Interactive Elements
export const BounceView = ({ children, style, onPress, disabled = false }) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    
    Animated.spring(bounceAnim, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    Animated.spring(bounceAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: bounceAnim }],
        },
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      {children}
    </Animated.View>
  );
};

// Rotating Animation for Refresh Icons
export const RotateView = ({ children, style, isRotating = false }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRotating) {
      const rotate = () => {
        rotateAnim.setValue(0);
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => rotate());
      };
      rotate();
    } else {
      rotateAnim.stopAnimation();
    }
  }, [isRotating, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ rotate: rotation }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Slide Animation for Tab Transitions
export const SlideTransition = ({ children, direction = 'left', style }) => {
  const slideAnim = useRef(new Animated.Value(direction === 'left' ? -width : width)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Progress Bar Animation
export const ProgressBar = ({ progress = 0, style, color = '#007AFF', backgroundColor = '#E5E5EA' }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[
        {
          height: 8,
          backgroundColor,
          borderRadius: 4,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          height: '100%',
          backgroundColor: color,
          borderRadius: 4,
          width: progressWidth,
        }}
      />
    </View>
  );
};

// Floating Action Button Animation
export const FloatingButton = ({ children, style, onPress }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    const float = () => {
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 0.95,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => float());
    };

    const timer = setTimeout(float, 1000);
    return () => clearTimeout(timer);
  }, [floatAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: floatAnim.interpolate({
              inputRange: [0.95, 1],
              outputRange: [2, 0],
            })},
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// iOS-style Blur Animation
export const BlurFadeView = ({ children, style, blurRadius = 10 }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacityAnim,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default {
  FadeInView,
  SlideInView,
  ScaleView,
  PulseView,
  ShimmerView,
  BounceView,
  RotateView,
  SlideTransition,
  ProgressBar,
  FloatingButton,
  BlurFadeView,
};