# iOS — تحدّي الجَمعة
SwiftUI + WKWebView, bundled offline game and audio, native haptics, local settings, privacy/support pages and approved icon. iOS 16+, iPhone/iPad.

## Build on a compatible Mac
```sh
brew install xcodegen
python3 ios/prepare_web.py
cd ios
xcodegen generate
open TahadiAlJamaa.xcodeproj
```
Select your Apple Developer Team in Signing & Capabilities. Confirm/register the bundle identifier (currently com.tahadi.aljamaa). Run on iPhone/iPad, then Product → Archive → Distribute App → App Store Connect.

The preparation script stages current game files into ios/Web and embeds audio in a JS resource to avoid fetching file URLs for Web Audio. Xcode's pre-build script refreshes these resources. Generated Web and xcodeproj files are ignored by git.

GitHub CI generates the project and builds for simulator without signing. Simulator builds cannot be uploaded to TestFlight. CI success does not prove device/audio/distribution behavior. Use an Xcode/iOS SDK accepted by Apple's current submission requirements; do not assume the user's older Mac supports it.

No enrolled Apple account, Team ID, signing, IPA or TestFlight upload exists yet. New support email is pending.
