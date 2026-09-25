# تحدّي الجَمعة — iOS

هذا المجلد يحتوي نسخة iOS أصلية خفيفة تستخدم SwiftUI + WKWebView وتحمّل اللعبة وملفات الصوت من داخل التطبيق، لذلك تعمل اللعبة دون اتصال بعد التثبيت.

## توليد مشروع Xcode

1. ثبّت Xcode و XcodeGen.
2. من Terminal:
   ```bash
   cd ios
   xcodegen generate
   open TahadiAlJamaa.xcodeproj
   ```
3. داخل Xcode اختر Apple Development Team.
4. غيّر Bundle Identifier قبل إنشاء سجل App Store إذا تم اعتماد اسم الشركة.
5. أضف App Icon النهائي بعد اعتماد هوية شركة الألعاب.
6. شغّل على iPhone حقيقي ثم Archive > Distribute App > App Store Connect.

## الموجود جاهز
- iOS 16+
- Offline bundled HTML/audio
- Native haptics للجمع/الخطأ/الاختيار
- LocalStorage لحفظ إعدادات وسجل الأسئلة
- Privacy manifest
- Safe-area mobile UI
- دعم iPhone و iPad

## المتبقي قبل الرفع
- Apple Developer Team / signing
- App Icon النهائي 1024×1024
- اسم الشركة وهوية الناشر النهائية
- لقطات App Store
- إنشاء App record في App Store Connect
