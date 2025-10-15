import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class WalletService {
  constructor() {
    this.isAvailable = Platform.OS === 'ios';
  }

  async isWalletAvailable() {
    if (!this.isAvailable) {
      return false;
    }

    try {
      // In a real implementation, you would check if Apple Wallet is available
      // For now, we'll simulate this
      return true;
    } catch (error) {
      console.error('Error checking wallet availability:', error);
      return false;
    }
  }

  async addBetToWallet(bet) {
    try {
      if (!await this.isWalletAvailable()) {
        Alert.alert('Wallet Unavailable', 'Apple Wallet is not available on this device');
        return false;
      }

      // Create a pass for the bet
      const passData = {
        id: `bet_${bet.id}`,
        type: 'sports_bet',
        organizationName: 'Vegas Insider',
        description: `${bet.team} vs ${bet.opponent}`,
        logoText: 'VI',
        backgroundColor: 'rgb(0, 122, 255)',
        foregroundColor: 'rgb(255, 255, 255)',
        labelColor: 'rgb(255, 255, 255)',
        serialNumber: `VI${bet.id}${Date.now()}`,
        webServiceURL: 'https://api.vegasinsider.com/passes/',
        authenticationToken: 'your-auth-token',
        teamIdentifier: 'your-team-id',
        passTypeIdentifier: 'pass.com.vegasinsider.sportsbet',
        
        // Pass content
        headerFields: [
          {
            key: 'bet-type',
            label: 'BET TYPE',
            value: bet.betType.toUpperCase(),
          },
        ],
        primaryFields: [
          {
            key: 'matchup',
            label: 'MATCHUP',
            value: `${bet.team} vs ${bet.opponent}`,
          },
        ],
        secondaryFields: [
          {
            key: 'amount',
            label: 'AMOUNT',
            value: `$${bet.amount}`,
            textAlignment: 'PKTextAlignmentLeft',
          },
          {
            key: 'odds',
            label: 'ODDS',
            value: `${bet.odds > 0 ? '+' : ''}${bet.odds}`,
            textAlignment: 'PKTextAlignmentRight',
          },
        ],
        auxiliaryFields: [
          {
            key: 'date',
            label: 'DATE',
            value: bet.date,
            textAlignment: 'PKTextAlignmentLeft',
          },
          {
            key: 'confidence',
            label: 'CONFIDENCE',
            value: bet.confidence.toUpperCase(),
            textAlignment: 'PKTextAlignmentRight',
          },
        ],
        backFields: [
          {
            key: 'terms',
            label: 'Terms and Conditions',
            value: 'This is a tracking pass for your sports bet. Vegas Insider is not a licensed sportsbook. Please gamble responsibly.',
          },
          {
            key: 'support',
            label: 'Support',
            value: 'For support, contact support@vegasinsider.com',
          },
        ],
        
        // Barcode (optional)
        barcode: {
          message: `VI${bet.id}`,
          format: 'PKBarcodeFormatQR',
          messageEncoding: 'iso-8859-1',
        },
        
        // Locations for relevant notifications (optional)
        locations: [
          {
            latitude: 36.1699,
            longitude: -115.1398, // Las Vegas coordinates
            relevantText: 'You\'re in Vegas! Check your bet status.',
          },
        ],
        
        // Relevant date for notifications
        relevantDate: bet.gameDate || new Date().toISOString(),
      };

      // In a real implementation, you would:
      // 1. Send this data to your server to generate a .pkpass file
      // 2. Use a library like react-native-wallet-manager to add the pass
      
      // For demo purposes, we'll simulate success
      await this.saveBetPass(bet.id, passData);
      
      Alert.alert(
        'Added to Wallet',
        'Your bet has been added to Apple Wallet for quick tracking!',
        [{ text: 'OK' }]
      );
      
      return true;
    } catch (error) {
      console.error('Error adding bet to wallet:', error);
      Alert.alert('Error', 'Failed to add bet to wallet');
      return false;
    }
  }

  async saveBetPass(betId, passData) {
    try {
      const passes = await this.getSavedPasses();
      passes[betId] = passData;
      await AsyncStorage.setItem('walletPasses', JSON.stringify(passes));
    } catch (error) {
      console.error('Error saving pass:', error);
    }
  }

  async getSavedPasses() {
    try {
      const passes = await AsyncStorage.getItem('walletPasses');
      return passes ? JSON.parse(passes) : {};
    } catch (error) {
      console.error('Error getting saved passes:', error);
      return {};
    }
  }

  async removeBetFromWallet(betId) {
    try {
      const passes = await this.getSavedPasses();
      delete passes[betId];
      await AsyncStorage.setItem('walletPasses', JSON.stringify(passes));
      
      Alert.alert(
        'Removed from Wallet',
        'Your bet pass has been removed from Apple Wallet.',
        [{ text: 'OK' }]
      );
      
      return true;
    } catch (error) {
      console.error('Error removing bet from wallet:', error);
      return false;
    }
  }

  async updateBetStatus(betId, status, result) {
    try {
      const passes = await this.getSavedPasses();
      if (passes[betId]) {
        // Update the pass with new status
        passes[betId].primaryFields[0].value = `${status.toUpperCase()}: ${result || 'Pending'}`;
        
        // Change colors based on status
        if (status === 'won') {
          passes[betId].backgroundColor = 'rgb(52, 199, 89)'; // Green
        } else if (status === 'lost') {
          passes[betId].backgroundColor = 'rgb(255, 59, 48)'; // Red
        }
        
        await AsyncStorage.setItem('walletPasses', JSON.stringify(passes));
        
        // In a real implementation, you would push an update to the actual wallet pass
        console.log(`Updated wallet pass for bet ${betId} with status ${status}`);
      }
    } catch (error) {
      console.error('Error updating bet status in wallet:', error);
    }
  }

  generateQRCode(betId) {
    // Generate a QR code for the bet that can be scanned at sportsbooks
    return `https://vegasinsider.com/bet/${betId}`;
  }

  async createBettingReminder(bet, gameDateTime) {
    try {
      // Create a notification reminder for the bet
      const reminderData = {
        id: `reminder_${bet.id}`,
        title: 'Game Starting Soon!',
        body: `${bet.team} vs ${bet.opponent} starts in 30 minutes. Your bet: ${bet.betType} ${bet.line || ''}`,
        scheduledTime: new Date(gameDateTime.getTime() - 30 * 60 * 1000), // 30 minutes before
        data: {
          betId: bet.id,
          type: 'game_reminder',
        },
      };

      // In a real implementation, you would schedule a local notification
      console.log('Betting reminder created:', reminderData);
      
      return true;
    } catch (error) {
      console.error('Error creating betting reminder:', error);
      return false;
    }
  }
}

export default new WalletService();