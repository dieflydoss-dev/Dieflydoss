import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Web-compatible imports
let LinearGradient, Icon;
if (Platform.OS === 'web') {
  LinearGradient = require('react-native-web-linear-gradient').default;
  Icon = ({ name, size, color, ...props }) => (
    <View style={{ width: size, height: size, backgroundColor: color }} {...props} />
  );
} else {
  LinearGradient = require('react-native-linear-gradient').default;
  Icon = require('react-native-vector-icons/Ionicons').default;
}

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import TeamsScreen from './src/screens/TeamsScreen';
import HotStreaksScreen from './src/screens/HotStreaksScreen';
import LineWatchScreen from './src/screens/LineWatchScreen';
import OddsAnalyzerScreen from './src/screens/OddsAnalyzerScreen';
import BetVaultScreen from './src/screens/BetVaultScreen';
import TeamPulseScreen from './src/screens/TeamPulseScreen';
import TeamDetailScreen from './src/screens/TeamDetailScreen';

// Import services
import { initializeApp } from './src/services/AppService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Teams') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Hot Streaks') {
            iconName = focused ? 'flame' : 'flame-outline';
          } else if (route.name === 'Line Watch') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Bet Vault') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -5 },
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Teams" component={TeamsScreen} />
      <Tab.Screen name="Hot Streaks" component={HotStreaksScreen} />
      <Tab.Screen name="Line Watch" component={LineWatchScreen} />
      <Tab.Screen name="Bet Vault" component={BetVaultScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      await initializeApp();
      setIsInitialized(true);
    };
    initApp();
  }, []);

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.loadingGradient}
        >
          {Platform.OS === 'web' ? (
            <View style={styles.webIcon}>🏈</View>
          ) : (
            <Icon name="american-football" size={60} color="white" />
          )}
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      {Platform.OS !== 'web' && (
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      )}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: Platform.OS === 'web' ? undefined : ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
        <Stack.Screen name="OddsAnalyzer" component={OddsAnalyzerScreen} />
        <Stack.Screen name="TeamPulse" component={TeamPulseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webIcon: {
    fontSize: 60,
    color: 'white',
  },
});

export default App;