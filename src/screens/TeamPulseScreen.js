import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const TeamPulseScreen = ({ navigation, route }) => {
  const [selectedTeam, setSelectedTeam] = useState(route?.params?.team || null);
  const [pulseData, setPulseData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadPulseData();
    const interval = setInterval(loadPulseData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [selectedTeam]);

  const loadPulseData = async () => {
    try {
      // Mock real-time data
      const mockPulseData = {
        injuries: [
          {
            id: 1,
            player: 'Patrick Mahomes',
            position: 'QB',
            injury: 'Ankle Sprain',
            status: 'Questionable',
            impact: 'High',
            lastUpdate: '2 hours ago',
            description: 'Limited in practice, expected to play',
            oddsImpact: 'Spread moved from -7 to -4.5',
          },
          {
            id: 2,
            player: 'Travis Kelce',
            position: 'TE',
            injury: 'Knee Soreness',
            status: 'Probable',
            impact: 'Medium',
            lastUpdate: '4 hours ago',
            description: 'Full participant in practice',
            oddsImpact: 'No significant line movement',
          },
        ],
        weather: {
          location: 'Arrowhead Stadium, Kansas City',
          temperature: '42°F',
          conditions: 'Light Rain',
          windSpeed: '15 mph',
          windDirection: 'NW',
          precipitation: '60%',
          impact: 'Moderate',
          recommendation: 'Favor Under, Running Game',
          lastUpdate: '15 minutes ago',
        },
        insiderNotes: [
          {
            id: 1,
            source: 'Team Beat Reporter',
            reliability: 'High',
            note: 'Coach Reid expects Mahomes to play despite ankle concern',
            timestamp: '1 hour ago',
            impact: 'Positive',
            category: 'Injury Update',
          },
          {
            id: 2,
            source: 'Vegas Insider',
            reliability: 'Very High',
            note: 'Sharp money coming in on the Under 54.5',
            timestamp: '30 minutes ago',
            impact: 'Neutral',
            category: 'Betting Action',
          },
          {
            id: 3,
            source: 'Local Media',
            reliability: 'Medium',
            note: 'Defense coordinator implementing new blitz packages',
            timestamp: '2 hours ago',
            impact: 'Positive',
            category: 'Strategy',
          },
        ],
        lineMovements: [
          {
            id: 1,
            type: 'Spread',
            from: '-7.0',
            to: '-4.5',
            movement: 'down',
            reason: 'Mahomes injury concern',
            volume: 'High',
            timestamp: '1 hour ago',
          },
          {
            id: 2,
            type: 'Total',
            from: '55.5',
            to: '54.5',
            movement: 'down',
            reason: 'Weather conditions',
            volume: 'Medium',
            timestamp: '45 minutes ago',
          },
        ],
        publicSentiment: {
          overall: 72,
          confidence: 'High',
          trending: 'up',
          socialMentions: 1247,
          positiveRatio: 68,
          keyTopics: ['Mahomes Health', 'Weather Impact', 'Playoff Implications'],
        },
        keyStats: {
          recentForm: '4-1 L5',
          homeRecord: '6-2',
          atsRecord: '7-3',
          overUnder: '5-5',
          avgPointsFor: 28.4,
          avgPointsAgainst: 19.2,
        },
      };

      setPulseData(mockPulseData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load pulse data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPulseData();
    setRefreshing(false);
  };

  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'out': return '#FF3B30';
      case 'doubtful': return '#FF9500';
      case 'questionable': return '#FF9500';
      case 'probable': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const InjuryCard = ({ injury }) => (
    <View style={styles.injuryCard}>
      <View style={styles.injuryHeader}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{injury.player}</Text>
          <Text style={styles.playerPosition}>{injury.position}</Text>
        </View>
        <View style={styles.injuryStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(injury.status) }]}>
            <Text style={styles.statusText}>{injury.status}</Text>
          </View>
          <View style={[styles.impactBadge, { backgroundColor: getImpactColor(injury.impact) }]}>
            <Text style={styles.impactText}>{injury.impact}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.injuryType}>{injury.injury}</Text>
      <Text style={styles.injuryDescription}>{injury.description}</Text>
      
      <View style={styles.injuryFooter}>
        <Text style={styles.oddsImpact}>{injury.oddsImpact}</Text>
        <Text style={styles.lastUpdate}>{injury.lastUpdate}</Text>
      </View>
    </View>
  );

  const WeatherWidget = ({ weather }) => (
    <View style={styles.weatherCard}>
      <LinearGradient colors={['#4A90E2', '#7B68EE']} style={styles.weatherGradient}>
        <View style={styles.weatherHeader}>
          <Icon name="location" size={16} color="white" />
          <Text style={styles.weatherLocation}>{weather.location}</Text>
        </View>
        
        <View style={styles.weatherMain}>
          <View style={styles.weatherLeft}>
            <Text style={styles.temperature}>{weather.temperature}</Text>
            <Text style={styles.conditions}>{weather.conditions}</Text>
          </View>
          <View style={styles.weatherRight}>
            <View style={styles.weatherDetail}>
              <Icon name="eye" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.weatherText}>Wind: {weather.windSpeed} {weather.windDirection}</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Icon name="water" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.weatherText}>Rain: {weather.precipitation}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.weatherImpact}>
          <View style={[styles.impactBadge, { backgroundColor: getImpactColor(weather.impact) }]}>
            <Text style={styles.impactText}>{weather.impact} Impact</Text>
          </View>
          <Text style={styles.weatherRecommendation}>{weather.recommendation}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const InsiderNote = ({ note }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <View style={styles.noteSource}>
          <Text style={styles.sourceName}>{note.source}</Text>
          <View style={[
            styles.reliabilityBadge,
            { backgroundColor: note.reliability === 'Very High' ? '#34C759' : 
                             note.reliability === 'High' ? '#FF9500' : '#8E8E93' }
          ]}>
            <Text style={styles.reliabilityText}>{note.reliability}</Text>
          </View>
        </View>
        <Text style={styles.noteTimestamp}>{note.timestamp}</Text>
      </View>
      
      <Text style={styles.noteText}>{note.note}</Text>
      
      <View style={styles.noteFooter}>
        <View style={styles.noteCategory}>
          <Text style={styles.categoryText}>{note.category}</Text>
        </View>
        <View style={[
          styles.impactIndicator,
          { backgroundColor: note.impact === 'Positive' ? '#34C759' : 
                           note.impact === 'Negative' ? '#FF3B30' : '#8E8E93' }
        ]}>
          <Icon 
            name={note.impact === 'Positive' ? 'trending-up' : 
                  note.impact === 'Negative' ? 'trending-down' : 'remove'} 
            size={12} 
            color="white" 
          />
        </View>
      </View>
    </View>
  );

  const LineMovement = ({ movement }) => (
    <View style={styles.movementCard}>
      <View style={styles.movementHeader}>
        <Text style={styles.movementType}>{movement.type}</Text>
        <View style={styles.movementDirection}>
          <Icon
            name={movement.movement === 'up' ? 'trending-up' : 'trending-down'}
            size={16}
            color={movement.movement === 'up' ? '#34C759' : '#FF3B30'}
          />
          <Text style={[
            styles.movementText,
            { color: movement.movement === 'up' ? '#34C759' : '#FF3B30' }
          ]}>
            {movement.from} → {movement.to}
          </Text>
        </View>
      </View>
      
      <Text style={styles.movementReason}>{movement.reason}</Text>
      
      <View style={styles.movementFooter}>
        <View style={[
          styles.volumeBadge,
          { backgroundColor: movement.volume === 'High' ? '#FF3B30' : 
                           movement.volume === 'Medium' ? '#FF9500' : '#8E8E93' }
        ]}>
          <Text style={styles.volumeText}>{movement.volume} Volume</Text>
        </View>
        <Text style={styles.movementTime}>{movement.timestamp}</Text>
      </View>
    </View>
  );

  const SentimentWidget = ({ sentiment }) => (
    <View style={styles.sentimentCard}>
      <View style={styles.sentimentHeader}>
        <Text style={styles.sentimentTitle}>Public Sentiment</Text>
        <View style={styles.sentimentScore}>
          <Text style={[
            styles.sentimentValue,
            { color: sentiment.overall >= 70 ? '#34C759' : 
                     sentiment.overall >= 40 ? '#FF9500' : '#FF3B30' }
          ]}>
            {sentiment.overall}%
          </Text>
          <Icon
            name={sentiment.trending === 'up' ? 'trending-up' : 'trending-down'}
            size={16}
            color={sentiment.trending === 'up' ? '#34C759' : '#FF3B30'}
          />
        </View>
      </View>
      
      <View style={styles.sentimentMetrics}>
        <View style={styles.sentimentMetric}>
          <Text style={styles.metricValue}>{sentiment.socialMentions}</Text>
          <Text style={styles.metricLabel}>Mentions</Text>
        </View>
        <View style={styles.sentimentMetric}>
          <Text style={styles.metricValue}>{sentiment.positiveRatio}%</Text>
          <Text style={styles.metricLabel}>Positive</Text>
        </View>
        <View style={styles.sentimentMetric}>
          <Text style={[
            styles.metricValue,
            { color: sentiment.confidence === 'High' ? '#34C759' : '#FF9500' }
          ]}>
            {sentiment.confidence}
          </Text>
          <Text style={styles.metricLabel}>Confidence</Text>
        </View>
      </View>
      
      <View style={styles.keyTopics}>
        <Text style={styles.topicsLabel}>Trending Topics:</Text>
        <View style={styles.topicTags}>
          {sentiment.keyTopics.map((topic, index) => (
            <View key={index} style={styles.topicTag}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 Team Pulse</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Icon name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {selectedTeam && (
        <View style={styles.teamHeader}>
          <View style={[styles.teamColorBar, { backgroundColor: selectedTeam.PrimaryColor }]} />
          <Text style={styles.teamName}>{selectedTeam.City} {selectedTeam.Name}</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Weather Conditions */}
        {pulseData.weather && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌦️ Weather Impact</Text>
            <WeatherWidget weather={pulseData.weather} />
          </View>
        )}

        {/* Injury Report */}
        {pulseData.injuries && pulseData.injuries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏥 Injury Report</Text>
            {pulseData.injuries.map((injury) => (
              <InjuryCard key={injury.id} injury={injury} />
            ))}
          </View>
        )}

        {/* Line Movements */}
        {pulseData.lineMovements && pulseData.lineMovements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Recent Line Movements</Text>
            {pulseData.lineMovements.map((movement) => (
              <LineMovement key={movement.id} movement={movement} />
            ))}
          </View>
        )}

        {/* Public Sentiment */}
        {pulseData.publicSentiment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💭 Public Sentiment</Text>
            <SentimentWidget sentiment={pulseData.publicSentiment} />
          </View>
        )}

        {/* Insider Notes */}
        {pulseData.insiderNotes && pulseData.insiderNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Insider Notes</Text>
            {pulseData.insiderNotes.map((note) => (
              <InsiderNote key={note.id} note={note} />
            ))}
          </View>
        )}

        {/* Key Stats */}
        {pulseData.keyStats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Key Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{pulseData.keyStats.recentForm}</Text>
                <Text style={styles.statLabel}>Recent Form</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{pulseData.keyStats.homeRecord}</Text>
                <Text style={styles.statLabel}>Home Record</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{pulseData.keyStats.atsRecord}</Text>
                <Text style={styles.statLabel}>ATS Record</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{pulseData.keyStats.avgPointsFor}</Text>
                <Text style={styles.statLabel}>Avg Points For</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.lastUpdatedText}>
          Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
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
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
    flex: 1,
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
  content: {
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
  weatherCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  weatherGradient: {
    padding: 20,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 6,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherLeft: {
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  conditions: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weatherRight: {
    alignItems: 'flex-end',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  weatherText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  weatherImpact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherRecommendation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
  },
  injuryCard: {
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
  injuryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  playerPosition: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  injuryStatus: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  impactText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  injuryType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 4,
  },
  injuryDescription: {
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  injuryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oddsImpact: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
    flex: 1,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  noteCard: {
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
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteSource: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sourceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginRight: 8,
  },
  reliabilityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  reliabilityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  noteText: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteCategory: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  impactIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movementCard: {
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
  movementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  movementType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  movementDirection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movementText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  movementReason: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  movementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volumeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  volumeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  movementTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  sentimentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sentimentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sentimentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  sentimentScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentimentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  sentimentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
  },
  sentimentMetric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  metricLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  keyTopics: {
    marginTop: 8,
  },
  topicsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  topicTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  topicText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  statCard: {
    width: (width - 60) / 2,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default TeamPulseScreen;