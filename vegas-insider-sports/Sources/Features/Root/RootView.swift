import SwiftUI

struct RootView: View {
    @EnvironmentObject private var env: AppEnvironment

    var body: some View {
        TabView(selection: $env.tabSelection) {
            FavoritesView()
                .tabItem { Label("Favorites", systemImage: "star.fill") }
                .tag(AppEnvironment.Tab.favorites)

            HotStreaksView()
                .tabItem { Label("Hot Streaks", systemImage: "flame.fill") }
                .tag(AppEnvironment.Tab.hotStreaks)

            LineWatchView()
                .tabItem { Label("Line Watch", systemImage: "chart.line.uptrend.xyaxis") }
                .tag(AppEnvironment.Tab.lineWatch)

            OddsAnalyzerView()
                .tabItem { Label("Odds Analyzer", systemImage: "percent") }
                .tag(AppEnvironment.Tab.oddsAnalyzer)

            BetVaultView()
                .tabItem { Label("My Bet Vault", systemImage: "lock.fill") }
                .tag(AppEnvironment.Tab.betVault)

            TeamPulseView()
                .tabItem { Label("Team Pulse", systemImage: "bolt.heart.fill") }
                .tag(AppEnvironment.Tab.teamPulse)
        }
        .tint(.primary)
    }
}

struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView().environmentObject(AppEnvironment())
    }
}
SWIFT
