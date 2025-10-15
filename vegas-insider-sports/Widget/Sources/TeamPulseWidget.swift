import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry { SimpleEntry(date: Date(), summary: "No team selected") }
    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        completion(SimpleEntry(date: Date(), summary: "Team Pulse"))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
        let entry = SimpleEntry(date: Date(), summary: "Injury: Probable - Star Player")
        completion(Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(900))))
    }
}

struct SimpleEntry: TimelineEntry { let date: Date; let summary: String }

struct TeamPulseWidgetEntryView : View {
    var entry: Provider.Entry
    var body: some View {
        ZStack {
            ContainerRelativeShape().fill(.black.opacity(0.9))
            VStack(alignment: .leading) {
                HStack {
                    Image(systemName: "bolt.heart.fill").foregroundStyle(.yellow)
                    Text("Team Pulse").font(.headline).foregroundStyle(.white)
                }
                Text(entry.summary).font(.subheadline).foregroundStyle(.white.opacity(0.85))
            }
            .padding()
        }
    }
}

@main
struct TeamPulseWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "TeamPulseWidget", provider: Provider()) { entry in
            TeamPulseWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Team Pulse")
        .description("Live injuries, insider notes, weather.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}