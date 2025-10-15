import Foundation
import Combine

public protocol SportsRepository {
    func leagues() -> AnyPublisher<[League], Never>
    func teams(in league: League) -> AnyPublisher<[Team], Error>
    func upcomingGames(for teamId: String) -> AnyPublisher<[Game], Error>
    func odds(for gameId: String) -> AnyPublisher<Odds, Error>
    func trends(for teamId: String) -> AnyPublisher<TeamTrends, Error>
    func hotStreaks() -> AnyPublisher<[Team], Error>
    func lineWatchStream(league: League) -> AnyPublisher<(String /*gameId*/, Odds), Error>
    func teamPulseStream(teamId: String) -> AnyPublisher<TeamPulseEvent, Error>
}

public enum TeamPulseEvent: Equatable {
    case injury(String)
    case insiderNote(String)
    case weather(String)
}

public final class LiveSportsRepository: SportsRepository {
    private let scheduler: DispatchQueue = .init(label: "repo")

    public init() {}

    public func leagues() -> AnyPublisher<[League], Never> {
        Just(League.allCases).eraseToAnyPublisher()
    }

    public func teams(in league: League) -> AnyPublisher<[Team], Error> {
        // Stubbed list; integrate with real API (e.g., Sportradar, The Odds API)
        let sample = [Team(id: "NYG", league: .nfl, name: "Giants", city: "New York", abbreviation: "NYG", logoURL: nil)]
        return Just(sample).setFailureType(to: Error.self).eraseToAnyPublisher()
    }

    public func upcomingGames(for teamId: String) -> AnyPublisher<[Game], Error> {
        let t = Team(id: teamId, league: .nfl, name: teamId, city: "", abbreviation: teamId, logoURL: nil)
        let g = Game(id: UUID().uuidString, league: .nfl, homeTeam: t, awayTeam: t, startTime: Date().addingTimeInterval(3600), venue: nil)
        return Just([g]).setFailureType(to: Error.self).eraseToAnyPublisher()
    }

    public func odds(for gameId: String) -> AnyPublisher<Odds, Error> {
        let o = Odds(spreadHome: -2.5, spreadAway: 2.5, moneylineHome: -130, moneylineAway: 110, total: 44.5, lastUpdated: Date())
        return Just(o).setFailureType(to: Error.self).eraseToAnyPublisher()
    }

    public func trends(for teamId: String) -> AnyPublisher<TeamTrends, Error> {
        let t = TeamTrends(atsCoverRate: 0.58, overRate: 0.47, underRate: 0.53, last10Record: "7-3")
        return Just(t).setFailureType(to: Error.self).eraseToAnyPublisher()
    }

    public func hotStreaks() -> AnyPublisher<[Team], Error> {
        return teams(in: .nfl)
    }

    public func lineWatchStream(league: League) -> AnyPublisher<(String, Odds), Error> {
        Timer.publish(every: 5, on: .main, in: .common)
            .autoconnect()
            .map { _ in (UUID().uuidString, Odds(spreadHome: -1.5, spreadAway: 1.5, moneylineHome: -120, moneylineAway: 100, total: 45.0, lastUpdated: Date())) }
            .setFailureType(to: Error.self)
            .eraseToAnyPublisher()
    }

    public func teamPulseStream(teamId: String) -> AnyPublisher<TeamPulseEvent, Error> {
        Timer.publish(every: 10, on: .main, in: .common)
            .autoconnect()
            .map { _ in .injury("Probable: Star Player") }
            .setFailureType(to: Error.self)
            .eraseToAnyPublisher()
    }
}