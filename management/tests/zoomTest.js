import { Builder, By, until } from 'selenium-webdriver';

(async function testZoomFeature() {
    // Setup drivers
    let driver1 = await new Builder().forBrowser('chrome').build(); // User A (Admin)
    let driver2 = await new Builder().forBrowser('chrome').build(); // User B (Client)

    try {
        const roomId = 'test-room-' + Date.now();
        const baseUrl = 'https://www.dhanvij-builders.online'; // Production URL

        // ---- USER A (Admin) ----
        console.log("User A (Admin) joining...");
        await driver1.get(`${baseUrl}/video-room/${roomId}?name=UserA&role=admin`);
        
        // Wait for page load and open participants panel
        await driver1.wait(until.elementLocated(By.id('participantsBtn')), 10000);
        await driver1.findElement(By.id('participantsBtn')).click();
        console.log("User A opened participants panel.");

        // ---- USER B (Client) ----
        console.log("User B (Client) joining...");
        await driver2.get(`${baseUrl}/video-room/${roomId}?name=UserB`);
        
        // Wait for page load and open participants panel
        await driver2.wait(until.elementLocated(By.id('participantsBtn')), 10000);
        await driver2.findElement(By.id('participantsBtn')).click();
        console.log("User B opened participants panel.");

        // ---- VALIDATION ----
        console.log("Validating real-time participant list sync...");
        
        // Wait until User A sees User B in the list
        await driver1.wait(until.elementLocated(By.id('participant-UserB')), 15000);
        console.log("User A now sees User B.");

        // Wait until User B sees User A in the list
        await driver2.wait(until.elementLocated(By.id('participant-UserA')), 15000);
        console.log("User B now sees User A.");

        console.log("✅ Real-time participant sync verified successfully!");

        // Test the Join button
        console.log("Testing Join button...");
        await driver1.findElement(By.id('joinBtn')).click();
        console.log("✅ User A clicked Join successfully.");

    } catch (err) {
        console.log("❌ Test Failed:", err);
    } finally {
        console.log("Closing browsers...");
        await driver1.quit();
        await driver2.quit();
    }
})();
