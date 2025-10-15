import SwiftUI
import Combine

struct LineWatchView: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var selectedLeague: League = .nfl
    @State private var updates: [(String, Odds)] = []
    @State private var cancellable: AnyCancellable?

    var body: some View {
        VStack(spacing: 0) {
            Picker("League", selection: $selectedLeague) {
                ForEach(League.allCases) { l in Text(l.displayName).tag(l) }
            }
            .pickerStyle(.segmented)
            .padding()

            List(updates, id: \.0) { item in
                let odds = item.1
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Game \(item.0.prefix(6))...").font(.headline)
                        Text("Spread: \(odds.spreadHome ?? 0, specifier: \"%.1f\") / Total: \(odds.total ?? 0, specifier: \"%.1f\")")
                            .font(.subheadline).foregroundStyle(.secondary)
                    }
                    Spacer()
                    Text(odds.lastUpdated, style: .time).foregroundStyle(.tertiary)
                }
            }
            .listStyle(.insetGrouped)
        }
        .navigationTitle("Line Watch")
        .onAppear(attach)
        .onChange(of: selectedLeague) { _ in attach() }
    }

    private func attach() {
        cancellable = env.apiRepository.lineWatchStream(league: selectedLeague)
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { _ in }, receiveValue: { tuple in
                updates.insert(tuple, at: 0)
                updates = Array(updates.prefix(50))
            })
    }
}

struct LineWatchView_Previews: PreviewProvider {
    static var previews: some View { LineWatchView().environmentObject(AppEnvironment()) }
}