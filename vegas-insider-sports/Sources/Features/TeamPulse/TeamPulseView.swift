import SwiftUI
import Combine

struct TeamPulseView: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var events: [TeamPulseEvent] = []
    @State private var cancellable: AnyCancellable?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if env.selectedTeam == nil {
                ContentUnavailableView("Pick a team in Favorites", systemImage: "bolt.heart")
            } else {
                List(Array(events.enumerated()), id: \.offset) { _, event in
                    switch event {
                    case .injury(let text): Label(text, systemImage: "cross.case.fill")
                    case .insiderNote(let text): Label(text, systemImage: "person.text.rectangle")
                    case .weather(let text): Label(text, systemImage: "cloud.sun.fill")
                    }
                }
                .listStyle(.insetGrouped)
            }
        }
        .navigationTitle("Team Pulse")
        .onAppear(attach)
        .onChange(of: env.selectedTeam) { _ in attach() }
    }

    private func attach() {
        cancellable = nil
        guard let id = env.selectedTeam?.id else { events = []; return }
        cancellable = env.apiRepository.teamPulseStream(teamId: id)
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { _ in }, receiveValue: { ev in
                events.insert(ev, at: 0)
                events = Array(events.prefix(50))
            })
    }
}

struct TeamPulseView_Previews: PreviewProvider {
    static var previews: some View { TeamPulseView().environmentObject(AppEnvironment()) }
}