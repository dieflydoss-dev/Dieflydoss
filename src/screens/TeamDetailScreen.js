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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const TeamDetailScreen = ({ navigation, route }) => {
  const { team } = route.params;
  const [selectedTab, setSelectedTab] = useState('overview');
  const [teamData, setTeamData] = useState({});

  const tabs = [
    { key: 'overview', name: 'Overview', icon: 'stats-chart' },
    { key: 'betting', name: 'Betting', icon: 'trending-up' },
    { key: 'schedule', name: 'Schedule', icon: 'calendar' },
    { key: 'news', name: 'News', icon: 'newspaper' },
  ];

  useEffect(() => {
    loadTeamData();
  }, [team]);

  const loadTeamData = async () => {
    // Mock team data
    const mockData = {
      overview: {
        record: '8-2',
        conference: 'AFC West',
        lastGame: { opponent: 'Denver Broncos', result: 'W 31-17', date: '2023-10-12' },
        nextGame: { opponent: 'Buffalo Bills', date: '2023-10-15', time: '8:20 PM' },
        keyStats: {
          pointsPerGame: 28.4,
          pointsAllowed: 19.2,
          totalYards: 412.3,
          yardsAllowed: 298.7,
        },
        injuries: [
          { player: 'Patrick Mahomes', position: 'QB', status: 'Questionable' },
          { player: 'Travis Kelce', position: 'TE', status: 'Probable' },
        ],
      },
      betting: {
        atsRecord: '7-3',
        overUnderRecord: '5-5',
        homeAtsRecord: '4-1',
        awayAtsRecord: '3-2',
        roi: '+$420',
        trends: [
          'ATS 6-1 in last 7 games',
          'Over 4-1 in last 5 home games',
          'Undefeated ATS as home favorites',
        ],
        recentLines: [65, 68, 72, 69, 70, 75, 71, 68, 70, 73],
      },
      schedule: [
        { date: '2023-10-15', opponent: 'Buffalo Bills', time: '8:20 PM', location: 'Home' },
        { date: '2023-10-22', opponent: 'Los Angeles Chargers', time: '4:25 PM', location: 'Away' },
        { date: '2023-10-29', opponent: 'Denver Broncos', time: '1:00 PM', location: 'Home' },
      ],
      news: [
        {
          title: 'Mahomes practices with ankle injury',
          summary: 'QB expected to play despite limited practice participation',
          time: '2 hours ago',
          source: 'ESPN',
        },
        {
          title: 'Defense coordinator praises secondary improvements',
          summary: 'Unit has allowed fewer than 200 passing yards in 3 straight games',
          time: '4 hours ago',
          source: 'NFL.com',
        },
      ],
    };

    setTeamData(mockData);
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#f8f9fa',
    decimalPlaces: 0,
    color: (opacity = 1) => team.PrimaryColor ? `${team.PrimaryColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(28, 28, 30, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const TabButton = ({ tab }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        selectedTab === tab.key && styles.selectedTabButton,
      ]}
      onPress={() => setSelectedTab(tab.key)}
    >
      <Icon
        name={tab.icon}
        size={18}
        color={selectedTab === tab.key ? 'white' : team.PrimaryColor || '#007AFF'}
      />
      <Text
        style={[
          styles.tabText,
          selectedTab === tab.key && styles.selectedTabText,
        ]}
      >
        {tab.name}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      {/* Team Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Season Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{teamData.overview?.record}</Text>
            <Text style={styles.statLabel}>Record</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{teamData.overview?.keyStats?.pointsPerGame}</Text>
            <Text style={styles.statLabel}>PPG</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{teamData.overview?.keyStats?.pointsAllowed}</Text>
            <Text style={styles.statLabel}>PA/G</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{teamData.overview?.keyStats?.totalYards}</Text>
            <Text style={styles.statLabel}>YPG</Text>
          </View>
        </View>
      </View>

      {/* Recent Game */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last Game</Text>
        <View style={styles.gameCard}>
          <View style={styles.gameResult}>
            <Text style={styles.gameOpponent}>vs {teamData.overview?.lastGame?.opponent}</Text>
            <Text style={[styles.gameScore, { color: '#34C759' }]}>
              {teamData.overview?.lastGame?.result}
            </Text>
          </View>
          <Text style={styles.gameDate}>{teamData.overview?.lastGame?.date}</Text>
        </View>
      </View>

      {/* Next Game */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Game</Text>
        <View style={styles.gameCard}>
          <View style={styles.gameResult}>
            <Text style={styles.gameOpponent}>vs {teamData.overview?.nextGame?.opponent}</Text>
            <Text style={styles.gameTime}>{teamData.overview?.nextGame?.time}</Text>
          </View>
          <Text style={styles.gameDate}>{teamData.overview?.nextGame?.date}</Text>
        </View>
      </View>

      {/* Injury Report */}
      {teamData.overview?.injuries && teamData.overview.injuries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Injury Report</Text>
          {teamData.overview.injuries.map((injury, index) => (
            <View key={index} style={styles.injuryItem}>
              <View style={styles.injuryInfo}>
                <Text style={styles.injuryPlayer}>{injury.player}</Text>
                <Text style={styles.injuryPosition}>{injury.position}</Text>
              </View>
              <View style={[
                styles.injuryStatus,
                { backgroundColor: injury.status === 'Questionable' ? '#FF9500' : '#34C759' }
              ]}>
                <Text style={styles.injuryStatusText}>{injury.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderBetting = () => (
    <ScrollView style={styles.tabContent}>
      {/* Betting Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Betting Performance</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#34C759' }]}>
              {teamData.betting?.atsRecord}
            </Text>
            <Text style={styles.statLabel}>ATS Record</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{teamData.betting?.overUnderRecord}</Text>
            <Text style={styles.statLabel}>O/U Record</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{teamData.betting?.homeAtsRecord}</Text>
            <Text style={styles.statLabel}>Home ATS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#34C759' }]}>
              {teamData.betting?.roi}
            </Text>
            <Text style={styles.statLabel}>ROI</Text>
          </View>
        </View>
      </View>

      {/* Performance Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ATS Performance Trend</Text>
        <View style={styles.chartContainer}>
          {teamData.betting?.recentLines && (
            <LineChart
              data={{
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                datasets: [{ data: teamData.betting.recentLines }],
              }}
              width={width - 60}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </View>
      </View>

      {/* Betting Trends */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Trends</Text>
        {teamData.betting?.trends?.map((trend, index) => (
          <View key={index} style={styles.trendItem}>
            <Icon name="trending-up" size={16} color="#34C759" />
            <Text style={styles.trendText}>{trend}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderSchedule = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Games</Text>
        {teamData.schedule?.map((game, index) => (
          <View key={index} style={styles.scheduleItem}>
            <View style={styles.scheduleDate}>
              <Text style={styles.scheduleDateText}>{game.date}</Text>
              <Text style={styles.scheduleTime}>{game.time}</Text>
            </View>
            <View style={styles.scheduleGame}>
              <Text style={styles.scheduleOpponent}>{game.opponent}</Text>
              <View style={[
                styles.locationBadge,
                { backgroundColor: game.location === 'Home' ? '#34C759' : '#007AFF' }
              ]}>
                <Text style={styles.locationText}>{game.location}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.scheduleAction}>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderNews = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest News</Text>
        {teamData.news?.map((article, index) => (
          <TouchableOpacity key={index} style={styles.newsItem}>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>{article.title}</Text>
              <Text style={styles.newsSummary}>{article.summary}</Text>
              <View style={styles.newsFooter}>
                <Text style={styles.newsSource}>{article.source}</Text>
                <Text style={styles.newsTime}>{article.time}</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'betting':
        return renderBetting();
      case 'schedule':
        return renderSchedule();
      case 'news':
        return renderNews();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[team.PrimaryColor || '#007AFF', `${team.PrimaryColor || '#007AFF'}80`]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.teamHeader}>
            <Text style={styles.teamCity}>{team.City}</Text>
            <Text style={styles.teamName}>{team.Name}</Text>
            <Text style={styles.teamDivision}>{team.Conference} {team.Division}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('TeamPulse', { team })}>
            <Icon name="pulse" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} tab={tab} />
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {renderTabContent()}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('OddsAnalyzer', { team })}
        >
          <LinearGradient
            colors={['#007AFF', '#007AFF80']}
            style={styles.actionGradient}
          >
            <Icon name="analytics" size={20} color="white" />
            <Text style={styles.actionText}>Analyze</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('TeamPulse', { team })}
        >
          <LinearGradient
            colors={['#34C759', '#34C75980']}
            style={styles.actionGradient}
          >
            <Icon name="pulse" size={20} color="white" />
            <Text style={styles.actionText}>Pulse</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  teamHeader: {
    alignItems: 'center',
    flex: 1,
  },
  teamCity: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 2,
  },
  teamDivision: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabsContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F2F2F7',
  },
  selectedTabButton: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectedTabText: {
    color: 'white',
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  gameCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameOpponent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  gameScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  gameDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  injuryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  injuryInfo: {
    flex: 1,
  },
  injuryPlayer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  injuryPosition: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  injuryStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  injuryStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chart: {
    borderRadius: 16,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendText: {
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleDate: {
    width: 80,
  },
  scheduleDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  scheduleTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  scheduleGame: {
    flex: 1,
    marginLeft: 15,
  },
  scheduleOpponent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  locationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  scheduleAction: {
    padding: 8,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  newsSummary: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newsSource: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  newsTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
});

export default TeamDetailScreen;