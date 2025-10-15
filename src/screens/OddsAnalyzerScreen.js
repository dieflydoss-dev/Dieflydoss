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
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

const OddsAnalyzerScreen = ({ navigation, route }) => {
  const [selectedTeam, setSelectedTeam] = useState(route?.params?.team || null);
  const [selectedMetric, setSelectedMetric] = useState('ats');
  const [timeframe, setTimeframe] = useState('season');
  const [analyticsData, setAnalyticsData] = useState({});

  const metrics = [
    { key: 'ats', name: 'Against Spread', icon: 'trending-up', color: '#007AFF' },
    { key: 'totals', name: 'Over/Under', icon: 'swap-vertical', color: '#34C759' },
    { key: 'moneyline', name: 'Moneyline', icon: 'cash', color: '#FF9500' },
    { key: 'roi', name: 'ROI Analysis', icon: 'analytics', color: '#AF52DE' },
  ];

  const timeframes = [
    { key: 'season', name: 'Season' },
    { key: 'last10', name: 'Last 10' },
    { key: 'home', name: 'Home' },
    { key: 'away', name: 'Away' },
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTeam, selectedMetric, timeframe]);

  const loadAnalyticsData = async () => {
    // Mock analytics data
    const mockData = {
      ats: {
        winRate: 65,
        record: '13-7',
        roi: '+$420',
        trend: [45, 52, 48, 61, 65, 58, 72, 69, 65, 71],
        homeAway: { home: 68, away: 62 },
        byOpponent: [
          { opponent: 'vs Top 10', rate: 45 },
          { opponent: 'vs 11-20', rate: 72 },
          { opponent: 'vs Bottom 10', rate: 85 },
        ],
      },
      totals: {
        overRate: 55,
        record: '11-9',
        roi: '+$180',
        trend: [60, 45, 52, 48, 55, 62, 58, 51, 55, 59],
        homeAway: { home: 52, away: 58 },
        byTotal: [
          { range: '< 45', rate: 65 },
          { range: '45-50', rate: 48 },
          { range: '> 50', rate: 62 },
        ],
      },
      moneyline: {
        winRate: 70,
        record: '14-6',
        roi: '+$520',
        trend: [65, 68, 72, 69, 70, 75, 71, 68, 70, 73],
        homeAway: { home: 75, away: 65 },
        byOdds: [
          { range: 'Favorite', rate: 82 },
          { range: 'Underdog', rate: 45 },
        ],
      },
      roi: {
        totalROI: '+$1,120',
        avgBet: '$100',
        bestBet: '+$280 (vs DAL)',
        worstBet: '-$150 (vs BUF)',
        monthlyROI: [120, 85, 240, 180, 95, 220, 180],
        betTypes: [
          { name: 'Spread', value: 45, color: '#007AFF' },
          { name: 'Total', value: 25, color: '#34C759' },
          { name: 'Moneyline', value: 30, color: '#FF9500' },
        ],
      },
    };

    setAnalyticsData(mockData);
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#f8f9fa',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(28, 28, 30, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
  };

  const MetricSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricSelector}>
      {metrics.map((metric) => (
        <TouchableOpacity
          key={metric.key}
          style={[
            styles.metricButton,
            selectedMetric === metric.key && styles.selectedMetricButton,
          ]}
          onPress={() => setSelectedMetric(metric.key)}
        >
          <LinearGradient
            colors={
              selectedMetric === metric.key
                ? [metric.color, `${metric.color}80`]
                : ['#FFFFFF', '#F8F9FA']
            }
            style={styles.metricGradient}
          >
            <Icon
              name={metric.icon}
              size={20}
              color={selectedMetric === metric.key ? 'white' : metric.color}
            />
            <Text
              style={[
                styles.metricText,
                selectedMetric === metric.key && styles.selectedMetricText,
              ]}
            >
              {metric.name}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const TimeframeSelector = () => (
    <View style={styles.timeframeSelector}>
      {timeframes.map((tf) => (
        <TouchableOpacity
          key={tf.key}
          style={[
            styles.timeframeButton,
            timeframe === tf.key && styles.selectedTimeframeButton,
          ]}
          onPress={() => setTimeframe(tf.key)}
        >
          <Text
            style={[
              styles.timeframeText,
              timeframe === tf.key && styles.selectedTimeframeText,
            ]}
          >
            {tf.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderATSAnalysis = () => {
    const data = analyticsData.ats;
    if (!data) return null;

    return (
      <ScrollView style={styles.analysisContainer}>
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{data.winRate}%</Text>
            <Text style={styles.metricLabel}>ATS Win Rate</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{data.record}</Text>
            <Text style={styles.metricLabel}>ATS Record</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#34C759' }]}>{data.roi}</Text>
            <Text style={styles.metricLabel}>ROI</Text>
          </View>
        </View>

        {/* Trend Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>ATS Performance Trend</Text>
          <LineChart
            data={{
              labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
              datasets: [{ data: data.trend }],
            }}
            width={width - 60}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Home vs Away */}
        <View style={styles.comparisonContainer}>
          <Text style={styles.sectionTitle}>Home vs Away Performance</Text>
          <View style={styles.comparisonBars}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Home</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${data.homeAway.home}%` }]} />
              </View>
              <Text style={styles.comparisonValue}>{data.homeAway.home}%</Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Away</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${data.homeAway.away}%` }]} />
              </View>
              <Text style={styles.comparisonValue}>{data.homeAway.away}%</Text>
            </View>
          </View>
        </View>

        {/* By Opponent Strength */}
        <View style={styles.breakdownContainer}>
          <Text style={styles.sectionTitle}>Performance by Opponent</Text>
          {data.byOpponent.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>{item.opponent}</Text>
              <View style={styles.breakdownBar}>
                <View style={[styles.breakdownProgress, { width: `${item.rate}%` }]} />
              </View>
              <Text style={styles.breakdownValue}>{item.rate}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderTotalsAnalysis = () => {
    const data = analyticsData.totals;
    if (!data) return null;

    return (
      <ScrollView style={styles.analysisContainer}>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{data.overRate}%</Text>
            <Text style={styles.metricLabel}>Over Hit Rate</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{data.record}</Text>
            <Text style={styles.metricLabel}>O/U Record</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#34C759' }]}>{data.roi}</Text>
            <Text style={styles.metricLabel}>ROI</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Over/Under Trend</Text>
          <LineChart
            data={{
              labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
              datasets: [{ data: data.trend }],
            }}
            width={width - 60}
            height={200}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})` }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.breakdownContainer}>
          <Text style={styles.sectionTitle}>Performance by Total Range</Text>
          {data.byTotal.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>{item.range}</Text>
              <View style={styles.breakdownBar}>
                <View style={[styles.breakdownProgress, { width: `${item.rate}%`, backgroundColor: '#34C759' }]} />
              </View>
              <Text style={styles.breakdownValue}>{item.rate}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderROIAnalysis = () => {
    const data = analyticsData.roi;
    if (!data) return null;

    return (
      <ScrollView style={styles.analysisContainer}>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#34C759' }]}>{data.totalROI}</Text>
            <Text style={styles.metricLabel}>Total ROI</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{data.avgBet}</Text>
            <Text style={styles.metricLabel}>Avg Bet Size</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#34C759' }]}>{data.bestBet}</Text>
            <Text style={styles.metricLabel}>Best Bet</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Monthly ROI</Text>
          <BarChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              datasets: [{ data: data.monthlyROI }],
            }}
            width={width - 60}
            height={200}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(175, 82, 222, ${opacity})` }}
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Bet Type Distribution</Text>
          <PieChart
            data={data.betTypes}
            width={width - 60}
            height={200}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>
      </ScrollView>
    );
  };

  const renderAnalysis = () => {
    switch (selectedMetric) {
      case 'ats':
        return renderATSAnalysis();
      case 'totals':
        return renderTotalsAnalysis();
      case 'roi':
        return renderROIAnalysis();
      default:
        return renderATSAnalysis();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 Odds Analyzer</Text>
        <TouchableOpacity>
          <Icon name="share" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {selectedTeam && (
        <View style={styles.teamHeader}>
          <View style={[styles.teamColorBar, { backgroundColor: selectedTeam.PrimaryColor }]} />
          <Text style={styles.teamName}>{selectedTeam.City} {selectedTeam.Name}</Text>
        </View>
      )}

      <MetricSelector />
      <TimeframeSelector />

      {renderAnalysis()}
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
  },
  metricSelector: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  metricButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedMetricButton: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  metricText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectedMetricText: {
    color: 'white',
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  selectedTimeframeButton: {
    backgroundColor: '#007AFF',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  selectedTimeframeText: {
    color: 'white',
  },
  analysisContainer: {
    flex: 1,
    padding: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  metricLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  comparisonContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  comparisonBars: {
    marginTop: 10,
  },
  comparisonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonLabel: {
    width: 60,
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  comparisonValue: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'right',
  },
  breakdownContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  breakdownBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginHorizontal: 12,
  },
  breakdownProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  breakdownValue: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'right',
  },
});

export default OddsAnalyzerScreen;