import SwiftUI

struct OddsAnalyzerView: View {
    @EnvironmentObject private var env: AppEnvironment
    @State private var trends: TeamTrends? = nil

    var body: some View {
        ScrollView {
            if let t = trends {
                VStack(spacing: 16) {
                    Gauge(value: t.atsCoverRate) {
                        Text("ATS Cover Rate")
                    }
                    .gaugeStyle(.accessoryCircularCapacity)
                    .tint(.green)
                    .frame(height: 120)

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Over Rate: \(Int(t.overRate * 100))%")
                        Text("Under Rate: \(Int(t.underRate * 100))%")
                        Text("Last 10: \(t.last10Record)")
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
                }
                .padding()
            } else {
                ContentUnavailableView("Pick a team in Favorites", systemImage: "star")
            }
        }
        .navigationTitle("Odds Analyzer")
        .onChange(of: env.selectedTeam) { _ in load() }
        .onAppear { load() }
    }

    private func load() {
        guard let id = env.selectedTeam?.id else { trends = nil; return }
        _ = env.apiRepository.trends(for: id).replaceError(with: TeamTrends(atsCoverRate: 0.5, overRate: 0.5, underRate: 0.5, last10Record: "5-5")).sink { trends = $0 }
    }
}

struct OddsAnalyzerView_Previews: PreviewProvider {
    static var previews: some View { OddsAnalyzerView().environmentObject(AppEnvironment()) }
}