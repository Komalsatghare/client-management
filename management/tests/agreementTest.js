import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

(async function testAgreementFeature() {
    const options = new chrome.Options();
    // options.addArguments('--headless'); // Uncomment for headless mode

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const baseUrl = 'https://www.dhanvij-builders.online';
    const credentials = {
        email: 'swapnildhanvij@gmail.com',
        password: 'swapnil@60+'
    };

    try {
        console.log("Starting Agreement Test...");

        // 1. LOGIN
        await driver.get(`${baseUrl}/login`);
        await driver.manage().window().maximize();

        console.log("Logging in as Admin...");
        // Wait for page load
        await driver.wait(until.elementLocated(By.tagName('input')), 10000);
        
        // Try finding by various common selectors to be robust
        let emailInput;
        try {
            emailInput = await driver.findElement(By.id('username'));
        } catch (e) {
            try {
                emailInput = await driver.findElement(By.id('email'));
            } catch (e2) {
                emailInput = await driver.findElement(By.css('input[type="text"], input[type="email"]'));
            }
        }
        
        await emailInput.sendKeys(credentials.email);
        
        const passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys(credentials.password);
        
        const loginBtn = await driver.findElement(By.css('button[type="submit"]'));
        await loginBtn.click();

        // Wait for dashboard to load
        await driver.wait(until.urlContains('dashboard'), 15000); // 15s for Render cold start
        console.log("✅ Logged in successfully.");

        // 2. NAVIGATE TO AGREEMENTS
        console.log("Navigating to Agreements section...");
        await driver.wait(until.elementLocated(By.className('sidebar-link')), 10000);
        const sidebarLinks = await driver.findElements(By.className('sidebar-link'));
        let foundAgreements = false;
        for (let link of sidebarLinks) {
            const text = await link.getText();
            if (text.includes('Agreements') || text.includes('पत्रा')) { 
                await driver.executeScript("arguments[0].click();", link); // Use JS click for reliability
                foundAgreements = true;
                break;
            }
        }

        if (!foundAgreements) {
            throw new Error("Could not find 'Agreements' link in sidebar.");
        }

        // Wait for Agreements section to load
        await driver.wait(until.elementLocated(By.id('initiateDraftBtn')), 10000);
        console.log("✅ Navigated to Agreements section.");

        // 3. CREATE DIGITAL CONTRACT
        console.log("Initiating a new Digital Contract...");
        const testProjectName = `Selenium Test ${Math.floor(Math.random() * 10000)}`;
        
        await driver.wait(until.elementLocated(By.id('agreementProjectTitle')), 10000);
        await driver.findElement(By.id('agreementProjectTitle')).sendKeys(testProjectName);
        await driver.findElement(By.id('agreementClientName')).sendKeys('Selenium Client');
        await driver.findElement(By.id('agreementContractorName')).sendKeys('Selenium Contractor');
        
        // Select first client if Admin
        try {
            const clientSelect = await driver.findElement(By.css('.ua-input select, select'));
            const options_select = await clientSelect.findElements(By.tagName('option'));
            if (options_select.length > 1) {
                await options_select[1].click();
            }
        } catch (e) {
            console.log("No client selection found/needed.");
        }

        const submitBtn = await driver.findElement(By.id('initiateDraftBtn'));
        await driver.executeScript("arguments[0].scrollIntoView();", submitBtn);
        await submitBtn.click();

        console.log("✅ Digital contract initiated.");
        await driver.sleep(4000); // Wait for list refresh

        // 4. OPEN WORKSPACE
        console.log("Searching for the contract in list...");
        // Re-find list items
        await driver.wait(until.elementLocated(By.className('ua-item')), 10000);
        const openBtn = await driver.wait(until.elementLocated(By.xpath(`//p[contains(text(),'${testProjectName}')]/../..//button[contains(@id, 'open-workspace')]`)), 10000);
        await driver.executeScript("arguments[0].scrollIntoView();", openBtn);
        await driver.executeScript("arguments[0].click();", openBtn);
        console.log("✅ Workspace opened.");

        // 5. TEST EDITING
        await driver.wait(until.elementLocated(By.id('editAgreementBtn')), 10000);
        await driver.findElement(By.id('editAgreementBtn')).click();
        
        const editor = await driver.findElement(By.id('dhanvij-word-editor'));
        await editor.click();
        
        console.log("Typing English text...");
        await driver.executeScript("arguments[0].innerHTML = '';", editor);
        await editor.sendKeys("Automated English content.");
        
        console.log("Switching to Marathi...");
        const toggleMrBtn = await driver.findElement(By.id('toggleMrBtn'));
        await toggleMrBtn.click();
        await driver.sleep(500);
        
        console.log("Typing Marathi (Transliteration test)...");
        await editor.sendKeys(Key.ENTER, "Namaste ");
        console.log("✅ Typed Marathi text.");

        // 6. SAVE
        const saveBtn = await driver.findElement(By.id('saveAgreementBtn'));
        await driver.executeScript("arguments[0].scrollIntoView();", saveBtn);
        await saveBtn.click();

        // Handle alert
        await driver.wait(until.alertIsPresent(), 10000);
        const alert = await driver.switchTo().alert();
        await alert.accept();
        console.log("✅ Changes saved.");

        // 7. FINAL VERIFICATION
        await driver.sleep(2000);
        const finalContent = await driver.findElement(By.className('agreement-preview')).getText();
        if (finalContent.includes("Automated") || finalContent.includes("Namaste")) {
            console.log("🏁🏁 SUCCESS: Agreement section verified successfully! 🏁🏁");
        } else {
            console.log("❌ Content verification failed.");
        }

    } catch (error) {
        console.error("❌ Test Failed Error:", error);
    } finally {
        console.log("Closing browser...");
        await driver.quit();
    }
})();
