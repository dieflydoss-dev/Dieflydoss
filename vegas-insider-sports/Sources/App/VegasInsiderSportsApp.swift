import SwiftUI

@main
struct VegasInsiderSportsApp: App {
    @StateObject private var appEnvironment = AppEnvironment()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(appEnvironment)
        }
    }
}
SWIFT
