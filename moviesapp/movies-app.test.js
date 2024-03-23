const { By, Builder, Browser, until, Key } = require("selenium-webdriver");

// Build a new driver to be used on all tests
beforeAll(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

// Make sure to tell selenium that it no longer needs to automate
afterAll(async () => {
  await driver.quit();
});

describe("moviesapp", () => {
  test("Can navigate to the app page", async () => {
    // Use the driver to load the application
    // The application needs to be running, both server and client (if any). ie 'nodemon server', 'live-server client'
    await driver.get("http://127.0.0.1:8080/");

    // Wait 1 second for the page to load then look for the title element in HTML and make sure it matches whats expected
    await driver.wait(until.titleIs("Movies List"), 1000);
  });

  test("Can submit a movie name", async () => {
    const movieTitle = "Matrix";

    // Use the driver to enter a movie title and simulate pushing the 'Enter/Return' key on a keyboard
    await driver
      .findElement(By.name("movieTitle"))
      .sendKeys(movieTitle, Key.RETURN);

    // Wait for the driver to find the element in the application
    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), '${movieTitle}')]`)),
      1000
    );
  });

  test("Can delete a movie name from the list", async () => {
    const deleteBtn = driver.findElement(By.className("delete-btn"));
    await deleteBtn.click();
    await driver.sleep(1000);

    try {
      // Wait for the element with the text "Matrix deleted!" to be located (which should exist)
      await driver.wait(
        until.elementLocated(
          By.xpath(`//*[contains(text(), 'Matrix deleted!')]`)
        ),
        1000
      );
    } catch (error) {
      // TimeoutError is thrown if the element is not found, which should not happen.
      // without the below assertion, this test would pass even if the driver could not find 'Matrix deleted!'
      expect(error.name).not.toBe("TimeoutError");
    }
  });
});
