import SwiftUI

struct StatCard: View {
    let title: String
    let value: String
    var color: Color = .blue

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.caption).foregroundStyle(.secondary)
            Text(value).font(.title2.bold())
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(color.opacity(0.1), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

struct StatCard_Previews: PreviewProvider {
    static var previews: some View {
        StatCard(title: "ATS Cover", value: "58%", color: .green)
    }
}