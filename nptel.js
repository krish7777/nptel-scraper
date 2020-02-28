const puppeteer = require("puppeteer");
var fs = require("fs");

async function getYoutubeLink(page, selector) {
  return await page.evaluate(selector => {
    return document.querySelector(selector).src;
  }, selector);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const navigationPromise = page.waitForNavigation();

  await page.goto("https://nptel.ac.in/courses/106/106/106106182/");
  await page.waitForSelector("#ul_nav");
  await page.evaluate(_ => {
    window.scrollBy(0, window.innerHeight);
  });
  await page.waitFor(2000);

  await navigationPromise;

  const youtubelinks = [];

  const mainUlSelector = `#ul_nav`;
  await page.waitForSelector(mainUlSelector);
  const noOfWeeks = await page.$eval(mainUlSelector, uiElement => {
    return uiElement.children.length;
  });

  for (var i = 1; i < noOfWeeks; i++) {
    await page.waitFor(500);
    const ulSelector = `#ul_nav > li:nth-child(${i}) > ul`;
    await page.waitForSelector(ulSelector);
    const ulChildrenLength = await page.$eval(ulSelector, uiElement => {
      return uiElement.children.length;
    });
    console.log("i= " + i);

    if (i != 1) {
      let weekSelector = `#ul_nav > li:nth-child(${i - 1}) > a`;
      await page.waitForSelector(weekSelector);
      await page.click(weekSelector);
      weekSelector = `#ul_nav > li:nth-child(${i}) > a`;
      await page.waitForSelector(weekSelector);
      await page.click(weekSelector);
    }

    for (var j = 1; j <= ulChildrenLength; j++) {
      await page.waitFor(100);
      console.log("i= " + i + " j= " + j);
      const liSelector = `#ul_nav > li:nth-child(${i}) > ul > li:nth-child(${j})`;
      await page.waitForSelector(liSelector);

      await page.click(liSelector);

      const youtubeSelector = `#utubeframe`;
      await page.waitForSelector(youtubeSelector);
      const youtubeLink = await getYoutubeLink(page, youtubeSelector);
      console.log(youtubeLink);
      youtubelinks.push(youtubeLink);
      await page.click(youtubeSelector);
    }
  }

  const updatedLinks = youtubelinks.map(link =>
    link.replace("embed/", "watch?v=")
  );

  fs.writeFile("./trial.json", JSON.stringify(updatedLinks), function(err) {
    if (err) {
      console.error("crap");
    }
  });

  // write to file, save to db, etc.
  await browser.close();
})();
