const { By, Builder, Browser, until, Key } = require("selenium-webdriver");

// Build a new driver for each test
beforeAll(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

// Quit a driver after each test
// afterEach(async () => {
//   await driver.sleep(1000);
// });

afterAll(async () => {
  await driver.quit();
});

describe("moviesapp", () => {
  test("Can navigate to the app page", async () => {
    await driver.get("http://127.0.0.1:8080/");
    await driver.wait(until.titleIs("Movies List"), 1000);
  });

  test("Can submit a movie name", async () => {
    await driver
      .findElement(By.name("movieTitle"))
      .sendKeys(movietitle, Key.RETURN);

    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), 'Matrix')]`)),
      1000
    );
  });

  test("Can delete a movie name from the list", async () => {
    const deleteBtn = driver.findElement(By.className("delete-btn"));
    await deleteBtn.click();
    await driver.sleep(5000);

    try {
      // Wait for the element with the text "Matrix deleted!" to be located (which should exist)
      await driver.wait(
        until.elementLocated(
          By.xpath(`//*[contains(text(), 'Matrix deleted!')]`)
        ),
        1000
      );
    } catch (error) {
      expect(error.name).not.toBe("TimeoutError");
    }
  });
});
