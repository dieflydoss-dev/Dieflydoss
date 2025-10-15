import SwiftUI

struct FavoritesView: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var selectedLeague: League = .nfl
    @State private var teams: [Team] = []

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Picker("League", selection: $selectedLeague) {
                    ForEach(League.allCases) { l in Text(l.displayName).tag(l) }
                }
                .pickerStyle(.segmented)

                List(teams, id: \.id) { team in
                    NavigationLink {
                        TeamDetailView(team: team)
                            .onAppear { env.selectedTeam = team }
                    } label: {
                        HStack {
                            RoundedRectangle(cornerRadius: 10)
                                .fill(.ultraThinMaterial)
                                .frame(width: 44, height: 44)
                            VStack(alignment: .leading) {
                                Text(team.city + " " + team.name).font(.headline)
                                Text(team.league.displayName).font(.subheadline).foregroundStyle(.secondary)
                            }
                            Spacer()
                            Image(systemName: "chevron.right")
                                .foregroundStyle(.tertiary)
                        }
                    }
                }
                .listStyle(.insetGrouped)
            }
            .padding()
            .navigationTitle("Favorites")
        }
        .onAppear { loadTeams() }
        .onChange(of: selectedLeague) { _ in loadTeams() }
        .animation(.spring(duration: 0.35), value: teams)
    }

    private func loadTeams() {
        _ = env.apiRepository.teams(in: selectedLeague)
            .replaceError(with: [])
            .sink { teams = $0 }
    }
}

struct FavoritesView_Previews: PreviewProvider {
    static var previews: some View {
        FavoritesView().environmentObject(AppEnvironment())
    }
}