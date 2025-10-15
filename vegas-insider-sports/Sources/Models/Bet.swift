import Foundation

public enum BetType: String, Codable { case spread, moneyline, totalOver, totalUnder, parlay }

public struct Bet: Codable, Identifiable, Hashable {
    public let id: UUID
    public let datePlaced: Date
    public let league: League
    public let gameId: String
    public let team: Team?
    public let type: BetType
    public let line: Double?
    public let oddsAmerican: Int
    public let stake: Double
    public var result: BetResult?
}

public enum BetResult: String, Codable { case win, loss, push, pending }