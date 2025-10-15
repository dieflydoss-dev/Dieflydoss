import Foundation
import Combine

final class AppEnvironment: ObservableObject {
    enum Tab: Hashable { case favorites, hotStreaks, lineWatch, oddsAnalyzer, betVault, teamPulse }

    @Published var tabSelection: Tab = .favorites
    @Published var selectedTeam: Team? = nil

    let apiRepository: SportsRepository
    let betVaultStore: BetVaultStore
    let walletManager: WalletManager

    init(apiRepository: SportsRepository = LiveSportsRepository(),
         betVaultStore: BetVaultStore = DefaultBetVaultStore(),
         walletManager: WalletManager = DefaultWalletManager()) {
        self.apiRepository = apiRepository
        self.betVaultStore = betVaultStore
        self.walletManager = walletManager
    }
}