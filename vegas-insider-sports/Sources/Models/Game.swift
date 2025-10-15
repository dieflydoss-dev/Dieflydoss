import Foundation

public struct Game: Codable, Identifiable, Hashable {
    public let id: String
    public let league: League
    public let homeTeam: Team
    public let awayTeam: Team
    public let startTime: Date
    public let venue: String?
}