import SwiftUI
import Combine

struct BetVaultView: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var bets: [Bet] = []
    @State private var showingAdd = false

    var body: some View {
        List {
            ForEach(bets) { bet in
                VStack(alignment: .leading, spacing: 4) {
                    Text(bet.type.rawValue.capitalized + " @ " + String(bet.oddsAmerican)).font(.headline)
                    Text(bet.datePlaced, style: .date).font(.subheadline).foregroundStyle(.secondary)
                }
            }
            .onDelete(perform: delete)
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button { showingAdd = true } label: { Image(systemName: "plus.circle.fill") }
            }
        }
        .sheet(isPresented: $showingAdd) { AddBetView(onSave: add) }
        .navigationTitle("My Bet Vault")
        .onAppear { load() }
    }

    private func load() {
        _ = env.betVaultStore.list().replaceError(with: []).sink { bets = $0 }
    }

    private func add(_ bet: Bet) {
        _ = env.betVaultStore.add(bet).sink(receiveCompletion: { _ in }, receiveValue: { load() })
    }

    private func delete(at offsets: IndexSet) {
        let ids = offsets.map { bets[$0].id }
        for id in ids {
            _ = env.betVaultStore.delete(id: id).sink(receiveCompletion: { _ in }, receiveValue: { })
        }
        load()
    }
}

struct AddBetView: View {
    var onSave: (Bet) -> Void
    @Environment(\.dismiss) var dismiss
    @State private var type: BetType = .spread
    @State private var odds = -110
    @State private var stake = 10.0

    var body: some View {
        NavigationStack {
            Form {
                Picker("Type", selection: $type) {
                    Text("Spread").tag(BetType.spread)
                    Text("Moneyline").tag(BetType.moneyline)
                    Text("Over").tag(BetType.totalOver)
                    Text("Under").tag(BetType.totalUnder)
                }
                Stepper(value: $odds, in: -500...500, step: 5) {
                    Text("Odds: \(odds)")
                }
                Stepper(value: $stake, in: 1...1000, step: 1) {
                    Text("Stake: $\(stake, specifier: "%.0f")")
                }
            }
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        let bet = Bet(id: UUID(), datePlaced: Date(), league: .nfl, gameId: UUID().uuidString, team: nil, type: type, line: nil, oddsAmerican: odds, stake: stake, result: .pending)
                        onSave(bet)
                        dismiss()
                    }
                }
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
            }
            .navigationTitle("Add Bet")
        }
    }
}

struct BetVaultView_Previews: PreviewProvider {
    static var previews: some View { BetVaultView().environmentObject(AppEnvironment()) }
}