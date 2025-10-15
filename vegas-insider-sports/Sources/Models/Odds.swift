import Foundation

public struct Odds: Codable, Hashable {
    public let spreadHome: Double?
    public let spreadAway: Double?
    public let moneylineHome: Int?
    public let moneylineAway: Int?
    public let total: Double?
    public let lastUpdated: Date
}

public struct TeamTrends: Codable, Hashable {
    public let atsCoverRate: Double // against the spread
    public let overRate: Double
    public let underRate: Double
    public let last10Record: String
}