import axios from 'axios';

class SportsDataService {
  constructor() {
    this.baseURL = 'https://api.sportsdata.io/v3';
    this.apiKey = 'YOUR_API_KEY'; // Replace with actual API key
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async makeRequest(endpoint, params = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          key: this.apiKey,
          ...params,
        },
      });

      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      // Return mock data for demo purposes
      return this.getMockData(endpoint);
    }
  }

  getMockData(endpoint) {
    const mockData = {
      '/nfl/scores/json/Teams': this.getMockNFLTeams(),
      '/nba/scores/json/Teams': this.getMockNBATeams(),
      '/mlb/scores/json/Teams': this.getMockMLBTeams(),
      '/nhl/scores/json/Teams': this.getMockNHLTeams(),
      '/odds': this.getMockOdds(),
      '/games': this.getMockGames(),
      '/player-stats': this.getMockPlayerStats(),
    };

    return mockData[endpoint] || [];
  }

  getMockNFLTeams() {
    return [
      {
        TeamID: 1,
        Key: 'KC',
        City: 'Kansas City',
        Name: 'Chiefs',
        Conference: 'AFC',
        Division: 'West',
        PrimaryColor: '#E31837',
        SecondaryColor: '#FFB81C',
        WikipediaLogoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Kansas_City_Chiefs_logo.svg',
      },
      {
        TeamID: 2,
        Key: 'BUF',
        City: 'Buffalo',
        Name: 'Bills',
        Conference: 'AFC',
        Division: 'East',
        PrimaryColor: '#00338D',
        SecondaryColor: '#C60C30',
        WikipediaLogoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/77/Buffalo_Bills_logo.svg',
      },
      {
        TeamID: 3,
        Key: 'SF',
        City: 'San Francisco',
        Name: '49ers',
        Conference: 'NFC',
        Division: 'West',
        PrimaryColor: '#AA0000',
        SecondaryColor: '#B3995D',
        WikipediaLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/San_Francisco_49ers_logo.svg',
      },
      // Add more teams...
    ];
  }

  getMockNBATeams() {
    return [
      {
        TeamID: 1,
        Key: 'LAL',
        City: 'Los Angeles',
        Name: 'Lakers',
        Conference: 'Western',
        Division: 'Pacific',
        PrimaryColor: '#552583',
        SecondaryColor: '#FDB927',
        WikipediaLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg',
      },
      {
        TeamID: 2,
        Key: 'BOS',
        City: 'Boston',
        Name: 'Celtics',
        Conference: 'Eastern',
        Division: 'Atlantic',
        PrimaryColor: '#007A33',
        SecondaryColor: '#BA9653',
        WikipediaLogoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg',
      },
      // Add more teams...
    ];
  }

  getMockMLBTeams() {
    return [
      {
        TeamID: 1,
        Key: 'NYY',
        City: 'New York',
        Name: 'Yankees',
        League: 'American',
        Division: 'East',
        PrimaryColor: '#132448',
        SecondaryColor: '#C4CED4',
        WikipediaLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/25/New_York_Yankees_Primary_Logo.svg',
      },
      // Add more teams...
    ];
  }

  getMockNHLTeams() {
    return [
      {
        TeamID: 1,
        Key: 'TBL',
        City: 'Tampa Bay',
        Name: 'Lightning',
        Conference: 'Eastern',
        Division: 'Atlantic',
        PrimaryColor: '#002868',
        SecondaryColor: '#FFFFFF',
        WikipediaLogoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Tampa_Bay_Lightning_Logo_2011.svg',
      },
      // Add more teams...
    ];
  }

  getMockOdds() {
    return [
      {
        GameID: 1,
        HomeTeam: 'KC',
        AwayTeam: 'BUF',
        Spread: -3.5,
        OverUnder: 54.5,
        MoneyLineHome: -165,
        MoneyLineAway: +145,
        Updated: new Date().toISOString(),
      },
      // Add more odds...
    ];
  }

  getMockGames() {
    return [
      {
        GameID: 1,
        Season: 2023,
        Week: 8,
        HomeTeam: 'KC',
        AwayTeam: 'BUF',
        DateTime: '2023-10-15T20:20:00',
        HomeScore: null,
        AwayScore: null,
        Quarter: null,
        TimeRemainingMinutes: null,
        TimeRemainingSeconds: null,
        Status: 'Scheduled',
      },
      // Add more games...
    ];
  }

  getMockPlayerStats() {
    return [
      {
        PlayerID: 1,
        Name: 'Patrick Mahomes',
        Team: 'KC',
        Position: 'QB',
        PassingYards: 3200,
        PassingTouchdowns: 28,
        Interceptions: 8,
        CompletionPercentage: 67.5,
      },
      // Add more player stats...
    ];
  }

  // API Methods
  async getTeams(league) {
    return this.makeRequest(`/${league.toLowerCase()}/scores/json/Teams`);
  }

  async getOdds(league, date) {
    return this.makeRequest('/odds', { league, date });
  }

  async getGames(league, season, week) {
    return this.makeRequest('/games', { league, season, week });
  }

  async getPlayerStats(league, season) {
    return this.makeRequest('/player-stats', { league, season });
  }

  async getTeamStats(teamId, season) {
    return this.makeRequest(`/team-stats/${teamId}`, { season });
  }

  async getBettingTrends(teamId) {
    return this.makeRequest(`/betting-trends/${teamId}`);
  }
}

export default new SportsDataService();