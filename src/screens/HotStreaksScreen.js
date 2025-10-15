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
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import SportsDataService from '../services/SportsDataService';

const { width } = Dimensions.get('window');

const HotStreaksScreen = ({ navigation }) => {
  const [hotStreaks, setHotStreaks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { key: 'all', name: 'All Streaks', icon: 'flame' },
    { key: 'ats', name: 'Against Spread', icon: 'trending-up' },
    { key: 'over_under', name: 'Over/Under', icon: 'swap-vertical' },
    { key: 'moneyline', name: 'Moneyline', icon: 'cash' },
  ];

  useEffect(() => {
    loadHotStreaks();
  }, [selectedFilter]);

  const loadHotStreaks = async () => {
    try {
      setLoading(true);
      // Mock data for hot streaks
      const streaksData = [
        {
          id: 1,
          team: 'Kansas City Chiefs',
          teamKey: 'KC',
          league: 'NFL',
          streakType: 'ATS Win',
          streakCount: 7,
          percentage: 85.7,
          roi: '+$420',
          description: '7-0 ATS in last 7 games',
          trend: 'up',
          color: '#E31837',
          lastGames: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
          confidence: 'High',
        },
        {
          id: 2,
          team: 'Boston Celtics',
          teamKey: 'BOS',
          league: 'NBA',
          streakType: 'Over Hits',
          streakCount: 6,
          percentage: 83.3,
          roi: '+$315',
          description: 'Over 6-0 in last 6 games',
          trend: 'up',
          color: '#007A33',
          lastGames: ['O', 'O', 'O', 'O', 'O', 'O'],
          confidence: 'High',
        },
        {
          id: 3,
          team: 'Tampa Bay Lightning',
          teamKey: 'TBL',
          league: 'NHL',
          streakType: 'Moneyline',
          streakCount: 5,
          percentage: 100,
          roi: '+$280',
          description: '5-0 straight up wins',
          trend: 'up',
          color: '#002868',
          lastGames: ['W', 'W', 'W', 'W', 'W'],
          confidence: 'Very High',
        },
        {
          id: 4,
          team: 'Los Angeles Lakers',
          teamKey: 'LAL',
          league: 'NBA',
          streakType: 'ATS Loss',
          streakCount: 4,
          percentage: 25,
          roi: '-$180',
          description: '0-4 ATS in last 4 games',
          trend: 'down',
          color: '#552583',
          lastGames: ['L', 'L', 'L', 'L'],
          confidence: 'Medium',
        },
        {
          id: 5,
          team: 'New York Yankees',
          teamKey: 'NYY',
          league: 'MLB',
          streakType: 'Under Hits',
          streakCount: 8,
          percentage: 87.5,
          roi: '+$520',
          description: 'Under 7-1 in last 8 games',
          trend: 'up',
          color: '#132448',
          lastGames: ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'O'],
          confidence: 'Very High',
        },
      ];

      // Filter based on selected filter
      let filteredStreaks = streaksData;
      if (selectedFilter === 'ats') {
        filteredStreaks = streaksData.filter(s => s.streakType.includes('ATS'));
      } else if (selectedFilter === 'over_under') {
        filteredStreaks = streaksData.filter(s => s.streakType.includes('Over') || s.streakType.includes('Under'));
      } else if (selectedFilter === 'moneyline') {
        filteredStreaks = streaksData.filter(s => s.streakType.includes('Moneyline'));
      }

      setHotStreaks(filteredStreaks);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load hot streaks:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHotStreaks();
    setRefreshing(false);
  };

  const FilterButton = ({ filter }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter.key && styles.selectedFilterButton,
      ]}
      onPress={() => setSelectedFilter(filter.key)}
    >
      <LinearGradient
        colors={
          selectedFilter === filter.key
            ? ['#FF6B35', '#FF8C42']
            : ['#FFFFFF', '#F8F9FA']
        }
        style={styles.filterGradient}
      >
        <Icon
          name={filter.icon}
          size={16}
          color={selectedFilter === filter.key ? 'white' : '#8E8E93'}
        />
        <Text
          style={[
            styles.filterText,
            selectedFilter === filter.key && styles.selectedFilterText,
          ]}
        >
          {filter.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const StreakCard = ({ streak }) => {
    const isPositive = streak.trend === 'up';
    
    return (
      <TouchableOpacity style={styles.streakCard}>
        <LinearGradient
          colors={['#FFFFFF', '#FAFBFC']}
          style={styles.streakCardGradient}
        >
          <View style={styles.streakHeader}>
            <View style={styles.teamInfo}>
              <View style={[styles.teamColorBar, { backgroundColor: streak.color }]} />
              <View>
                <Text style={styles.teamName}>{streak.team}</Text>
                <Text style={styles.leagueBadge}>{streak.league}</Text>
              </View>
            </View>
            <View style={styles.confidenceBadge}>
              <Text style={[
                styles.confidenceText,
                { color: streak.confidence === 'Very High' ? '#34C759' : 
                         streak.confidence === 'High' ? '#FF9500' : '#8E8E93' }
              ]}>
                {streak.confidence}
              </Text>
            </View>
          </View>

          <View style={styles.streakMain}>
            <View style={styles.streakTypeContainer}>
              <Icon
                name={isPositive ? 'trending-up' : 'trending-down'}
                size={24}
                color={isPositive ? '#34C759' : '#FF3B30'}
              />
              <Text style={styles.streakType}>{streak.streakType}</Text>
            </View>
            
            <View style={styles.streakStats}>
              <View style={styles.statItem}>
                <Text style={[styles.streakCount, { color: isPositive ? '#34C759' : '#FF3B30' }]}>
                  {streak.streakCount}
                </Text>
                <Text style={styles.statLabel}>Games</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.percentage, { color: isPositive ? '#34C759' : '#FF3B30' }]}>
                  {streak.percentage}%
                </Text>
                <Text style={styles.statLabel}>Success</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.roi, { color: isPositive ? '#34C759' : '#FF3B30' }]}>
                  {streak.roi}
                </Text>
                <Text style={styles.statLabel}>ROI</Text>
              </View>
            </View>
          </View>

          <View style={styles.gameHistory}>
            <Text style={styles.historyLabel}>Recent Games:</Text>
            <View style={styles.gameResults}>
              {streak.lastGames.map((result, index) => (
                <View
                  key={index}
                  style={[
                    styles.gameResult,
                    {
                      backgroundColor:
                        result === 'W' || result === 'O' || result === 'U'
                          ? '#34C759'
                          : '#FF3B30',
                    },
                  ]}
                >
                  <Text style={styles.gameResultText}>{result}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.streakDescription}>{streak.description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔥 Hot Streaks</Text>
        <TouchableOpacity>
          <Icon name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Teams outperforming Vegas expectations</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <FilterButton key={filter.key} filter={filter} />
        ))}
      </ScrollView>

      <FlatList
        data={hotStreaks}
        renderItem={({ item }) => <StreakCard streak={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.streaksList}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedFilterButton: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  selectedFilterText: {
    color: 'white',
  },
  streaksList: {
    padding: 20,
  },
  streakCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  streakCardGradient: {
    padding: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamColorBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  leagueBadge: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 2,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakMain: {
    marginBottom: 16,
  },
  streakTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  streakCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roi: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  gameHistory: {
    marginBottom: 12,
  },
  historyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  gameResults: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gameResult: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  gameResultText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  streakDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HotStreaksScreen;