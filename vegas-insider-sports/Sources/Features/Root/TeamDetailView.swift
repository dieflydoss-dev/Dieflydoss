import SwiftUI
import Combine

struct TeamDetailView: View {
    @EnvironmentObject private var env: AppEnvironment
    let team: Team
    @State private var games: [Game] = []
    @State private var oddsByGameId: [String: Odds] = [:]

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                HStack(spacing: 12) {
                    Image("za_icon").resizable().scaledToFit().frame(width: 44, height: 44).clipShape(RoundedRectangle(cornerRadius: 10))
                    VStack(alignment: .leading) {
                        Text(team.city + " " + team.name).font(.title3.bold())
                        Text(team.league.displayName).font(.subheadline).foregroundStyle(.secondary)
                    }
                    Spacer()
                }

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    StatCard(title: "ATS Cover", value: "--", color: .green)
                    StatCard(title: "O/U Hit", value: "--", color: .blue)
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("Upcoming Games").font(.headline)
                    ForEach(games, id: \.id) { g in
                        let odds = oddsByGameId[g.id]
                        HStack {
                            VStack(alignment: .leading) {
                                Text("Game \(g.id.prefix(6))...")
                                Text(g.startTime, style: .date).foregroundStyle(.secondary).font(.footnote)
                            }
                            Spacer()
                            if let odds = odds { Text("Spread \(odds.spreadHome ?? 0, specifier: \"%.1f\")").font(.callout) }
                            Image(systemName: "chevron.right").foregroundStyle(.tertiary)
                        }
                        .padding()
                        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
                    }
                }
            }
            .padding()
        }
        .navigationTitle(team.abbreviation)
        .onAppear(load)
    }

    private func load() {
        _ = env.apiRepository.upcomingGames(for: team.id).replaceError(with: []).sink { games = $0 }
        for g in games {
            _ = env.apiRepository.odds(for: g.id).replaceError(with: Odds(spreadHome: nil, spreadAway: nil, moneylineHome: nil, moneylineAway: nil, total: nil, lastUpdated: Date())).sink { oddsByGameId[g.id] = $0 }
        }
    }
}