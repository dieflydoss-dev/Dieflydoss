import Foundation
import Combine

public protocol BetVaultStore {
    func add(_ bet: Bet) -> AnyPublisher<Void, Error>
    func update(_ bet: Bet) -> AnyPublisher<Void, Error>
    func delete(id: UUID) -> AnyPublisher<Void, Error>
    func list() -> AnyPublisher<[Bet], Error>
}

public final class DefaultBetVaultStore: BetVaultStore {
    private let storageURL: URL
    private let queue = DispatchQueue(label: "betvault")

    public init(storageURL: URL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("betvault.json")) {
        self.storageURL = storageURL
    }

    public func add(_ bet: Bet) -> AnyPublisher<Void, Error> { mutate { bets in bets.append(bet) } }
    public func update(_ bet: Bet) -> AnyPublisher<Void, Error> { mutate { bets in
        if let idx = bets.firstIndex(where: { $0.id == bet.id }) { bets[idx] = bet }
    }}
    public func delete(id: UUID) -> AnyPublisher<Void, Error> { mutate { bets in
        bets.removeAll { $0.id == id }
    }}

    public func list() -> AnyPublisher<[Bet], Error> {
        Future { promise in
            self.queue.async {
                do {
                    let data = try Data(contentsOf: self.storageURL)
                    let decoded = try JSONDecoder().decode([Bet].self, from: data)
                    promise(.success(decoded))
                } catch {
                    promise(.success([]))
                }
            }
        }.eraseToAnyPublisher()
    }

    private func mutate(_ block: @escaping (inout [Bet]) -> Void) -> AnyPublisher<Void, Error> {
        Future { promise in
            self.queue.async {
                var list: [Bet] = (try? JSONDecoder().decode([Bet].self, from: (try? Data(contentsOf: self.storageURL)) ?? Data())) ?? []
                block(&list)
                do {
                    let data = try JSONEncoder().encode(list)
                    try FileManager.default.createDirectory(at: self.storageURL.deletingLastPathComponent(), withIntermediateDirectories: true)
                    try data.write(to: self.storageURL, options: .atomic)
                    promise(.success(()))
                } catch {
                    promise(.failure(error))
                }
            }
        }.eraseToAnyPublisher()
    }
}