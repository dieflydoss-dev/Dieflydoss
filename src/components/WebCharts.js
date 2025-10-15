import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Web-compatible chart components as fallbacks
export const LineChart = ({ data, width: chartWidth, height, chartConfig, style, ...props }) => {
  return (
    <View style={[styles.chartContainer, style, { width: chartWidth, height }]}>
      <Text style={styles.chartTitle}>Line Chart</Text>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>📈 Chart Data Visualization</Text>
        <Text style={styles.dataText}>
          Data Points: {data?.datasets?.[0]?.data?.length || 0}
        </Text>
      </View>
    </View>
  );
};

export const BarChart = ({ data, width: chartWidth, height, chartConfig, style, ...props }) => {
  return (
    <View style={[styles.chartContainer, style, { width: chartWidth, height }]}>
      <Text style={styles.chartTitle}>Bar Chart</Text>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>📊 Bar Chart Visualization</Text>
        <Text style={styles.dataText}>
          Categories: {data?.labels?.length || 0}
        </Text>
      </View>
    </View>
  );
};

export const PieChart = ({ data, width: chartWidth, height, chartConfig, style, ...props }) => {
  return (
    <View style={[styles.chartContainer, style, { width: chartWidth, height }]}>
      <Text style={styles.chartTitle}>Pie Chart</Text>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>🥧 Pie Chart Visualization</Text>
        <Text style={styles.dataText}>
          Segments: {data?.length || 0}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
    textAlign: 'center',
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default {
  LineChart,
  BarChart,
  PieChart,
};