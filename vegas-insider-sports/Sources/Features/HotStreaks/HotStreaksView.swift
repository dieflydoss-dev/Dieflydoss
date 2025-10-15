import SwiftUI

struct HotStreaksView: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var teams: [Team] = []

    var body: some View {
        List(teams, id: \.id) { team in
            HStack(spacing: 12) {
                Circle().fill(.green.opacity(0.2)).frame(width: 40, height: 40)
                    .overlay(Image(systemName: "flame.fill").foregroundStyle(.orange))
                VStack(alignment: .leading) {
                    Text(team.city + " " + team.name).font(.headline)
                    Text(team.league.displayName).font(.subheadline).foregroundStyle(.secondary)
                }
                Spacer()
                Image(systemName: "chevron.right").foregroundStyle(.tertiary)
            }
            .padding(.vertical, 4)
        }
        .listStyle(.insetGrouped)
        .navigationTitle("Hot Streaks")
        .onAppear {
            _ = env.apiRepository.hotStreaks().replaceError(with: []).sink { teams = $0 }
        }
    }
}

struct HotStreaksView_Previews: PreviewProvider {
    static var previews: some View { HotStreaksView().environmentObject(AppEnvironment()) }
}