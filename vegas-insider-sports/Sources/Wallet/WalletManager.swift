import Foundation
import PassKit
import Combine

public protocol WalletManager {
    var isWalletAvailable: Bool { get }
    func addBetPass(for bet: Bet) -> AnyPublisher<Void, Error>
}

public final class DefaultWalletManager: NSObject, WalletManager, PKAddPassesViewControllerDelegate {
    public var isWalletAvailable: Bool { PKPassLibrary.isPassLibraryAvailable() }

    public func addBetPass(for bet: Bet) -> AnyPublisher<Void, Error> {
        // This is a stub for demo purposes.
        // In production, request a signed .pkpass from your server and present PKAddPassesViewController.
        return Just(()).setFailureType(to: Error.self).eraseToAnyPublisher()
    }

    public func addPassesViewControllerDidFinish(_ controller: PKAddPassesViewController) {
        controller.dismiss(animated: true)
    }
}