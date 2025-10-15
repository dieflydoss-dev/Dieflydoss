# Vegas Insider Sports App 🏈📊

A comprehensive iOS-style sports betting analytics and team tracking application built with React Native. This app provides real-time sports data, betting insights, and advanced analytics for major sports leagues.

## ✨ Features

### 🏠 **Home Dashboard**
- Personalized team tracking and insights
- Quick access to all mini-apps
- Live game updates and scores
- Hot streaks preview

### 🏆 **Team Management**
- Browse teams across NFL, NBA, MLB, NHL, and NCAA
- Add favorite teams for personalized tracking
- Detailed team statistics and performance metrics
- Beautiful iOS-style interface with team colors

### 🔥 **Hot Streaks Tracker**
- Teams currently outperforming Vegas expectations
- Real-time streak tracking (ATS, Over/Under, Moneyline)
- Confidence ratings and success percentages
- Visual game history indicators

### 📈 **Line Watch Tool**
- Live odds tracking with real-time updates
- Line movement indicators and alerts
- Public vs. sharp money insights
- Volume indicators for betting activity

### 📊 **Odds Analyzer Dashboard**
- Comprehensive betting performance analytics
- Interactive charts and trend analysis
- Home vs. Away performance breakdowns
- ROI tracking and profitability insights

### 💰 **My Bet Vault**
- Personal bet tracking and management
- Win/loss record with detailed statistics
- Bet categorization and filtering
- Performance analytics and trends

### 📱 **Team Pulse Widget**
- Live injury reports with impact analysis
- Weather conditions affecting games
- Insider notes and betting intelligence
- Line movement alerts and explanations
- Public sentiment tracking

### 🍎 **Apple Wallet Integration**
- Add bets to Apple Wallet as passes
- Quick bet tracking and notifications
- QR codes for easy sportsbook integration
- Automatic status updates

## 🛠 **Technology Stack**

- **React Native** - Cross-platform mobile development
- **React Navigation** - Navigation and routing
- **Linear Gradient** - Beautiful gradient backgrounds
- **Vector Icons** - Comprehensive icon library
- **Chart Kit** - Interactive charts and graphs
- **Async Storage** - Local data persistence
- **Socket.io** - Real-time data updates
- **Axios** - HTTP client for API requests

## 📱 **iOS Design Principles**

The app follows Apple's Human Interface Guidelines with:

- **Rounded corners** and smooth edges throughout
- **Smooth animations** and transitions
- **Apple-style typography** and spacing
- **Native iOS colors** and design patterns
- **Haptic feedback** for interactions
- **Blur effects** and transparency
- **Dynamic type** support
- **Accessibility** features

## 🚀 **Installation & Setup**

### Prerequisites
- Node.js (v14 or higher)
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vegas-insider-sports-app.git
   cd vegas-insider-sports-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start the Metro bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on iOS**
   ```bash
   npm run ios
   # or
   yarn ios
   ```

6. **Run on Android**
   ```bash
   npm run android
   # or
   yarn android
   ```

## 🔧 **Configuration**

### API Keys
Update the API keys in `src/services/SportsDataService.js`:

```javascript
this.apiKey = 'YOUR_SPORTS_DATA_API_KEY';
```

### Apple Wallet
For Apple Wallet integration, configure:
- Team Identifier in Apple Developer Console
- Pass Type Identifier
- Signing certificates

### Push Notifications
Configure push notifications in:
- `ios/VegasInsiderSportsApp/Info.plist`
- Firebase configuration (if using FCM)

## 📂 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   └── AnimatedComponents.js
├── screens/            # Main app screens
│   ├── HomeScreen.js
│   ├── TeamsScreen.js
│   ├── HotStreaksScreen.js
│   ├── LineWatchScreen.js
│   ├── OddsAnalyzerScreen.js
│   ├── BetVaultScreen.js
│   ├── TeamPulseScreen.js
│   └── TeamDetailScreen.js
├── services/           # API and utility services
│   ├── AppService.js
│   ├── SportsDataService.js
│   └── WalletService.js
└── utils/              # Helper functions
```

## 🎨 **Design Features**

### Color Palette
- **Primary Blue**: #007AFF (iOS Blue)
- **Success Green**: #34C759
- **Warning Orange**: #FF9500
- **Error Red**: #FF3B30
- **Background**: #F2F2F7
- **Card Background**: #FFFFFF

### Typography
- **Headers**: SF Pro Display (Bold)
- **Body**: SF Pro Text (Regular/Medium)
- **Captions**: SF Pro Text (Light)

### Animations
- **Fade In/Out** transitions
- **Slide** animations for navigation
- **Scale** effects for interactions
- **Pulse** animations for live data
- **Shimmer** loading effects

## 📊 **Data Sources**

The app integrates with multiple data sources:

- **SportsData.io** - Live scores and statistics
- **Vegas Insider API** - Betting lines and odds
- **Weather API** - Game condition data
- **Social Media APIs** - Public sentiment analysis

## 🔐 **Security & Privacy**

- All sensitive data is encrypted
- User preferences stored locally
- No personal betting information transmitted
- Compliance with data protection regulations
- Secure API communication with HTTPS

## 🧪 **Testing**

Run the test suite:
```bash
npm test
# or
yarn test
```

## 📱 **Supported Platforms**

- **iOS**: 12.0+
- **Android**: API Level 21+ (Android 5.0)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Apple for iOS design guidelines
- React Native community for excellent libraries
- Sports data providers for real-time information
- Beta testers for valuable feedback

## 📞 **Support**

For support and questions:
- Email: support@vegasinsider.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/vegas-insider-sports-app/issues)

## 🔮 **Roadmap**

### Version 1.1
- [ ] Apple Watch companion app
- [ ] Siri Shortcuts integration
- [ ] Enhanced analytics dashboard
- [ ] Social features and leaderboards

### Version 1.2
- [ ] Machine learning predictions
- [ ] Advanced charting capabilities
- [ ] Multi-language support
- [ ] Dark mode theme

---

**Disclaimer**: This app is for entertainment and educational purposes only. Always gamble responsibly and within your means. This app does not facilitate actual sports betting - it's a tracking and analytics tool only.

Built with ❤️ using React Native