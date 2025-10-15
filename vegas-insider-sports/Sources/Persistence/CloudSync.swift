import Foundation
import CloudKit
import Combine

public final class BetCloudSync {
    private let container: CKContainer
    private let database: CKDatabase

    public init(container: CKContainer = .default()) {
        self.container = container
        self.database = container.privateCloudDatabase
    }

    public func save(_ bet: Bet) -> AnyPublisher<Void, Error> {
        let record = CKRecord(recordType: "Bet", recordID: CKRecord.ID(recordName: bet.id.uuidString))
        record["datePlaced"] = bet.datePlaced as CKRecordValue
        record["league"] = bet.league.rawValue as CKRecordValue
        record["gameId"] = bet.gameId as CKRecordValue
        record["teamAbbr"] = bet.team?.abbreviation as CKRecordValue?
        record["type"] = bet.type.rawValue as CKRecordValue
        record["line"] = (bet.line ?? 0) as CKRecordValue
        record["oddsAmerican"] = bet.oddsAmerican as CKRecordValue
        record["stake"] = bet.stake as CKRecordValue
        record["result"] = bet.result?.rawValue as CKRecordValue?

        return Future { promise in
            self.database.save(record) { _, error in
                if let error = error { promise(.failure(error)) } else { promise(.success(())) }
            }
        }.eraseToAnyPublisher()
    }

    public func fetchAll() -> AnyPublisher<[Bet], Error> {
        let query = CKQuery(recordType: "Bet", predicate: NSPredicate(value: true))
        return Future { promise in
            self.database.perform(query, inZoneWith: nil) { records, error in
                if let error = error { promise(.failure(error)); return }
                let list: [Bet] = (records ?? []).compactMap { r in
                    guard
                        let date = r["datePlaced"] as? Date,
                        let leagueRaw = r["league"] as? String,
                        let league = League(rawValue: leagueRaw),
                        let gameId = r["gameId"] as? String,
                        let typeRaw = r["type"] as? String,
                        let type = BetType(rawValue: typeRaw),
                        let odds = r["oddsAmerican"] as? Int,
                        let stake = r["stake"] as? Double
                    else { return nil }
                    let teamAbbr = r["teamAbbr"] as? String
                    let resultRaw = r["result"] as? String
                    let result = resultRaw.flatMap(BetResult.init(rawValue:))
                    return Bet(id: UUID(uuidString: r.recordID.recordName) ?? UUID(),
                               datePlaced: date,
                               league: league,
                               gameId: gameId,
                               team: teamAbbr.map { Team(id: $0, league: league, name: $0, city: "", abbreviation: $0, logoURL: nil) },
                               type: type,
                               line: (r["line"] as? Double),
                               oddsAmerican: odds,
                               stake: stake,
                               result: result)
                }
                promise(.success(list))
            }
        }.eraseToAnyPublisher()
    }
}