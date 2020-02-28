const puppeteer = require("puppeteer");
var fs = require("fs");

const enrolledSelector = "#prof_stat > div > h3";
const registeredSelector = "#regi_stat > div > h3";
const goldSelector =
  "#ctype > div.row.certificate_type_count > div > div:nth-child(1) > div > div.panel-body > p";
const silverSelector =
  "#ctype > div.row.certificate_type_count > div > div:nth-child(2) > div > div.panel-body > p";
const eliteSelector =
  "#ctype > div.row.certificate_type_count > div > div:nth-child(3) > div > div.panel-body > p";
const successfullyCompletedSelector =
  "#ctype > div.row.certificate_type_count > div > div:nth-child(4) > div > div.panel-body > p";
const participationSelector =
  "#ctype > div.row.certificate_type_count > div > div:nth-child(5) > div > div.panel-body > p";
const certifiedSelector =
  "#ctype > div.row.tabs-three_row > div > div:nth-child(3) > div > div.panel-body > p";
const youtubeLinkSelector =
  "#about-course > div:nth-child(2) > div.col-sm-3.left_nave > div > h5:nth-child(3) > a";

const getElementForSelector = async (page, selector) => {
  return (await page.$(selector)) || undefined;
};

async function getNumberStats(page, selector) {
  const elementForSelector = await getElementForSelector(page, selector);

  try {
    if (elementForSelector)
      return (
        (await elementForSelector.evaluate(element => {
          return element.innerText;
        })) || ""
      );
  } catch {
    return "";
  }

  // return await page.evaluate(selector => {
  //   return document.querySelector(selector).innerText.replace(/^\D+/g, "");
  // }, selector);
}

async function getHref(page, selector) {
  return await page.evaluate(selector => {
    return document.querySelector(selector).href;
  }, selector);
}

async function getInnerText(page, selector) {
  const elementForSelector = await getElementForSelector(page, selector);
  try {
    if (elementForSelector)
      return (
        (await elementForSelector.evaluate(element => {
          return element.innerText;
        })) || ""
      );
  } catch {
    return "";
  }
}

var allCourses = [
  {
    courseName: "A Brief Course On Superconductivity",
    smeName: "Prof. Saurabh Basu",
    institute: "IIT Guwahati",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ph04"
  },
  {
    courseName:
      "A Short Lecture Series On Contour Integration In The Complex Plane",
    smeName: "Prof. Venkata Sonti",
    institute: "IISc Bangalore",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me75"
  },
  {
    courseName:
      "A Study Guide In Organic Retrosynthesis: Problem Solving Approach",
    smeName: "Prof. Samik Nanda",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cy03"
  },
  {
    courseName: "Accreditation And Outcome Based Learning",
    smeName: "Prof. AK Ray (Retd. ) And Prof. SK Das Mandal",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ge18"
  },
  {
    courseName: "Acoustic And Noise Control",
    smeName: "Prof. Abijith Sarkar",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-me32"
  },
  {
    courseName: "Acoustics",
    smeName: "Prof. Nachiketa Tiwari",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-me04"
  },
  {
    courseName: "Adiabatic Two Phase Flow And Flow Boiling In Microchannel",
    smeName: "Prof. Gargi Das",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Sep-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ch08"
  },
  {
    courseName: "Advance Aircraft Maintenance",
    smeName: "Prof. �A. K Ghosh, Prof. �Vipul Mathur",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ae02"
  },
  {
    courseName: "Advance Power Electronics And Control",
    smeName: "Prof. Avik Bhattacharya",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee15"
  },
  {
    courseName: "Advanced Chemical Thermodynamics And Kinetics",
    smeName: "Prof. Arijit Kumar De",
    institute: "IISER Mohali",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cy20"
  },
  {
    courseName: "Advanced Composites",
    smeName: "Prof. Nachiketa Tiwari",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me58"
  },
  {
    courseName: "Advanced Computer Architecture",
    smeName: "Prof. John Jose",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs62"
  },
  {
    courseName: "Advanced Concepts In Fluid Mechanics",
    smeName: "Prof. Suman Chakraborty, Prof. Aditya Bandopadhyay",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me53"
  },
  {
    courseName: "Advanced Concrete Technology",
    smeName: "Prof. Manu Santhanam",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce21"
  },
  {
    courseName: "Advanced Concrete Technology",
    smeName: "Prof. Manu Santhanam",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce44"
  },
  {
    courseName: "Advanced Condensed Matter Physics",
    smeName: "Prof. Saurabh Basu",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ph03"
  },
  {
    courseName: "Advanced Engineering Mathematics",
    smeName: "Prof. P. N. Agrawal",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ma11"
  },
  {
    courseName: "Advanced Fluid Mechanics",
    smeName: "Prof. Suman Chakraborty",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me10"
  },
  {
    courseName: "Advanced Graph Theory",
    smeName: "Prof. Rajiv Misra",
    institute: "IIT Patna",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs04"
  },
  {
    courseName: "Advanced Green Manufacturing Systems",
    smeName: "Prof. Deepu Philip, Prof. Amandeep Singh",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg24"
  }
];

