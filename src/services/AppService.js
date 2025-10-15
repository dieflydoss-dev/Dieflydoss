import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';

class AppService {
  constructor() {
    this.socket = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Initialize socket connection for real-time data
      this.socket = io('wss://api.vegasinsider.com', {
        transports: ['websocket'],
      });

      // Load user preferences
      await this.loadUserPreferences();
      
      this.isInitialized = true;
      console.log('App service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app service:', error);
    }
  }

  async loadUserPreferences() {
    try {
      const preferences = await AsyncStorage.getItem('userPreferences');
      if (preferences) {
        this.userPreferences = JSON.parse(preferences);
      } else {
        this.userPreferences = {
          favoriteTeams: [],
          notifications: true,
          theme: 'light',
          defaultLeague: 'NFL',
        };
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }

  async saveUserPreferences(preferences) {
    try {
      this.userPreferences = { ...this.userPreferences, ...preferences };
      await AsyncStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  getUserPreferences() {
    return this.userPreferences;
  }

  getSocket() {
    return this.socket;
  }
}

const appService = new AppService();

export const initializeApp = () => appService.initialize();
export const getAppService = () => appService;
export default appService;