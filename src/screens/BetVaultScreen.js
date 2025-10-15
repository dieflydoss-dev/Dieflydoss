import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const BetVaultScreen = ({ navigation }) => {
  const [bets, setBets] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddBetModal, setShowAddBetModal] = useState(false);
  const [newBet, setNewBet] = useState({
    team: '',
    opponent: '',
    betType: 'spread',
    amount: '',
    odds: '',
    line: '',
    confidence: 'medium',
  });
  const [stats, setStats] = useState({});

  const filters = [
    { key: 'all', name: 'All Bets', icon: 'list' },
    { key: 'pending', name: 'Pending', icon: 'time' },
    { key: 'won', name: 'Won', icon: 'checkmark-circle' },
    { key: 'lost', name: 'Lost', icon: 'close-circle' },
  ];

  const betTypes = [
    { key: 'spread', name: 'Spread', icon: 'trending-up' },
    { key: 'total', name: 'Over/Under', icon: 'swap-vertical' },
    { key: 'moneyline', name: 'Moneyline', icon: 'cash' },
    { key: 'prop', name: 'Prop Bet', icon: 'person' },
  ];

  const confidenceLevels = [
    { key: 'low', name: 'Low', color: '#8E8E93' },
    { key: 'medium', name: 'Medium', color: '#FF9500' },
    { key: 'high', name: 'High', color: '#34C759' },
  ];

  useEffect(() => {
    loadBets();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [bets]);

  const loadBets = async () => {
    try {
      const savedBets = await AsyncStorage.getItem('userBets');
      if (savedBets) {
        setBets(JSON.parse(savedBets));
      } else {
        // Load mock data
        const mockBets = [
          {
            id: 1,
            team: 'Kansas City Chiefs',
            opponent: 'Buffalo Bills',
            betType: 'spread',
            amount: 100,
            odds: -110,
            line: -3.5,
            confidence: 'high',
            status: 'won',
            result: '+$90.91',
            date: '2023-10-15',
            league: 'NFL',
          },
          {
            id: 2,
            team: 'Los Angeles Lakers',
            opponent: 'Boston Celtics',
            betType: 'total',
            amount: 50,
            odds: -105,
            line: 'Over 220.5',
            confidence: 'medium',
            status: 'lost',
            result: '-$50',
            date: '2023-10-14',
            league: 'NBA',
          },
          {
            id: 3,
            team: 'Tampa Bay Lightning',
            opponent: 'Florida Panthers',
            betType: 'moneyline',
            amount: 75,
            odds: +150,
            line: null,
            confidence: 'low',
            status: 'pending',
            result: null,
            date: '2023-10-16',
            league: 'NHL',
          },
        ];
        setBets(mockBets);
        await AsyncStorage.setItem('userBets', JSON.stringify(mockBets));
      }
    } catch (error) {
      console.error('Failed to load bets:', error);
    }
  };

  const saveBets = async (updatedBets) => {
    try {
      await AsyncStorage.setItem('userBets', JSON.stringify(updatedBets));
      setBets(updatedBets);
    } catch (error) {
      console.error('Failed to save bets:', error);
    }
  };

  const calculateStats = () => {
    const totalBets = bets.length;
    const wonBets = bets.filter(bet => bet.status === 'won').length;
    const lostBets = bets.filter(bet => bet.status === 'lost').length;
    const pendingBets = bets.filter(bet => bet.status === 'pending').length;
    
    const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0);
    const totalReturn = bets
      .filter(bet => bet.result)
      .reduce((sum, bet) => {
        const result = parseFloat(bet.result.replace(/[+$-]/g, ''));
        return sum + (bet.result.includes('+') ? result : -result);
      }, 0);

    const winRate = totalBets > 0 ? ((wonBets / (wonBets + lostBets)) * 100).toFixed(1) : 0;
    const roi = totalWagered > 0 ? ((totalReturn / totalWagered) * 100).toFixed(1) : 0;

    setStats({
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      totalWagered,
      totalReturn,
      winRate,
      roi,
    });
  };

  const addBet = async () => {
    if (!newBet.team || !newBet.amount || !newBet.odds) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const bet = {
      id: Date.now(),
      ...newBet,
      amount: parseFloat(newBet.amount),
      odds: parseFloat(newBet.odds),
      status: 'pending',
      result: null,
      date: new Date().toISOString().split('T')[0],
      league: 'NFL', // Default league
    };

    const updatedBets = [...bets, bet];
    await saveBets(updatedBets);
    
    setNewBet({
      team: '',
      opponent: '',
      betType: 'spread',
      amount: '',
      odds: '',
      line: '',
      confidence: 'medium',
    });
    setShowAddBetModal(false);
  };

  const updateBetStatus = async (betId, status, result = null) => {
    const updatedBets = bets.map(bet => 
      bet.id === betId ? { ...bet, status, result } : bet
    );
    await saveBets(updatedBets);
  };

  const deleteBet = async (betId) => {
    Alert.alert(
      'Delete Bet',
      'Are you sure you want to delete this bet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedBets = bets.filter(bet => bet.id !== betId);
            await saveBets(updatedBets);
          },
        },
      ]
    );
  };

  const filteredBets = bets.filter(bet => {
    if (selectedFilter === 'all') return true;
    return bet.status === selectedFilter;
  });

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
            ? ['#007AFF', '#007AFF80']
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

  const BetCard = ({ bet }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'won': return '#34C759';
        case 'lost': return '#FF3B30';
        default: return '#FF9500';
      }
    };

    const getConfidenceColor = (confidence) => {
      const level = confidenceLevels.find(c => c.key === confidence);
      return level ? level.color : '#8E8E93';
    };

    return (
      <View style={styles.betCard}>
        <LinearGradient colors={['#FFFFFF', '#FAFBFC']} style={styles.betCardGradient}>
          <View style={styles.betHeader}>
            <View style={styles.betInfo}>
              <Text style={styles.betMatchup}>
                {bet.team} vs {bet.opponent}
              </Text>
              <Text style={styles.betDate}>{bet.date} • {bet.league}</Text>
            </View>
            <View style={styles.betActions}>
              {bet.status === 'pending' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#34C759' }]}
                    onPress={() => {
                      const payout = (bet.amount * (Math.abs(bet.odds) / 100)).toFixed(2);
                      updateBetStatus(bet.id, 'won', `+$${payout}`);
                    }}
                  >
                    <Icon name="checkmark" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
                    onPress={() => updateBetStatus(bet.id, 'lost', `-$${bet.amount}`)}
                  >
                    <Icon name="close" size={16} color="white" />
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#8E8E93' }]}
                onPress={() => deleteBet(bet.id)}
              >
                <Icon name="trash" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.betDetails}>
            <View style={styles.betType}>
              <Icon
                name={betTypes.find(t => t.key === bet.betType)?.icon || 'help'}
                size={20}
                color="#007AFF"
              />
              <Text style={styles.betTypeText}>
                {betTypes.find(t => t.key === bet.betType)?.name || bet.betType}
              </Text>
              {bet.line && <Text style={styles.betLine}>{bet.line}</Text>}
            </View>

            <View style={styles.betMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Amount</Text>
                <Text style={styles.metricValue}>${bet.amount}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Odds</Text>
                <Text style={styles.metricValue}>
                  {bet.odds > 0 ? '+' : ''}{bet.odds}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Confidence</Text>
                <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(bet.confidence) }]}>
                  <Text style={styles.confidenceText}>{bet.confidence.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.betFooter}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bet.status) }]}>
              <Text style={styles.statusText}>{bet.status.toUpperCase()}</Text>
            </View>
            {bet.result && (
              <Text style={[
                styles.resultText,
                { color: bet.result.includes('+') ? '#34C759' : '#FF3B30' }
              ]}>
                {bet.result}
              </Text>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const AddBetModal = () => (
    <Modal visible={showAddBetModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddBetModal(false)}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add New Bet</Text>
          <TouchableOpacity onPress={addBet}>
            <Text style={styles.modalSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Team</Text>
            <TextInput
              style={styles.textInput}
              value={newBet.team}
              onChangeText={(text) => setNewBet({ ...newBet, team: text })}
              placeholder="Enter team name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Opponent</Text>
            <TextInput
              style={styles.textInput}
              value={newBet.opponent}
              onChangeText={(text) => setNewBet({ ...newBet, opponent: text })}
              placeholder="Enter opponent name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bet Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {betTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeButton,
                    newBet.betType === type.key && styles.selectedTypeButton,
                  ]}
                  onPress={() => setNewBet({ ...newBet, betType: type.key })}
                >
                  <Icon
                    name={type.icon}
                    size={16}
                    color={newBet.betType === type.key ? 'white' : '#007AFF'}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      newBet.betType === type.key && styles.selectedTypeButtonText,
                    ]}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Amount ($)</Text>
              <TextInput
                style={styles.textInput}
                value={newBet.amount}
                onChangeText={(text) => setNewBet({ ...newBet, amount: text })}
                placeholder="100"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.inputLabel}>Odds</Text>
              <TextInput
                style={styles.textInput}
                value={newBet.odds}
                onChangeText={(text) => setNewBet({ ...newBet, odds: text })}
                placeholder="-110"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Line/Details</Text>
            <TextInput
              style={styles.textInput}
              value={newBet.line}
              onChangeText={(text) => setNewBet({ ...newBet, line: text })}
              placeholder="e.g., -3.5, Over 45.5, etc."
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confidence Level</Text>
            <View style={styles.confidenceButtons}>
              {confidenceLevels.map((level) => (
                <TouchableOpacity
                  key={level.key}
                  style={[
                    styles.confidenceButton,
                    { borderColor: level.color },
                    newBet.confidence === level.key && { backgroundColor: level.color },
                  ]}
                  onPress={() => setNewBet({ ...newBet, confidence: level.key })}
                >
                  <Text
                    style={[
                      styles.confidenceButtonText,
                      { color: newBet.confidence === level.key ? 'white' : level.color },
                    ]}
                  >
                    {level.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 My Bet Vault</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddBetModal(true)}
        >
          <Icon name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.statsGradient}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalBets}</Text>
              <Text style={styles.statLabel}>Total Bets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#34C759' }]}>{stats.winRate}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                { color: stats.roi >= 0 ? '#34C759' : '#FF3B30' }
              ]}>
                {stats.roi >= 0 ? '+' : ''}{stats.roi}%
              </Text>
              <Text style={styles.statLabel}>ROI</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                { color: stats.totalReturn >= 0 ? '#34C759' : '#FF3B30' }
              ]}>
                {stats.totalReturn >= 0 ? '+' : ''}${stats.totalReturn?.toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Profit/Loss</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {filters.map((filter) => (
          <FilterButton key={filter.key} filter={filter} />
        ))}
      </ScrollView>

      {/* Bets List */}
      <FlatList
        data={filteredBets}
        renderItem={({ item }) => <BetCard bet={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.betsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="wallet-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateText}>No bets found</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedFilter === 'all' 
                ? 'Start tracking your bets by adding your first bet'
                : `No ${selectedFilter} bets to display`
              }
            </Text>
          </View>
        }
      />

      <AddBetModal />
    </SafeAreaView>
  );
};

// Styles would be extensive - I'll provide a condensed version
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
  addButton: {
    padding: 8,
  },
  statsContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statsGradient: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  betsList: {
    padding: 20,
  },
  betCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  betCardGradient: {
    padding: 20,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  betInfo: {
    flex: 1,
  },
  betMatchup: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  betDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  betActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  betDetails: {
    marginBottom: 12,
  },
  betType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  betTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  betLine: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  betMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 2,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  betFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalCancel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  modalSave: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputRow: {
    flexDirection: 'row',
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 12,
  },
  selectedTypeButton: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  selectedTypeButtonText: {
    color: 'white',
  },
  confidenceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confidenceButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  confidenceButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BetVaultScreen;