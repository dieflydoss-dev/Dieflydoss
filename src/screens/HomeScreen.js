import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { getLinearGradient, getIcon } from '../utils/PlatformUtils';

const LinearGradient = getLinearGradient();
const Icon = getIcon();

import SportsDataService from '../services/SportsDataService';
import { getAppService } from '../services/AppService';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [hotStreaks, setHotStreaks] = useState([]);
  const [liveGames, setLiveGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const appService = getAppService();
      const preferences = appService.getUserPreferences();
      
      // Load favorite teams data
      if (preferences.favoriteTeams.length > 0) {
        const teamsData = await Promise.all(
          preferences.favoriteTeams.map(teamId => 
            SportsDataService.getTeamStats(teamId, 2023)
          )
        );
        setFavoriteTeams(teamsData);
      }

      // Load hot streaks
      const streaks = await SportsDataService.getBettingTrends();
      setHotStreaks(streaks.slice(0, 5));

      // Load live games
      const games = await SportsDataService.getGames('NFL', 2023, 8);
      setLiveGames(games.filter(game => game.Status === 'InProgress').slice(0, 3));

      setLoading(false);
    } catch (error) {
      console.error('Failed to load home data:', error);
      setLoading(false);
    }
  };

  const QuickActionCard = ({ title, subtitle, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionCard}>
      <LinearGradient
        colors={[color, `${color}80`]}
        style={styles.quickActionGradient}
      >
        <Icon name={icon} size={24} color="white" />
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const FavoriteTeamCard = ({ team }) => (
    <TouchableOpacity 
      style={styles.favoriteTeamCard}
      onPress={() => navigation.navigate('TeamDetail', { team })}
    >
      <View style={styles.teamHeader}>
        <View style={[styles.teamColorBar, { backgroundColor: team.PrimaryColor }]} />
        <Text style={styles.teamName}>{team.City} {team.Name}</Text>
        <Icon name="chevron-forward" size={16} color="#8E8E93" />
      </View>
      <View style={styles.teamStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>8-2</Text>
          <Text style={styles.statLabel}>Record</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>65%</Text>
          <Text style={styles.statLabel}>ATS</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>+$240</Text>
          <Text style={styles.statLabel}>ROI</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const HotStreakItem = ({ streak }) => (
    <View style={styles.hotStreakItem}>
      <View style={styles.streakIcon}>
        <Icon name="flame" size={20} color="#FF6B35" />
      </View>
      <View style={styles.streakInfo}>
        <Text style={styles.streakTeam}>{streak.team}</Text>
        <Text style={styles.streakDescription}>{streak.description}</Text>
      </View>
      <Text style={styles.streakValue}>{streak.value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vegas Insider</Text>
          <Text style={styles.headerSubtitle}>Your Sports Edge</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="person-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickActions}>
              <QuickActionCard
                title="Hot Streaks"
                subtitle="Teams beating odds"
                icon="flame"
                color="#FF6B35"
                onPress={() => navigation.navigate('Hot Streaks')}
              />
              <QuickActionCard
                title="Line Watch"
                subtitle="Live odds tracking"
                icon="trending-up"
                color="#4ECDC4"
                onPress={() => navigation.navigate('Line Watch')}
              />
              <QuickActionCard
                title="Odds Analyzer"
                subtitle="Performance insights"
                icon="analytics"
                color="#45B7D1"
                onPress={() => navigation.navigate('OddsAnalyzer')}
              />
              <QuickActionCard
                title="Team Pulse"
                subtitle="Live updates"
                icon="pulse"
                color="#96CEB4"
                onPress={() => navigation.navigate('TeamPulse')}
              />
            </View>
          </ScrollView>
        </View>

        {/* Favorite Teams */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Teams</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Teams')}>
              <Text style={styles.sectionAction}>Manage</Text>
            </TouchableOpacity>
          </View>
          {favoriteTeams.length > 0 ? (
            favoriteTeams.map((team, index) => (
              <FavoriteTeamCard key={index} team={team} />
            ))
          ) : (
            <TouchableOpacity 
              style={styles.emptyState}
              onPress={() => navigation.navigate('Teams')}
            >
              <Icon name="add-circle-outline" size={48} color="#C7C7CC" />
              <Text style={styles.emptyStateText}>Add your favorite teams</Text>
              <Text style={styles.emptyStateSubtext}>Get personalized insights and alerts</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hot Streaks Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Hot Streaks</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Hot Streaks')}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hotStreaksContainer}>
            {hotStreaks.map((streak, index) => (
              <HotStreakItem key={index} streak={streak} />
            ))}
          </View>
        </View>

        {/* Live Games */}
        {liveGames.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔴 Live Games</Text>
            {liveGames.map((game, index) => (
              <View key={index} style={styles.liveGameCard}>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <View style={styles.gameMatchup}>
                  <Text style={styles.gameTeams}>
                    {game.AwayTeam} @ {game.HomeTeam}
                  </Text>
                  <Text style={styles.gameScore}>
                    {game.AwayScore || 0} - {game.HomeScore || 0}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Icon name="chevron-forward" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 0 : 25,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  sectionAction: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  quickActionCard: {
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quickActionGradient: {
    width: 120,
    height: 100,
    padding: 15,
    justifyContent: 'space-between',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  quickActionSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  favoriteTeamCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamColorBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 5,
    textAlign: 'center',
  },
  hotStreaksContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hotStreakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  streakInfo: {
    flex: 1,
  },
  streakTeam: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  streakDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  streakValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  liveGameCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  gameMatchup: {
    flex: 1,
  },
  gameTeams: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  gameScore: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
});

export default HomeScreen;