import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import SportsDataService from '../services/SportsDataService';
import { getAppService } from '../services/AppService';

const { width } = Dimensions.get('window');

const TeamsScreen = ({ navigation }) => {
  const [selectedLeague, setSelectedLeague] = useState('NFL');
  const [teams, setTeams] = useState([]);
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const leagues = [
    { key: 'NFL', name: 'NFL', icon: 'american-football', color: '#013369' },
    { key: 'NBA', name: 'NBA', icon: 'basketball', color: '#C8102E' },
    { key: 'MLB', name: 'MLB', icon: 'baseball', color: '#041E42' },
    { key: 'NHL', name: 'NHL', icon: 'ice-cream', color: '#000000' },
    { key: 'NCAA', name: 'NCAA', icon: 'school', color: '#FF8C00' },
  ];

  useEffect(() => {
    loadTeams();
    loadFavoriteTeams();
  }, [selectedLeague]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await SportsDataService.getTeams(selectedLeague);
      setTeams(teamsData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load teams:', error);
      setLoading(false);
    }
  };

  const loadFavoriteTeams = async () => {
    try {
      const appService = getAppService();
      const preferences = appService.getUserPreferences();
      setFavoriteTeams(preferences.favoriteTeams || []);
    } catch (error) {
      console.error('Failed to load favorite teams:', error);
    }
  };

  const toggleFavoriteTeam = async (teamId) => {
    try {
      const appService = getAppService();
      let newFavorites;
      
      if (favoriteTeams.includes(teamId)) {
        newFavorites = favoriteTeams.filter(id => id !== teamId);
      } else {
        newFavorites = [...favoriteTeams, teamId];
      }
      
      setFavoriteTeams(newFavorites);
      await appService.saveUserPreferences({ favoriteTeams: newFavorites });
    } catch (error) {
      console.error('Failed to update favorite teams:', error);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.City.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LeagueSelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.leagueSelector}
    >
      {leagues.map((league) => (
        <TouchableOpacity
          key={league.key}
          style={[
            styles.leagueButton,
            selectedLeague === league.key && styles.selectedLeagueButton,
          ]}
          onPress={() => setSelectedLeague(league.key)}
        >
          <LinearGradient
            colors={
              selectedLeague === league.key
                ? [league.color, `${league.color}80`]
                : ['#FFFFFF', '#F8F9FA']
            }
            style={styles.leagueGradient}
          >
            <Icon 
              name={league.icon} 
              size={20} 
              color={selectedLeague === league.key ? 'white' : league.color} 
            />
            <Text
              style={[
                styles.leagueText,
                selectedLeague === league.key && styles.selectedLeagueText,
              ]}
            >
              {league.name}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const TeamCard = ({ team }) => {
    const isFavorite = favoriteTeams.includes(team.TeamID);
    
    return (
      <TouchableOpacity
        style={styles.teamCard}
        onPress={() => navigation.navigate('TeamDetail', { team })}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          style={styles.teamCardGradient}
        >
          <View style={styles.teamCardHeader}>
            <View style={styles.teamInfo}>
              <View style={[styles.teamColorIndicator, { backgroundColor: team.PrimaryColor }]} />
              <View>
                <Text style={styles.teamCity}>{team.City}</Text>
                <Text style={styles.teamName}>{team.Name}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavoriteTeam(team.TeamID)}
            >
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#FF3B30' : '#8E8E93'}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.teamStats}>
            <View style={styles.statColumn}>
              <Text style={styles.statValue}>8-2</Text>
              <Text style={styles.statLabel}>Record</Text>
            </View>
            <View style={styles.statColumn}>
              <Text style={styles.statValue}>65%</Text>
              <Text style={styles.statLabel}>ATS</Text>
            </View>
            <View style={styles.statColumn}>
              <Text style={[styles.statValue, { color: '#34C759' }]}>+$240</Text>
              <Text style={styles.statLabel}>ROI</Text>
            </View>
          </View>
          
          <View style={styles.teamDivision}>
            <Text style={styles.divisionText}>
              {team.Conference} {team.Division}
            </Text>
            <Icon name="chevron-forward" size={16} color="#C7C7CC" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teams</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <LeagueSelector />

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teams..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {favoriteTeams.length > 0 && (
        <View style={styles.favoritesSection}>
          <Text style={styles.sectionTitle}>⭐ My Favorites</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {teams
              .filter(team => favoriteTeams.includes(team.TeamID))
              .map(team => (
                <TouchableOpacity
                  key={team.TeamID}
                  style={styles.favoriteTeamChip}
                  onPress={() => navigation.navigate('TeamDetail', { team })}
                >
                  <View style={[styles.chipColorBar, { backgroundColor: team.PrimaryColor }]} />
                  <Text style={styles.chipText}>{team.Key}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredTeams}
        renderItem={({ item }) => <TeamCard team={item} />}
        keyExtractor={(item) => item.TeamID.toString()}
        contentContainerStyle={styles.teamsList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.teamRow}
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
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  filterButton: {
    padding: 8,
  },
  leagueSelector: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  leagueButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedLeagueButton: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leagueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leagueText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectedLeagueText: {
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  favoritesSection: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  favoriteTeamChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  chipColorBar: {
    width: 3,
    height: 16,
    borderRadius: 1.5,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  teamsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  teamRow: {
    justifyContent: 'space-between',
  },
  teamCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  teamCardGradient: {
    padding: 16,
  },
  teamCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamColorIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 10,
  },
  teamCity: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 2,
  },
  favoriteButton: {
    padding: 4,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  statColumn: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  teamDivision: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divisionText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
});

export default TeamsScreen;