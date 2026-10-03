import XCTest

final class StoreScreenshots: XCTestCase {
    func capture(_ name: String) {
        let attachment = XCTAttachment(screenshot: XCUIApplication().screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    func testStoreScreenshots() {
        continueAfterFailure = false
        let app = XCUIApplication()
        app.launch()
        let start = app.buttons["ابدأ التحدّي"]
        XCTAssertTrue(start.waitForExistence(timeout: 30))
        capture("01-home")
        start.tap()
        let categories = app.buttons["اختيار الفئات"]
        XCTAssertTrue(categories.waitForExistence(timeout: 10))
        capture("02-setup")
        categories.tap()
        let math = app.buttons.matching(NSPredicate(format: "label CONTAINS %@", "رياضيات وذكاء")).firstMatch
        XCTAssertTrue(math.waitForExistence(timeout: 10))
        capture("03-categories")
        math.tap()
        let play = app.buttons["ابدأ التحدّي 🔥"]
        XCTAssertTrue(play.waitForExistence(timeout: 10))
        play.tap()
        let help = app.buttons["🛟 مساعدة: 3 خيارات"]
        XCTAssertTrue(help.waitForExistence(timeout: 10))
        capture("04-question")
        help.tap()
        let choice = app.buttons.matching(NSPredicate(format: "label BEGINSWITH %@", "أ.")).firstMatch
        XCTAssertTrue(choice.waitForExistence(timeout: 10))
        capture("05-help")
    }
}
