import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import SportsDataService from '../services/SportsDataService';

const { width } = Dimensions.get('window');

const LineWatchScreen = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [selectedSport, setSelectedSport] = useState('NFL');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const sports = [
    { key: 'NFL', name: 'NFL', color: '#013369' },
    { key: 'NBA', name: 'NBA', color: '#C8102E' },
    { key: 'MLB', name: 'MLB', color: '#041E42' },
    { key: 'NHL', name: 'NHL', color: '#000000' },
  ];

  useEffect(() => {
    loadGames();
    const interval = setInterval(loadGames, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [selectedSport]);

  const loadGames = async () => {
    try {
      // Mock data for live odds
      const gamesData = [
        {
          id: 1,
          homeTeam: 'Kansas City Chiefs',
          awayTeam: 'Buffalo Bills',
          homeTeamKey: 'KC',
          awayTeamKey: 'BUF',
          gameTime: '2023-10-15T20:20:00',
          status: 'Scheduled',
          spread: {
            home: -3.5,
            away: +3.5,
            movement: 'down', // up, down, stable
            previousLine: -4.0,
          },
          total: {
            over: 54.5,
            under: 54.5,
            movement: 'up',
            previousTotal: 53.5,
          },
          moneyline: {
            home: -165,
            away: +145,
            movement: 'stable',
          },
          volume: 'High',
          sharpMoney: 'Away',
          publicBetting: '68% Home',
        },
        {
          id: 2,
          homeTeam: 'San Francisco 49ers',
          awayTeam: 'Dallas Cowboys',
          homeTeamKey: 'SF',
          awayTeamKey: 'DAL',
          gameTime: '2023-10-15T17:00:00',
          status: 'Live',
          currentScore: { home: 14, away: 10 },
          quarter: '2nd',
          timeRemaining: '8:45',
          spread: {
            home: -6.5,
            away: +6.5,
            movement: 'up',
            previousLine: -6.0,
          },
          total: {
            over: 47.5,
            under: 47.5,
            movement: 'down',
            previousTotal: 48.5,
          },
          moneyline: {
            home: -280,
            away: +220,
            movement: 'down',
          },
          volume: 'Very High',
          sharpMoney: 'Home',
          publicBetting: '72% Home',
        },
        {
          id: 3,
          homeTeam: 'Miami Dolphins',
          awayTeam: 'New England Patriots',
          homeTeamKey: 'MIA',
          awayTeamKey: 'NE',
          gameTime: '2023-10-16T13:00:00',
          status: 'Scheduled',
          spread: {
            home: -2.5,
            away: +2.5,
            movement: 'stable',
            previousLine: -2.5,
          },
          total: {
            over: 42.5,
            under: 42.5,
            movement: 'up',
            previousTotal: 41.5,
          },
          moneyline: {
            home: -125,
            away: +105,
            movement: 'up',
          },
          volume: 'Medium',
          sharpMoney: 'Away',
          publicBetting: '55% Away',
        },
      ];

      setGames(gamesData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load games:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  const getMovementIcon = (movement) => {
    switch (movement) {
      case 'up':
        return { name: 'trending-up', color: '#34C759' };
      case 'down':
        return { name: 'trending-down', color: '#FF3B30' };
      default:
        return { name: 'remove', color: '#8E8E93' };
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const SportSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportSelector}>
      {sports.map((sport) => (
        <TouchableOpacity
          key={sport.key}
          style={[
            styles.sportButton,
            selectedSport === sport.key && styles.selectedSportButton,
          ]}
          onPress={() => setSelectedSport(sport.key)}
        >
          <LinearGradient
            colors={
              selectedSport === sport.key
                ? [sport.color, `${sport.color}80`]
                : ['#FFFFFF', '#F8F9FA']
            }
            style={styles.sportGradient}
          >
            <Text
              style={[
                styles.sportText,
                selectedSport === sport.key && styles.selectedSportText,
              ]}
            >
              {sport.name}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const GameCard = ({ game }) => {
    const isLive = game.status === 'Live';
    
    return (
      <View style={styles.gameCard}>
        <LinearGradient colors={['#FFFFFF', '#FAFBFC']} style={styles.gameCardGradient}>
          {/* Game Header */}
          <View style={styles.gameHeader}>
            <View style={styles.gameInfo}>
              <Text style={styles.matchup}>
                {game.awayTeamKey} @ {game.homeTeamKey}
              </Text>
              {isLive ? (
                <View style={styles.liveStatus}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>
                    {game.quarter} {game.timeRemaining}
                  </Text>
                </View>
              ) : (
                <Text style={styles.gameTime}>{formatTime(game.gameTime)}</Text>
              )}
            </View>
            <View style={styles.volumeBadge}>
              <Text style={[
                styles.volumeText,
                { color: game.volume === 'Very High' ? '#FF3B30' : 
                         game.volume === 'High' ? '#FF9500' : '#8E8E93' }
              ]}>
                {game.volume}
              </Text>
            </View>
          </View>

          {/* Live Score */}
          {isLive && (
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>
                {game.currentScore.away} - {game.currentScore.home}
              </Text>
            </View>
          )}

          {/* Betting Lines */}
          <View style={styles.bettingLines}>
            {/* Spread */}
            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Spread</Text>
              <View style={styles.lineValues}>
                <View style={styles.lineValue}>
                  <Text style={styles.teamKey}>{game.awayTeamKey}</Text>
                  <View style={styles.oddWithMovement}>
                    <Text style={styles.oddValue}>
                      {game.spread.away > 0 ? '+' : ''}{game.spread.away}
                    </Text>
                    <Icon
                      name={getMovementIcon(game.spread.movement).name}
                      size={12}
                      color={getMovementIcon(game.spread.movement).color}
                    />
                  </View>
                </View>
                <View style={styles.lineValue}>
                  <Text style={styles.teamKey}>{game.homeTeamKey}</Text>
                  <View style={styles.oddWithMovement}>
                    <Text style={styles.oddValue}>
                      {game.spread.home > 0 ? '+' : ''}{game.spread.home}
                    </Text>
                    <Icon
                      name={getMovementIcon(game.spread.movement).name}
                      size={12}
                      color={getMovementIcon(game.spread.movement).color}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Total */}
            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Total</Text>
              <View style={styles.lineValues}>
                <View style={styles.lineValue}>
                  <Text style={styles.teamKey}>O</Text>
                  <View style={styles.oddWithMovement}>
                    <Text style={styles.oddValue}>{game.total.over}</Text>
                    <Icon
                      name={getMovementIcon(game.total.movement).name}
                      size={12}
                      color={getMovementIcon(game.total.movement).color}
                    />
                  </View>
                </View>
                <View style={styles.lineValue}>
                  <Text style={styles.teamKey}>U</Text>
                  <View style={styles.oddWithMovement}>
                    <Text style={styles.oddValue}>{game.total.under}</Text>
                    <Icon
                      name={getMovementIcon(game.total.movement).name}
                      size={12}
                      color={getMovementIcon(game.total.movement).color}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Moneyline */}
            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Moneyline</Text>
              <View style={styles.lineValues}>
                <View style={styles.lineValue}>
                  <Text style={styles.teamKey}>{game.awayTeamKey}</Text>
                  <View style={styles.oddWithMovement}>
                    <Text style={styles.oddValue}>
                      {game.moneyline.away > 0 ? '+' : ''}{game.moneyline.away}
                    </Text>
                    <Icon
                      name={getMovementIcon(game.moneyline.movement).name}
                      size={12}
                      color={getMovementIcon(game.moneyline.movement).color}
                    />
                  </View>
                </View>
                <View style={styles.lineValue}>
                  <Text style={styles.teamKey}>{game.homeTeamKey}</Text>
                  <View style={styles.oddWithMovement}>
                    <Text style={styles.oddValue}>
                      {game.moneyline.home > 0 ? '+' : ''}{game.moneyline.home}
                    </Text>
                    <Icon
                      name={getMovementIcon(game.moneyline.movement).name}
                      size={12}
                      color={getMovementIcon(game.moneyline.movement).color}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Betting Insights */}
          <View style={styles.bettingInsights}>
            <View style={styles.insightItem}>
              <Icon name="people" size={16} color="#007AFF" />
              <Text style={styles.insightText}>Public: {game.publicBetting}</Text>
            </View>
            <View style={styles.insightItem}>
              <Icon name="diamond" size={16} color="#FF9500" />
              <Text style={styles.insightText}>Sharp: {game.sharpMoney}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📈 Line Watch</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Icon name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Live odds tracking & line movements</Text>
        <Text style={styles.lastUpdated}>
          Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      <SportSelector />

      <FlatList
        data={games}
        renderItem={({ item }) => <GameCard game={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.gamesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 35,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
  },
  sportSelector: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sportButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedSportButton: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sportGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sportText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectedSportText: {
    color: 'white',
  },
  gamesList: {
    padding: 20,
  },
  gameCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameCardGradient: {
    padding: 20,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameInfo: {
    flex: 1,
  },
  matchup: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  gameTime: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },
  liveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  volumeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  volumeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  bettingLines: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  lineItem: {
    marginBottom: 12,
  },
  lineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    textAlign: 'center',
  },
  lineValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lineValue: {
    alignItems: 'center',
  },
  teamKey: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginBottom: 4,
  },
  oddWithMovement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oddValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginRight: 4,
  },
  bettingInsights: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
});

export default LineWatchScreen;