const puppeteer = require("puppeteer");
var fs = require("fs");

const allCourses = [];

const enrolledSelector = "#prof_stat > div > h3";
const registeredSelector = "#regi_stat > div > h3";
async function getNumberStats(page, selector) {
  return await page.evaluate(selector => {
    return document.querySelector(selector).innerText.replace(/^\D+/g, "");
  }, selector);
}

async function getInnerText(page, selector) {
  return await page.evaluate(selector => {
    return document.querySelector(selector).innerText;
  }, selector);
}

async function getHref(page, selector) {
  return await page.evaluate(selector => {
    return document.querySelector(selector).href;
  }, selector);
}

const courseTableSelector = "#example2 > tbody";
async function getTableChildren(page, selector) {
  return await page.evaluate(selector => {
    return document.querySelector(selector).children;
  }, selector);
}

// //NO OF SUBMISSIONS TABLE
// document.querySelector(
//   "#falling_chart > div > div:nth-child(1) > div > div > table"
// );

// //AVERAGE ASSIGNMENT SCORE
// document.querySelector(
//   "#avg_score > div > div:nth-child(1) > div > div > table"
// );

// //NO OF MALES &FEMALES (REGISTERED)
// document.querySelector("#gender > div > div:nth-child(1) > div > div > table");

// //PROFESSION STUDENT, FACULTY , OTHER (REGISTERED)
// document.querySelector(
//   "#piechart1 > div > div:nth-child(1) > div > div > table"
// );

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const navigationPromise = page.waitForNavigation();

  await page.goto("https://nptel.ac.in/noc/noc_courselist.html#completed");
  await page.evaluate(_ => {
    window.scrollBy(0, window.innerHeight);
  });
  await page.waitFor(2000);
  await navigationPromise;

  //   await page.waitForSelector(enrolledSelector);
  //   await page.waitForSelector(registeredSelector);

  //   const totalEnrollment = await getNumberStats(page, enrolledSelector);
  //   const totalRegistration = await getNumberStats(page, registeredSelector);

  //   console.log("totalEnrollment =", totalEnrollment);
  //   console.log("totalRegistration =", totalRegistration);

  const noOfPages = await getInnerText(
    page,
    "#example2_paginate > span > a:nth-child(7)"
  );
  console.log(noOfPages);

  const nextButtonSelector = "#example2_next";

  for (var i = 1; i <= noOfPages; i++) {
    await page.waitForSelector(courseTableSelector);

    await page.waitFor(100);

    const noOfCourses = await page.$eval(courseTableSelector, uiElement => {
      return uiElement.children.length;
    });

    for (var index = 1; index <= noOfCourses; index++) {
      const courseName = await getInnerText(
        page,
        `#example2 > tbody > tr:nth-child(${index}) > td:nth-child(1)`
      );
      const smeName = await getInnerText(
        page,
        `#example2 > tbody > tr:nth-child(${index}) > td:nth-child(2)`
      );
      const institute = await getInnerText(
        page,
        `#example2 > tbody > tr:nth-child(${index}) > td:nth-child(3)`
      );
      const courseDuration = await getInnerText(
        page,
        `#example2 > tbody > tr:nth-child(${index}) > td:nth-child(4)`
      );
      const timeline = await getInnerText(
        page,
        `#example2 > tbody > tr:nth-child(${index}) > td:nth-child(5)`
      );
      const courseLink = await getHref(
        page,
        `#example2 > tbody > tr:nth-child(${index}) > td:nth-child(6) > a`
      );
      const courseObj = {
        courseName,
        smeName,
        institute,
        courseDuration,
        timeline,
        courseLink
      };
      console.log(courseObj);
      allCourses.push(courseObj);
    }

    await page.click(nextButtonSelector);
  }

  fs.writeFile("./rest700.json", JSON.stringify(allCourses), function(err) {
    if (err) {
      console.error("error");
    }
  });

  await browser.close();
})();
