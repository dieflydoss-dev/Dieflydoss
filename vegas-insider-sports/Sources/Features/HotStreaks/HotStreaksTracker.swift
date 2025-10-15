import Foundation

public struct HotStreak: Identifiable, Hashable {
    public let id = UUID()
    public let team: Team
    public let streakDescription: String
}