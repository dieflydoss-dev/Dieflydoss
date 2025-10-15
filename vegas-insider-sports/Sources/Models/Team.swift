import Foundation

public struct Team: Codable, Identifiable, Hashable {
    public let id: String
    public let league: League
    public let name: String
    public let city: String
    public let abbreviation: String
    public let logoURL: URL?
}