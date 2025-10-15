import Foundation

public enum League: String, CaseIterable, Codable, Identifiable {
    case nfl, nba, mlb, nhl, ncaaf, ncaab

    public var id: String { rawValue }
    public var displayName: String {
        switch self {
        case .nfl: return "NFL"
        case .nba: return "NBA"
        case .mlb: return "MLB"
        case .nhl: return "NHL"
        case .ncaaf: return "NCAA Football"
        case .ncaab: return "NCAA Basketball"
        }
    }
}