var finalCourses = [];
(async function() {
  for (var p = 0; p < allCourses.length; p++) {
    (async () => {
      var initialCourseObj = allCourses[p];
      const nptelURL = initialCourseObj.courseLink;

      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      const navigationPromise = page.waitForNavigation();

      await page.goto(nptelURL);
      await page.evaluate(_ => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.waitFor(2000);
      await navigationPromise;

      // await page.waitForSelector(enrolledSelector);
      // await page.waitForSelector(registeredSelector);
      // await page.waitForSelector(youtubeLinkSelector);
      // await page.waitForSelector(certifiedSelector);
      // await page.waitForSelector(goldSelector);
      // await page.waitForSelector(silverSelector);
      // await page.waitForSelector(eliteSelector);
      // await page.waitForSelector(successfullyCompletedSelector);
      // await page.waitForSelector(participationSelector);

      const totalEnrollment = await getNumberStats(page, enrolledSelector);
      const totalRegistration = await getNumberStats(page, registeredSelector);
      const totalCertified = await getNumberStats(page, certifiedSelector);
      const youtubeLink = await getHref(page, youtubeLinkSelector);
      // const gold = await getNumberStats(page, goldSelector);
      // const silver = await getNumberStats(page, silverSelector);
      // const elite = await getNumberStats(page, eliteSelector);
      // const successfullyCompleted = await getNumberStats(
      //   page,
      //   successfullyCompletedSelector
      // );
      // const participation = await getNumberStats(page, participationSelector);
      // const certifiedCategoryCount = {
      //   gold,
      //   silver,
      //   elite,
      //   successfullyCompleted,
      //   participation
      // };
      const certificateStatsTableSelector =
        "#ctype > div.row.certificate_type_count > div";

      const certificateStatsLength = await page.$eval(
        certificateStatsTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );
      let certifiedCategoryCount = {};
      certifiedCategoryCount["Gold"] = 0;
      certifiedCategoryCount["Silver"] = 0;
      certifiedCategoryCount["Elite"] = 0;
      certifiedCategoryCount["Successfully completed"] = 0;
      certifiedCategoryCount["Participation"] = 0;

      for (var i = 1; i <= certificateStatsLength; i++) {
        const category = await getInnerText(
          page,
          `#ctype > div.row.certificate_type_count > div > div:nth-child(${i}) > div > div.panel-heading > h4`
        );
        const noCertified = await getInnerText(
          page,
          `#ctype > div.row.certificate_type_count > div > div:nth-child(${i}) > div > div.panel-body > p`
        );

        certifiedCategoryCount[category] = noCertified;
      }

      console.log("totalEnrollment =", totalEnrollment);
      console.log("totalRegistration =", totalRegistration);
      console.log("youtubeLink=", youtubeLink);
      const enrollmentTableSelector =
        "#role > div > div:nth-child(1) > div > div > table > tbody";

      const enrollmentStatsLength = await page.$eval(
        enrollmentTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(enrollmentStatsLength);

      let enrollmentStats = {};

      for (var i = 1; i <= enrollmentStatsLength; i++) {
        const role = await getInnerText(
          page,
          `#role > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const noEnrolled = await getInnerText(
          page,
          `#role > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        enrollmentStats[role] = noEnrolled;
      }

      console.log(enrollmentStats);

      const registrationTableSelector =
        "#piechart1 > div > div:nth-child(1) > div > div > table > tbody  ";

      const registrationStatsLength = await page.$eval(
        registrationTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(registrationStatsLength);

      let registrationStats = {};

      for (var i = 1; i <= registrationStatsLength; i++) {
        const role = await getInnerText(
          page,
          `#piechart1 > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const noEnrolled = await getInnerText(
          page,
          `#piechart1 > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        registrationStats[role] = noEnrolled;
      }

      console.log(registrationStats);

      const genderTableSelector =
        "#gender > div > div:nth-child(1) > div > div > table > tbody  ";

      const genderStatsLength = await page.$eval(
        genderTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(genderStatsLength);

      let genderStats = {};

      for (var i = 1; i <= genderStatsLength; i++) {
        const role = await getInnerText(
          page,
          `#gender > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const noEnrolled = await getInnerText(
          page,
          `#gender > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        genderStats[role] = noEnrolled;
      }

      console.log(genderStats);

      const reasonTableSelector =
        "#feed_back > div > div:nth-child(1) > div > div > table > tbody ";

      const reasonStatsLength = await page.$eval(
        reasonTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(reasonStatsLength);

      let reasonStats = {};

      for (var i = 1; i <= reasonStatsLength; i++) {
        const reason = await getInnerText(
          page,
          `#feed_back > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const noEnrolled = await getInnerText(
          page,
          `#feed_back > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        reasonStats[reason] = noEnrolled;
      }

      console.log(reasonStats);

      const assignmentScoreTableSelector =
        "#avg_score > div > div:nth-child(1) > div > div > table > tbody ";

      const assignmentScoreStatsLength = await page.$eval(
        assignmentScoreTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(assignmentScoreStatsLength);

      let assignmentScoreStats = {};

      for (var i = 1; i <= assignmentScoreStatsLength; i++) {
        const assignmentName = await getInnerText(
          page,
          `#avg_score > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const assignmentScore = await getInnerText(
          page,
          `#avg_score > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        assignmentScoreStats[assignmentName] = assignmentScore;
      }

      console.log(assignmentScoreStats);

      const assignmentSubmissionsTableSelector =
        "#avg_score > div > div:nth-child(1) > div > div > table > tbody ";

      const assignmentSubmissionsStatsLength = await page.$eval(
        assignmentSubmissionsTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(assignmentSubmissionsStatsLength);

      let assignmentSubmissionsStats = {};

      for (var i = 1; i <= assignmentSubmissionsStatsLength; i++) {
        const assignmentName = await getInnerText(
          page,
          `#falling_chart > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const assignmentSubmissions = await getInnerText(
          page,
          `#falling_chart > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        assignmentSubmissionsStats[assignmentName] = assignmentSubmissions;
      }

      console.log(assignmentSubmissionsStats);

      const enrollmentStateTableSelector =
        "#state > div > div:nth-child(1) > div > div > table > tbody";

      try {
        const enrollmentStateStatsLength = await page.$eval(
          enrollmentStateTableSelector,
          uiElement => {
            return uiElement.children.length;
          }
        );
      } catch {
        continue;
      }

      console.log(enrollmentStateStatsLength);

      let enrollmentStateStats = {};

      for (var i = 1; i <= enrollmentStateStatsLength; i++) {
        const enrollmentState = await getInnerText(
          page,
          `#state > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const enrollmentCount = await getInnerText(
          page,
          `#state > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        enrollmentStateStats[enrollmentState] = enrollmentCount;
      }

      console.log(enrollmentStateStats);

      const enrollmentAgeTableSelector =
        "#age_range > div > div:nth-child(1) > div > div > table > tbody";

      const enrollmentAgeStatsLength = await page.$eval(
        enrollmentAgeTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(enrollmentAgeStatsLength);

      let enrollmentAgeStats = {};

      for (var i = 1; i <= enrollmentAgeStatsLength; i++) {
        const enrollmentAgeGroup = await getInnerText(
          page,
          `#age_range > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const enrollmentCount = await getInnerText(
          page,
          `#age_range > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        enrollmentAgeStats[enrollmentAgeGroup] = enrollmentCount;
      }

      console.log(enrollmentAgeStats);

      const enrollmentCountryTableSelector =
        "#conrty_div > div > div:nth-child(1) > div > div > table > tbody";

      const enrollmentCountryStatsLength = await page.$eval(
        enrollmentCountryTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(enrollmentCountryStatsLength);

      let enrollmentCountryStats = {};

      for (var i = 1; i <= enrollmentCountryStatsLength; i++) {
        const enrollmentCountry = await getInnerText(
          page,
          `#conrty_div > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const enrollmentCount = await getInnerText(
          page,
          `#conrty_div > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        enrollmentCountryStats[enrollmentCountry] = enrollmentCount;
      }

      console.log(enrollmentCountryStats);

      const registrationStateTableSelector =
        "#state_div > div > div:nth-child(1) > div > div > table > tbody";

      const registrationStateStatsLength = await page.$eval(
        registrationStateTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(registrationStateStatsLength);

      let registrationStateStats = {};

      for (var i = 1; i <= registrationStateStatsLength; i++) {
        const registrationState = await getInnerText(
          page,
          `#state_div > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const registrationCount = await getInnerText(
          page,
          `#state_div > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        registrationStateStats[registrationState] = registrationCount;
      }

      console.log(registrationStateStats);

      const registrationChapterTableSelector =
        "#clg_details > div > div:nth-child(1) > div > div > table > tbody";

      const registrationChapterStatsLength = await page.$eval(
        registrationChapterTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(registrationChapterStatsLength);

      let registrationChapterStats = {};

      for (var i = 1; i <= registrationChapterStatsLength; i++) {
        const registrationChapter = await getInnerText(
          page,
          `#clg_details > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const registrationCount = await getInnerText(
          page,
          `#clg_details > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        registrationChapterStats[registrationChapter] = registrationCount;
      }

      console.log(registrationChapterStats);

      // const weeklyScoreDistributionTableSelector = "#content ";

      // const weeklyScoreDistributionStatsLength = await page.$eval(
      //   weeklyScoreDistributionTableSelector,
      //   uiElement => {
      //     return uiElement.children.length;
      //   }
      // );

      // console.log(weeklyScoreDistributionStatsLength);

      // let weeklyScoreDistributionStats = {};

      // for (var i = 2; i < weeklyScoreDistributionStatsLength; i++) {
      //   const tableSelector = `#tab${i -
      //     1} > div > div:nth-child(1) > div > div > table > tbody`;
      //   const tableLength = await page.$eval(tableSelector, uiElement => {
      //     return uiElement.children.length;
      //   });

      //   let weeklyStats = {};

      //   for (var j = 1; j <= tableLength; j++) {
      //     const markRange = await getInnerText(
      //       page,
      //       `#tab${i -
      //         1} > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${j}) > td:nth-child(1)`
      //     );
      //     const totalCount = await getInnerText(
      //       page,
      //       `#tab${i -
      //         1} > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${j}) > td:nth-child(2)`
      //     );

      //     weeklyStats[markRange] = totalCount;
      //   }
      //   weeklyScoreDistributionStats[`Week${i - 1}`] = weeklyStats;
      // }

      // console.log(weeklyScoreDistributionStats);

      const assignmentScoreDistributionTableSelector =
        "#assignment > div > div:nth-child(1) > div > div > table > tbody";

      const assignmentScoreDistributionStatsLength = await page.$eval(
        assignmentScoreDistributionTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(assignmentScoreDistributionStatsLength);

      let assignmentScoreDistributionStats = {};

      for (var i = 1; i <= assignmentScoreDistributionStatsLength; i++) {
        const assignmentScoreDistribution = await getInnerText(
          page,
          `#assignment > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const studentCount = await getInnerText(
          page,
          `#assignment > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        assignmentScoreDistributionStats[
          assignmentScoreDistribution
        ] = studentCount;
      }

      console.log(assignmentScoreDistributionStats);

      const examScoreDistributionTableSelector =
        "#exam > div > div:nth-child(1) > div > div > table > tbody";

      const examScoreDistributionStatsLength = await page.$eval(
        examScoreDistributionTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(examScoreDistributionStatsLength);

      let examScoreDistributionStats = {};

      for (var i = 1; i <= examScoreDistributionStatsLength; i++) {
        const examScoreDistribution = await getInnerText(
          page,
          `#exam > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const studentCount = await getInnerText(
          page,
          `#exam > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        examScoreDistributionStats[examScoreDistribution] = studentCount;
      }

      console.log(examScoreDistributionStats);

      const finalScoreDistributionTableSelector =
        "#scoree > div > div:nth-child(1) > div > div > table > tbody";

      const finalScoreDistributionStatsLength = await page.$eval(
        finalScoreDistributionTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      console.log(finalScoreDistributionStatsLength);

      let finalScoreDistributionStats = {};

      for (var i = 1; i <= finalScoreDistributionStatsLength; i++) {
        const finalScoreDistribution = await getInnerText(
          page,
          `#scoree > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`
        );
        const studentCount = await getInnerText(
          page,
          `#scoree > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
        );

        finalScoreDistributionStats[finalScoreDistribution] = studentCount;
      }

      console.log(finalScoreDistributionStats);

      const obj = {
        totalEnrollment,
        totalRegistration,
        totalCertified,
        certifiedCategoryCount,
        youtubeLink,
        enrollmentStats,
        registrationStats,
        genderStats,
        reasonForTakingCourse: reasonStats,
        assignmentScoreStats,
        assignmentSubmissionsStats,
        //weeklyScoreDistributionStats,
        enrollmentStateStats,
        enrollmentAgeStats,
        enrollmentCountryStats,
        registrationStateStats,
        registrationChapterStats,
        assignmentScoreDistributionStats,
        examScoreDistributionStats,
        finalScoreDistributionStats
      };

      initialCourseObj = { ...initialCourseObj, ...obj };

      // fs.writeFile("./sample3.json", JSON.stringify(obj), function(err) {
      //   if (err) {
      //     console.error("error");
      //   }
      // });
      finalCourses.push(initialCourseObj);
      fs.writeFile("./sample4.json", JSON.stringify(finalCourses), function(
        err
      ) {
        if (err) {
          console.error("error");
        }
      });

      await browser.close();
    })();
  }
})();
