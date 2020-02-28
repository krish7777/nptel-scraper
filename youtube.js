const puppeteer = require("puppeteer");

async function getElText(page, selector) {
  return await page.evaluate(selector => {
    return document.querySelector(selector).innerText;
  }, selector);
}

async function getAriaLabel(page, selector) {
  return await page.evaluate(selector => {
    let data = document.querySelector(selector).ariaLabel;
    data = data.replace(",", "");
    data = data.replace("dislikes", "");
    data = data.replace("likes", "");
    return data;
  }, selector);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const navigationPromise = page.waitForNavigation();

  await page.goto("https://www.youtube.com/watch?v=Y3Ri2GdYfYg");
  await page.waitForSelector("h1.title");
  await page.evaluate(_ => {
    window.scrollBy(0, window.innerHeight);
  });
  await page.waitFor(2000);
  await page.waitForSelector("#comments");
  await navigationPromise;

  await page.waitForSelector(
    ".style-scope:nth-child(1) > #comment > #body > #main > #header > #header-author > #author-text > .style-scope"
  );
  const likeSelector = `#top-level-buttons > ytd-toggle-button-renderer:nth-child(1) > a #text`;
  const dislikeSelector = `#top-level-buttons > ytd-toggle-button-renderer:nth-child(2) > a #text`;
  await page.waitForSelector(likeSelector);
  await page.waitForSelector(dislikeSelector);

  const likes = await getAriaLabel(page, likeSelector);
  const dislikes = await getAriaLabel(page, dislikeSelector);

  console.log("likes =", likes);
  console.log("dislikes =", dislikes);

  const comments = [];
  for (let i = 1; i < 10; i++) {
    const authorSelector = `.style-scope:nth-child(${i}) > #comment > #body > #main > #header > #header-author > #author-text > .style-scope`;
    const commentSelector = `.style-scope:nth-child(${i}) > #comment > #body > #main > #expander #content-text`;
    await page.waitForSelector(commentSelector);
    await page.waitForSelector(authorSelector);
    const commentText = await getElText(page, commentSelector);
    const author = await getElText(page, authorSelector);

    if (commentText) {
      console.log(`${author}: ${commentText}\n`);
      comments.push(commentText);
    }
  }

  await browser.close();
})();
