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
    courseName: "Introduction To Mechanobiology",
    smeName: "Prof. Shamik Sen",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-bt18"
  },
  {
    courseName: "Introduction To Mechanobiology",
    smeName: "Prof. Shamik Sen",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-bt24"
  },
  {
    courseName: "Introduction To Mechanobiology",
    smeName: "Prof. Shamik Sen",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-bt30"
  },
  {
    courseName: "Introduction To Methods Of Applied Mathematics",
    smeName: "Prof. Mani Mehra, Prof. Vivek Kumar Aggarwal",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma34"
  },
  {
    courseName: "Introduction To Mineral Processing",
    smeName: "Prof. Arun Kumar Majumder",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ce14"
  },
  {
    courseName: "Introduction To Modern Application Development",
    smeName: "Prof. Gaurav Raina, Tanmai Gopal",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Sep-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs23"
  },
  {
    courseName: "Introduction To Modern Application Development",
    smeName: "Prof. Gaurav Raina & Tanmai G",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-cs06"
  },
  {
    courseName: "Introduction To Modern Application Development",
    smeName: "Prof. Gaurav Raina",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs40"
  },
  {
    courseName: "Introduction To Modern Application Development",
    smeName: "Prof. Gaurav Raina, Tanmai Gopal",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs03"
  },
  {
    courseName: "Introduction To Modern Indian Drama",
    smeName: "Prof. Kiran Keshavamurthy",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs07"
  },
  {
    courseName: "Introduction To Modern Indian Political Thought",
    smeName: "Prof. Mithilesh Kumar Jha",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-hs40"
  },
  {
    courseName: "Introduction To Molecular Thermodynamics",
    smeName: "Prof. Srabani Taraphder",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cy05"
  },
  {
    courseName: "Introduction To Non-linear Optics And Its Applications",
    smeName: "Prof. Samudra Roy",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ph10"
  },
  {
    courseName: "Introduction To Nonlinear Dynamics",
    smeName: "Prof. Gaurav Raina",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Sep-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-ee03"
  },
  {
    courseName: "Introduction To Operating Systems",
    smeName: "Prof. Chester Rebeiro",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs10"
  },
  {
    courseName: "Introduction To Operating Systems",
    smeName: "Prof. Chester Robeiro",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs29"
  },
  {
    courseName: "Introduction To Operating Systems",
    smeName: "Prof. Chester Rebeiro",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs50"
  },
  {
    courseName: "Introduction To Operations Research",
    smeName: "Prof. G. Srinivasan",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15mg01"
  },
  {
    courseName: "Introduction To Operations Research",
    smeName: "Prof. G. Srinivasan",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mg10"
  },
  {
    courseName: "Introduction To Operations Research",
    smeName: "Prof. G. Srinivasan",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg41"
  },
  {
    courseName: "Introduction To Parallel Programming In Open MP",
    smeName: "Prof. Yogish Sabrawal",
    institute: "IIT Delhi",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs55"
  },
  {
    courseName: "Introduction To Parallel Programming In Open MP",
    smeName: "Prof. Yogish Sabharwal",
    institute: "IIT Delhi",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs45"
  },
  {
    courseName: "Introduction To Parallel Programming In OpenMP",
    smeName: "Prof. Yogish Sabharwal",
    institute: "IIT Delhi",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs39"
  },
  {
    courseName: "Introduction To Photonics",
    smeName: "Prof. Balaji Srinivasan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee20"
  },
  {
    courseName: "Introduction To Political Theory",
    smeName: "Prof. Mithilesh Kumar Jha",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs09"
  },
  {
    courseName: "Introduction To Polymer Physics",
    smeName: "Prof. Amit Kumar",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ch26"
  },
  {
    courseName: "Introduction To Polymer Physics",
    smeName: "Prof. Prateek Kumar Jha",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ph13"
  },
  {
    courseName: "Introduction To Polymer Physics",
    smeName: "Prof. Prateek Kumar Jha",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ch28"
  },
  {
    courseName: "Introduction To Probability And Statistics",
    smeName: "Prof. G. Srinivasan",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma07"
  },
  {
    courseName: "Introduction To Probability Theory And Stochastic Processes",
    smeName: "Prof. S Dhramaraja",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma19"
  },
  {
    courseName:
      "Introduction To Process Modeling In Membrane Separation Process",
    smeName: "Prof. Sirshendu De",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Mar-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ch04"
  },
  {
    courseName:
      "Introduction To Process Modeling In The Membrane Separation Process",
    smeName: "Prof. Sirshendu De",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch15"
  },
  {
    courseName: "Introduction To Professional Scientific Communication",
    smeName: "Prof. S. Ganesh",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-bt11"
  },
  {
    courseName: "Introduction To Professional Scientific Communication",
    smeName: "Prof. S. Ganesh",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ge06"
  },
  {
    courseName: "Introduction To Programming In C",
    smeName: "Prof. Sathyadev Nandakumar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Sep-Nov 2014",
    courseLink: "https://nptel.ac.in/noc/courses/noc14/SEM2/noc14-cs02"
  },
  {
    courseName: "Introduction To Programming In C",
    smeName: "Prof. Satyadev Nandakumar,\nProf. Amey Karkare",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-cs15"
  },
  {
    courseName: "Introduction To Programming In C",
    smeName: "Prof. Satyadev Nandakumar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs43"
  },
  {
    courseName: "Introduction To Programming In C",
    smeName: "Prof. Satyadev Nandakumar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs33"
  },
  {
    courseName: "Introduction To Programming In C",
    smeName: "Prof. Satyadev Nandakumar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs42"
  },
  {
    courseName: "Introduction To Propulsion",
    smeName: "Prof. D. P. Mishra",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ae01"
  },
  {
    courseName: "Introduction To Proteogenomics",
    smeName: "Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-bt26"
  },
  {
    courseName: "Introduction To Proteomics",
    smeName: "Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-bt07"
  },
  {
    courseName: "Introduction To Proteomics",
    smeName: "Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-bt11"
  },
  {
    courseName: "Introduction To Proteomics",
    smeName: "Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-bt09"
  },
  {
    courseName: "Introduction To Proteomics",
    smeName: "Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-bt30"
  },
  {
    courseName: "Introduction To Proteomics",
    smeName: "Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-bt25"
  },
  {
    courseName: "Introduction To Psychology",
    smeName: "Prof. Braj Bhushan",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-hs12"
  },
  {
    courseName: "Introduction To Psychology",
    smeName: "Prof. Braj Bhushan",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-hs30"
  },
  {
    courseName: "Introduction To R Software",
    smeName: "Prof. Shalabh",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ma17"
  },
  {
    courseName: "Introduction To R Software",
    smeName: "Prof. Shalabh",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs52"
  },
  {
    courseName: "Introduction To R Software",
    smeName: "Prof. Shalabh",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma33"
  },
  {
    courseName: "Introduction To Reciprocal Space",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-mm04"
  },
  {
    courseName: "Introduction To Remote Sensing",
    smeName: "Prof. Arun K. Saraf",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ce15"
  },
  {
    courseName: "Introduction To Remote Sensing",
    smeName: "Prof. Arun K. Saraf",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ce08"
  },
  {
    courseName: "Introduction To Research",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ge01"
  },
  {
    courseName: "Introduction To Research",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ge02"
  },
  {
    courseName: "Introduction To Research",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ge01"
  },
  {
    courseName: "Introduction To Research",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ge05"
  },
  {
    courseName: "Introduction To Research",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ge04"
  },
  {
    courseName: "Introduction To Research",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ge12"
  },
  {
    courseName: "Introduction To Research",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ge03"
  },
  {
    courseName: "Introduction To Research",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ge21"
  },
  {
    courseName: "Introduction To Rings And Fields",
    smeName: "Prof. KRISHNA HANUMANTHU",
    institute: "Chennai Mathematical Institute",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma25"
  },
  {
    courseName: "Introduction To Rocket Propulsion",
    smeName: "Prof. D. P. Mishra",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ae08"
  },
  {
    courseName: "Introduction To Smart Grid",
    smeName: "Prof. N. P. Padhy, Prof. Premalata Jena",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee42"
  },
  {
    courseName: "Introduction To Smart Grid",
    smeName: "Prof. N. P. Padhy & Prof. Premalata Jena",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee64"
  },
  {
    courseName: "Introduction To Soft Computing",
    smeName: "Prof. Debasis Samanta",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs13"
  },
  {
    courseName: "Introduction To Soft Computing",
    smeName: "Prof. Debasis Samanta",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs23"
  },
  {
    courseName: "Introduction To Solid State Physics",
    smeName: "Prof. Manoj Harbola, Prof. Satyajit Banerjee",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ph02"
  },
  {
    courseName: "Introduction To Statistical Hypothesis Testing",
    smeName: "Prof. Arun Tangirala",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Mar-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ch03"
  },
  {
    courseName: "Introduction To Statistical Hypothesis Testing",
    smeName: "Prof. Arun K. Tangirala",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ch06"
  },
  {
    courseName: "Introduction To Statistical Mechanics",
    smeName: "Prof. Girish S. Setlur",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ph10"
  },
  {
    courseName: "Introduction To The Psychology Of Language",
    smeName: "Prof. Ark Verma",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs14"
  },
  {
    courseName:
      "Introduction To Time-Frequency Analysis And Wavelet Transforms",
    smeName: "Prof. Arun K. Tangirala",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ch01"
  },
  {
    courseName:
      "Introduction To Time-Frequency Analysis And Wavelet Transforms",
    smeName: "Prof. Arun Tangirala",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ch05"
  },
  {
    courseName: "Introduction To Wireless And Cellular Communications",
    smeName: "Prof. David Kovil Pillai",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs37"
  },
  {
    courseName: "Introduction To Wireless And Cellular Communications",
    smeName: "Prof. David Koilpillai",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee29"
  },
  {
    courseName: "Introduction To Wireless And Cellular Communications",
    smeName: "Prof. David Koilpillai",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee48"
  },
  {
    courseName: "Introduction To World Literature",
    smeName: "Prof. Merin Simi Raj",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs12"
  },
  {
    courseName: "Introductory Course In Real Analysis",
    smeName: "Prof. P D Srivastava",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ma03"
  },
  {
    courseName: "Introductory Mathematical Methods For Biologists",
    smeName: "Prof. Ranjith Padinhateeri",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-bt04"
  },
  {
    courseName: "Introductory Mathematical Methods For Biologists",
    smeName: "Prof. Ranjith Padinhateeri",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-bt02"
  },
  {
    courseName: "Introductory Non-Linear Dynamics",
    smeName: "Prof. Ramakrishna Ramaswamy",
    institute: "IIT Delhi",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy33"
  },
  {
    courseName: "Introductory Organic Chemistry I",
    smeName: "Prof. Neeraja Dashaputre, Prof. Harinath Chakrapani",
    institute: "IISER Pune",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy20"
  },
  {
    courseName: "Introductory Quantum Mechanics",
    smeName: "Prof. Manoj Harbola",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ph03"
  },
  {
    courseName: "Iron Making",
    smeName: "Prof Govind S Gupta",
    institute: "IISc Bangalore",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mm09"
  },
  {
    courseName: "Irrigation And Drainage",
    smeName: "Prof. Damodhara Rao Mailapallli",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ar07"
  },
  {
    courseName: "Irrigation And Drainage",
    smeName: "Prof. Damodhara Rao Mailapalli",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ag03"
  },
  {
    courseName: "Issues In Bioethics",
    smeName: "Prof. Sreekumar Nellickappilly",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Sep-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-hs14"
  },
  {
    courseName: "Joining Technologies For Metals",
    smeName: "Prof. Dheerendra Kumar Dwivedi",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-me09"
  },
  {
    courseName: "Joining Technologies For Metals",
    smeName: "Prof. Dheerendra Kumar Dwivedi",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me33"
  },
  {
    courseName: "Joining Technologies For Metals",
    smeName: "Prof. Dheerendra Kumar Dwivedi",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me17"
  },
  {
    courseName: "Joy Of Computing Using Python",
    smeName: "Prof. Sudarshan Iyengar",
    institute: "IIT Ropar",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs09"
  },
  {
    courseName: "Kinematics Of Mechanisms And Machines",
    smeName: "Prof. Anirvan DasGupta",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me29"
  },
  {
    courseName: "Knowledge Management",
    smeName: "Prof. K. B. L. Srivastava",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mg07"
  },
  {
    courseName: "Knowledge Management",
    smeName: "Prof. KBL Srivastava",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg44"
  },
  {
    courseName: "Knowledge Management",
    smeName: "Prof. K B L Srivastava",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg33"
  },
  {
    courseName: "Landscape Architecture And Site Planning - Basic Fundamentals",
    smeName: "Prof. Uttam Kumar Bannerjee",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ce01"
  },
  {
    courseName: "Landscape Architecture And Site Planning - Basic Fundamentals",
    smeName: "Prof. Uttam Kumar Banerjee",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ar12"
  },
  {
    courseName: "Landscape Architecture And Site Planning - Basic Fundamentals",
    smeName: "Prof. Uttam Kumar Banerjee",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ar06"
  },
  {
    courseName: "Language And Mind",
    smeName: "Prof. Rajesh Kumar",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-hs02"
  },
  {
    courseName: "Language And Mind",
    smeName: "Prof. Rajesh Kumar",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-hs02"
  },
  {
    courseName: "Language And Mind",
    smeName: "Prof. Rajesh Kumar",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-hs09"
  },
  {
    courseName: "Language And Mind",
    smeName: "Prof. Rajesh Kumar",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs21"
  },
  {
    courseName: "Language And Mind",
    smeName: "Prof. Rajesh Kumar",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs04"
  },
  {
    courseName: "Language And Society",
    smeName: "Prof. Rajesh Kumar",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Sep-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-hs13"
  },
  {
    courseName: "Laser: Fundamentals And Applications",
    smeName: "Prof. Manabendra Chandra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cy07"
  },
  {
    courseName: "Laser: Fundamentals And Applications",
    smeName: "Prof. Manabendra Chandra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cy13"
  },
  {
    courseName: "Laws Of Thermodynamics",
    smeName: "Prof. S. K Som , Prof. Suman Chakraborty",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mm16"
  },
  {
    courseName: "Laws Of Thermodynamics",
    smeName: "Prof. SK Som And Prof. Suman Chakraborty",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me45"
  },
  {
    courseName: "LDPC And Polar Codes In 5G Standard",
    smeName: "Prof. Andrew Thangaraj",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee29"
  },
  {
    courseName: "Leadership",
    smeName: "Prof. Kalyan Chakravarti And Prof. Tuheena Mukherjee",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg29"
  },
  {
    courseName: "Leadership",
    smeName: "Prof. Kalyan Chakravarti And Prof. Tuheena Mukherjee",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg34"
  },
  {
    courseName:
      "Learning About Learning : A Course On Neurobiology Of Learning And Memory",
    smeName: "Prof. Balaji Jayaprakash",
    institute: "IISc Bangalore",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-bt12"
  },
  {
    courseName: "Legal Compliance For Incorporating Startup",
    smeName: "Prof. Indrajit Dube",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Mar-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-hs06"
  },
  {
    courseName: "Life Cycle Assessment",
    smeName: "Prof. Brajesh Kumar Dubey",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ce10"
  },
  {
    courseName: "Linear Algebra",
    smeName: "Prof. Dilip P. Patil",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ma04"
  },
  {
    courseName: "Linear Regression Analysis",
    smeName: "Prof. Shalabh",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ma03"
  },
  {
    courseName: "Linear Regression Analysis And Forecasting",
    smeName: "Prof. Shalabh",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ma08"
  },
  {
    courseName: "Linear System Theory",
    smeName: "Prof. Ramkrishna Pasumarthy",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee43"
  },
  {
    courseName: "Literary Theory And Literary Criticism",
    smeName: "Prof Aysha Iqbal",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-hs01"
  },
  {
    courseName: "Literary Theory And Literary Criticism",
    smeName: "Prof. Aysha Iqbal",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-hs10"
  },
  {
    courseName: "Literary Theory And Literary Criticism",
    smeName: "Prof. Aysha Iqbal Viswamohan",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs26"
  },
  {
    courseName: "Literature For Competitive Exams",
    smeName: "Prof. Aysha Iqbal",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-hs20"
  },
  {
    courseName: "Literature, Culture And Media",
    smeName: "Prof. Rashmi Gaur",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs05"
  },
  {
    courseName: "Machine Learning For Engineering And Science Applications",
    smeName: "Prof. Balaji Srinivasan, Prof. Ganapathy Krishnamurthi",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs14"
  },
  {
    courseName: "Machine Learning For Engineering And Science Applications",
    smeName: "Prof. Balaji Srinivasan And Prof. Ganapathy",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs82"
  },
  {
    courseName: "Machine Learning, ML",
    smeName: "Prof. Carl Gustaf Jansson",
    institute: "KTH Royal Institute of Technology, Sweden",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs35"
  },
  {
    courseName: "Machinery Fault Diagnosis And Signal Processing",
    smeName: "Prof. Amiya Ranjan Mohanty",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me12"
  },
  {
    courseName: "Machinery Fault Diagnosis And Signal Processing",
    smeName: "Prof. Amiya Ranjan Mohanty",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me27"
  },
  {
    courseName: "Macro Economics",
    smeName: "Prof. Surajit Sinha",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-hs08"
  },
  {
    courseName: "Manage TB",
    smeName: "Prof. Mohan Natrajan & Prof. V V Banu Rekha",
    institute: "ICMR-NIRT",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ge10"
  },
  {
    courseName: "Manage TB",
    smeName: "Prof. Mohan Natrajan & Prof. V V Banu Rekha",
    institute: "ICMR-NIRT",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ge12"
  },
  {
    courseName: "Manage TB",
    smeName: "Prof. Mohan Natrajan & Prof. V V Banu Rekha",
    institute: "ICMR-NIRT",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ge25"
  },
  {
    courseName: "Management Accounting",
    smeName: "Prof. Anil K. Sharma",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg36"
  },
  {
    courseName: "Management Of Field Sales",
    smeName: "Prof. Jayanta Chatterjee",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg27"
  },
  {
    courseName: "Management Of Inventory Systems",
    smeName: "Prof. PK Ray",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg43"
  },
  {
    courseName: "Management Of New Products And Services",
    smeName: "Prof. Jayanta Chatterjee",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg03"
  },
  {
    courseName: "Managing Change In Organizations",
    smeName: "Prof. KBL Srivastava",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg02"
  },
  {
    courseName: "Managing Intellectual Property In Universities",
    smeName: "Prof. Feroze Ali",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs30"
  },
  {
    courseName: "Managing Services",
    smeName: "Prof. Jayanta Chatterjee",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-mg07"
  },
  {
    courseName: "Managing Services",
    smeName: "Prof. Jayanta Chatterjee",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg07"
  },
  {
    courseName: "Manufacturing Automation",
    smeName: "Prof. Sounak Kumar Choudhury",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me78"
  },
  {
    courseName: "Manufacturing Guidelines For Product Design",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me22"
  },
  {
    courseName: "Manufacturing Of Composites",
    smeName: "Prof. J. Ramkumar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-me14"
  },
  {
    courseName: "Manufacturing Of Composites",
    smeName: "Prof. J. Ramkumar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me59"
  },
  {
    courseName: "Manufacturing Of Composites",
    smeName: "Prof. J. Ramkumar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me67"
  },
  {
    courseName: "Manufacturing Process Technology",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me20"
  },
  {
    courseName: "Manufacturing Process Technology - II",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-me17"
  },
  {
    courseName: "Manufacturing Process Technology -Part I",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-me03"
  },
  {
    courseName: "Manufacturing Process Technology I & II",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-me03"
  },
  {
    courseName: "Manufacturing Process Technology I & II",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me05"
  },
  {
    courseName: "Manufacturing Strategy",
    smeName: "Prof. Rajat Agarwal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg20"
  },
  {
    courseName: "Manufacturing System Technology Part 1 & 2",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-me18"
  },
  {
    courseName: "Manufacturing Systems Technology",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-me07"
  },
  {
    courseName: "Manufacturing Systems Technology I & II",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mm13"
  },
  {
    courseName: "Manufacturing Systems Technology I & II",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me52"
  },
  {
    courseName: "Manufacturing Systems Technology Part I & II",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me45"
  },
  {
    courseName: "Manufacturing Systems Technology Part II",
    smeName: "Prof. Shantanu Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Sep-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-me08"
  },
  {
    courseName: "Mapping Signal Processing Algorithms To Architectures",
    smeName: "Prof. Nitin Chandrachoodan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee70"
  },
  {
    courseName: "Marketing Management - II",
    smeName: "Prof. Jayanta Chatterjee, Prof. Shashi Shekhar Mishra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-mg04"
  },
  {
    courseName: "Marketing Management - II",
    smeName: "Prof. Jayanta Chatterjee, Prof. Shashi Shekhar Mishra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg28"
  },
  {
    courseName: "Marketing Management-I",
    smeName: "Prof. Jayanta Chatterjee & Prof. Shashi Shekhar Mishra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-mg02"
  },
  {
    courseName: "Marketing Management-I",
    smeName: "Prof. Jayanta Chatterjee / Prof. Shashi Shekhar Mishra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg30"
  },
  {
    courseName: "Marketing Management-I",
    smeName: "Prof. Jayanta Chatterjee / Prof. Shashi Shekhar Mishra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg48"
  },
  {
    courseName: "Marketing Research And Analysis",
    smeName: "Prof. J. K. Nayak",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mg16"
  },
  {
    courseName: "Marketing Research And Analysis",
    smeName: "Prof. J. K. Nayak",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg31"
  },
  {
    courseName: "Marketing Research And Analysis",
    smeName: "Prof. J. K. Nayak",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg49"
  },
  {
    courseName: "Marketing Research And Analysis - II",
    smeName: "Prof. J. K. Nayak",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg12"
  },
  {
    courseName: "Mass Spectrometry Based Proteomics",
    smeName: "Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Sep-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-bt05"
  },
  {
    courseName: "Mass Spectrometry Based Proteomics",
    smeName: "Prof. Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Mar-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-bt03"
  },
  {
    courseName: "Mass Transfer Operations - I",
    smeName: "Prof. Bishnupada Mandal",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ch03"
  },
  {
    courseName: "Mass Transfer Operations II",
    smeName: "Prof. Chandan Das",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ch31"
  },
  {
    courseName: "Mass, Momentum And Energy Balances In Engineering Analysis",
    smeName: "Prof. Pavitra Sandilya",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ce15"
  },
  {
    courseName: "Material And Energy Balances",
    smeName: "Prof. Vignesh Muthuvijayan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-bt29"
  },
  {
    courseName: "Material Characterization",
    smeName: "Prof. Sankaran. S",
    institute: "IIT madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mm08"
  },
  {
    courseName: "Material Characterization",
    smeName: "Prof. Sankaran. S",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mm02"
  },
  {
    courseName: "Material Characterization",
    smeName: "Prof. Sankaran. S",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mm08"
  },
  {
    courseName: "Material Science And Engineering",
    smeName: "Prof. Vivek Pancholi",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mm05"
  },
  {
    courseName: "Material Science And Engineering",
    smeName: "Prof. Vivek Pancholi",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mm01"
  },
  {
    courseName: "Mathematical Finance",
    smeName: "Prof. N. Selvaraju, Prof. Siddhartha Pratim Chakrabarty",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma26"
  },
  {
    courseName: "Mathematical Methods And Its Applications",
    smeName: "Prof. P. N. Agarwal",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ma06"
  },
  {
    courseName: "Mathematical Methods And Its Applications",
    smeName: "Prof. P. N. Agarwal",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ma12"
  },
  {
    courseName: "Mathematical Methods And Techniques In Signal Processing",
    smeName: "Prof. Shayan Srinivasa Garani",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ec07"
  },
  {
    courseName: "Mathematical Methods And Techniques In Signal Processing",
    smeName: "Prof. Shayan Srinivasa Garani",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee31"
  },
  {
    courseName: "Mathematical Methods For Boundary Value Problems",
    smeName: "Prof. Somnath Bhattacharyya",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma27"
  },
  {
    courseName: "Mathematical Methods In Engineering And Science",
    smeName: "Prof. Bhaskar Dasgupta",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-me28"
  },
  {
    courseName: "Mathematical Methods In Physics -I",
    smeName: "Prof. Samudra Roy",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ph06"
  },
  {
    courseName: "Mathematical Modeling Of Manufacturing Processes",
    smeName: "Prof. Swarup Bag",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me47"
  },
  {
    courseName: "Mathematical Modelling: Analysis And Applications",
    smeName: "Prof. Ameeya Kumar Nayak",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma18"
  },
  {
    courseName: "Mathematics For Chemistry",
    smeName: "Prof. Madhav Ranganathan",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-cy02"
  },
  {
    courseName: "MATLAB Programming For Numerical Computation",
    smeName: "Prof. Niket S Kaisare",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ch01"
  },
  {
    courseName: "Matlab Programming For Numerical Computation",
    smeName: "Prof. Niket S Kaisare",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ge02"
  },
  {
    courseName: "MATLAB Programming For Numerical Computation",
    smeName: "Prof. Niket S Kaisare",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ge05"
  },
  {
    courseName: "Matlab Programming For Numerical Computation",
    smeName: "Prof. Niket S Kaisare",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ge10"
  },
  {
    courseName: "Matrix Analysis With Applications",
    smeName: "Prof. S. K. Gupta, Prof. Sanjeev Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma14"
  },
  {
    courseName: "Matrix Analysis With Applications",
    smeName: "Prof. S. K. Gupta, Prof. Sanjeev Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma28"
  },
  {
    courseName: "Matrix Method Of Structural Analysis",
    smeName: "Prof. Amit Shaw & Prof. Biswanath Banerjee",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce19"
  },
  {
    courseName: "Matrix Method Of Structural Analysis",
    smeName: "Prof. Amit Shaw & Prof . Biswanath Banerjee",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce33"
  },
  {
    courseName: "Matrix Solver",
    smeName: "Prof. Somnath Roy",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma13"
  },
  {
    courseName: "MCDM Techniques Using R",
    smeName: "Prof. Gaurav Dixit",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg16"
  },
  {
    courseName: "Measure Theory",
    smeName: "Prof. Inder Kumar Rana",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ma15"
  },
  {
    courseName: "Measure Theory",
    smeName: "Prof. I. K. Rana",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma17"
  },
  {
    courseName: "Measurement Technique In Multiphase Flows",
    smeName: "Prof. Rajesh Kumar Upadhyay",
    institute: "IIT Guwahati",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch18"
  },
  {
    courseName: "Mechanical Design Simulation Practice",
    smeName: "Prof. Venkata Timmaraju Mallina",
    institute: "IIITD&M Kancheepuram",
    courseDuration: "",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/lab19/SEM1/lab19-me01"
  },
  {
    courseName: "Mechanical Design Simulation Practice",
    smeName: "Prof. Venkata Timmaraju Mallina",
    institute: "IIITD&M Kancheepuram",
    courseDuration: "",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/lab19/SEM1/lab19-me02"
  },
  {
    courseName: "Mechanical Design Simulation Practice",
    smeName: "Prof. Venkata Timmaraju Mallina",
    institute: "IIT Madras",
    courseDuration: "",
    timeline: "Jul-Dec 2019",
    courseLink: "https://nptel.ac.in/noc/courses/lab19/SEM2/lab19-me04"
  },
  {
    courseName: "Mechanical Measurement Systems",
    smeName: "Prof. Ravi Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me30"
  },
  {
    courseName: "Mechanical Operations",
    smeName: "Prof. Shabina Khanam",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Sep-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ch07"
  },
  {
    courseName: "Mechanical Operations",
    smeName: "Prof. Shabina Khanam",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch05"
  },
  {
    courseName: "Mechanical Operations",
    smeName: "Prof. Shabina Khanam",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ch07"
  },
  {
    courseName: "Mechanical Unit Operations",
    smeName: "Prof. Nanda Kishore",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ch32"
  },
  {
    courseName: "Mechanics Of Human Movement",
    smeName: "Prof. Sujatha Srinivasan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me55"
  },
  {
    courseName: "Mechanics Of Machining",
    smeName: "Prof. Uday S. Dixit",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me56"
  },
  {
    courseName: "Mechanics Of Materials",
    smeName: "Prof. U. Saravanan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ce04"
  },
  {
    courseName: "Mechanics Of Solids",
    smeName: "Prof. M. S. Sivakumar",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ce02"
  },
  {
    courseName: "Mechanics Of Solids",
    smeName: "Prof. Priyanka Ghosh",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ce17"
  },
  {
    courseName: "Mechanics, Heat, Oscillations And Waves",
    smeName: "Prof. V. Balakrishnan",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "May-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ph07"
  },
  {
    courseName: "Mechanism And Robot Kinematics",
    smeName: "Prof. AnirvanDasGupta",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me18"
  },
  {
    courseName: "Mechanisms In Organic Chemistry",
    smeName: "Prof. Nandita Madhavan",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy21"
  },
  {
    courseName: "Medical Biomaterials",
    smeName: "Prof. Mukesh Doble",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-bt08"
  },
  {
    courseName: "Medical Biomaterials",
    smeName: "Prof. Mukesh Doble",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-bt08"
  },
  {
    courseName: "Medical Biomaterials",
    smeName: "Prof. Mukesh Doble",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-bt03"
  },
  {
    courseName: "Medical Image Analysis",
    smeName: "Prof. Debdoot Sheet",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ee01"
  },
  {
    courseName: "Medicinal Chemistry",
    smeName: "Prof. Harinath Chakrapani",
    institute: "IISER Pune",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cy05"
  },
  {
    courseName: "Metal Cutting And Machine Tools",
    smeName: "Prof. Asimava Roy Choudhury",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me14"
  },
  {
    courseName: "Metal Mediated Synthesis - I",
    smeName: "Prof. D. Maiti",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cy15"
  },
  {
    courseName: "Metal Mediated Synthesis-I",
    smeName: "Prof. Debabrata Maiti",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cy08"
  },
  {
    courseName: "Metals In Biology",
    smeName: "Prof. D. Maiti",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy27"
  },
  {
    courseName: "Micro And Nano Scale Energy Transport",
    smeName: "Prof. Arvind Pattamatta",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-me25"
  },
  {
    courseName: "Microeconomics: Theory & Applications",
    smeName: "Prof. Deep Mukerjee",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg22"
  },
  {
    courseName: "Microelectronics: Devices To Circuits",
    smeName: "Prof. Sudeb Dasgupta",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee54"
  },
  {
    courseName: "Microprocessors And Microcontrollers",
    smeName: "Prof. Santanu Chattopadhyay",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ec03"
  },
  {
    courseName: "Microprocessors And Microcontrollers",
    smeName: "Prof. Santanu Chattopadhyay",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee11"
  },
  {
    courseName: "Microwave Engineering",
    smeName: "Prof. Ratnajit Bhattacharjee",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee68"
  },
  {
    courseName: "Microwave Integrated Circuits",
    smeName: "Prof. Jayanta Mukherjee",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ec02"
  },
  {
    courseName: "Microwave Integrated Circuits",
    smeName: "Prof. Jayanta Mukherjee",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ee16"
  },
  {
    courseName: "Microwave Integrated Circuits",
    smeName: "Prof. Jayanta Mukherjee",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee47"
  },
  {
    courseName: "Microwave Theory And Techniques",
    smeName: "Prof. Girish Kumar",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee22"
  },
  {
    courseName: "Microwave Theory And Techniques",
    smeName: "Prof. Girish Kumar",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee57"
  },
  {
    courseName: "Millimeter Wave Technology",
    smeName: "Prof. Mrinal Kanti Mandal",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ec04"
  },
  {
    courseName:
      "Mineral Resources: Geology, Exploration, Economics And Environment",
    smeName: "Prof. M. K. Panigrahi",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ce13"
  },
  {
    courseName: "Mobile Computing",
    smeName: "Prof. Pushpendra Singh",
    institute: "IIIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs13"
  },
  {
    courseName: "Model Checking",
    smeName: "Prof. Srivathsan. B",
    institute: "Chennai Mathematical Institute",
    courseDuration: "12 weeks",
    timeline: "Jul-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-cs12"
  },
  {
    courseName: "Model Checking",
    smeName: "Prof. B. Srivathsan",
    institute: "Chennai Mathematical Institute",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs38"
  },
  {
    courseName: "Model Checking",
    smeName: "Prof. B. Srivathsan",
    institute: "Chennai Mathematical Institute",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs49"
  },
  {
    courseName: "Modeling And Simulation Of Discrete Event Systems",
    smeName: "Prof. P. Kumar Jha",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-me35"
  },
  {
    courseName: "Modeling Transport Phenomena Of Microparticles",
    smeName: "Prof. S Bhattacharyya & G. P. Raja Sekhar",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ma07"
  },
  {
    courseName: "Modelling And Simulation Of Dynamic Systems",
    smeName: "Prof. Pushparaj Mani Pathak",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-me10"
  },
  {
    courseName: "Modelling And Simulation Of Dynamic Systems",
    smeName: "Prof. Pushparaj Mani Pathak",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me38"
  },
  {
    courseName: "Modelling And Simulation Of Dynamic Systems",
    smeName: "Prof. Pushparaj Mani Pathak",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me39"
  },
  {
    courseName: "Modern Algebra",
    smeName: "Prof. Manindra Agrawal",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs15"
  },
  {
    courseName: "Modern Algebra",
    smeName: "Prof. Manindra Agrawal",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs78"
  },
  {
    courseName: "Modern Construction Materials",
    smeName: "Prof. Ravindra Gettu,\nProf. Radhakrishna G. Pillai",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-ce05"
  },
  {
    courseName: "Modern Construction Materials",
    smeName: "Prof. Ravindra Gettu",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ce05"
  },
  {
    courseName: "Modern Construction Materials",
    smeName: "Prof. Ravindra Gettu",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce22"
  },
  {
    courseName: "Modern Digital Communication Techniques",
    smeName: "Prof. Suvra Sekhar Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ec12"
  },
  {
    courseName: "Modern Digital Communication Techniques",
    smeName: "Prof. Suvra Sekhar Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee06"
  },
  {
    courseName: "Modern Optics",
    smeName: "Prof. Partha Roy Choudhuri",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ph09"
  },
  {
    courseName: "Molecular Spectroscopy: A Physical Chemist's Perspective",
    smeName: "Prof. Anindya Datta",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cy04"
  },
  {
    courseName: "Molecules In Motion",
    smeName: "Prof. Amita Pathak Mahanty",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cy10"
  },
  {
    courseName: "Momentum Transfer In Process Engineering",
    smeName: "Prof. Tridib Kumar Goswami",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ag01"
  },
  {
    courseName: "MultiCore Computer Architecture-Storage And Interconnects",
    smeName: "Prof. John Jose",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs50"
  },
  {
    courseName:
      "Multidimensional NMR Spectroscopy For Structural Studies Of Biomolecules",
    smeName: "Prof. Hanudatta S. Atreya",
    institute: "IISc Bangalore",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cy12"
  },
  {
    courseName: "Multimodal Interaction",
    smeName: "Prof. Prof. -Ing. Sebastian Moller , Prof. -Ing. Stefan Hillmann",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs34"
  },
  {
    courseName: "Multiphase Flows",
    smeName: "Prof. Rajesh Kumar Upadhyay",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch19"
  },
  {
    courseName: "Multiphase Microfluidics",
    smeName: "Prof. Raghvendra �Gupta",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch13"
  },
  {
    courseName: "Multirate DSP",
    smeName: "Prof. R. David Koilpillai",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee27"
  },
  {
    courseName: "Multivariable Calculus",
    smeName: "Prof. S. K. Gupta And Prof. Sanjeev Kumar, Prof. Sanjeev Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ma05"
  },
  {
    courseName: "Multivariable Calculus",
    smeName: "Prof. S. K. Gupta And Prof. Sanjeev Kumar, Prof. Sanjeev Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ma03"
  },
  {
    courseName: "Nanotechnology In Agriculture",
    smeName: "Prof. Mainak Das",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-bt25"
  },
  {
    courseName: "Nanotechnology In Agriculture",
    smeName: "Prof. Mainak Das",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-bt21"
  },
  {
    courseName: "Nanotechnology, Science And Applications",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mm21"
  },
  {
    courseName: "Natural Gas Engineering",
    smeName: "Prof. Pankaj Tiwari",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ch25"
  },
  {
    courseName: "Natural Gas Engineering",
    smeName: "Prof. Pankaj Tiwari",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ch24"
  },
  {
    courseName: "Natural Hazards - Part-1",
    smeName: "Prof. Javed N. Malik",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ce14"
  },
  {
    courseName: "Natural Language Processing",
    smeName: "Prof. Pawan Goyal",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-cs03"
  },
  {
    courseName: "Natural Language Processing",
    smeName: "Prof. Pawan Goyal",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs56"
  },
  {
    courseName: "Nature And Properties Of Materials",
    smeName: "Prof. Bishakh Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-me27"
  },
  {
    courseName: "Nature And Properties Of Materials",
    smeName: "Prof. Bisakh Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mm10"
  },
  {
    courseName: "Nature And Property Of Materials",
    smeName: "Prof. Bishakh Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-me16"
  },
  {
    courseName: "Network Analysis For Mines And Mineral Engineering",
    smeName: "Prof. Kaushik Dey",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mm11"
  },
  {
    courseName: "Networks And Systems",
    smeName:
      "Prof. V. G. K. Murti (retd. ),\nProf. C. S. Ramalingam,\nProf. Andrew Thangaraj",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-ec06"
  },
  {
    courseName: "Networks And Systems",
    smeName: "Prof. Andrew Thangaraj, Prof. C. S. Ramalingam",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ee15"
  },
  {
    courseName: "Neural Networks For Signal Processing - I",
    smeName: "Prof. Shayan Srinivasa Garani",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee53"
  },
  {
    courseName: "Neuroscience Of Human Movement",
    smeName: "Prof. Varadhan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ge13"
  },
  {
    courseName: "Neuroscience Of Human Movements",
    smeName: "Prof. Varadhan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ge28"
  },
  {
    courseName: "NMR Spectroscopy For Chemists And Biologists",
    smeName: "Prof. Ashutosh Kumar, Prof. R. V Hosur",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy30"
  },
  {
    courseName: "Noise Management & Control",
    smeName: "Prof. Nachiketa Tiwari",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mm12"
  },
  {
    courseName: "Noise Management And Control",
    smeName: "Prof. Nachiketa Tiwari",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me63"
  },
  {
    courseName: "Noise Management And Control",
    smeName: "Prof. Nachiketa Tiwari",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me72"
  },
  {
    courseName:
      "Non Traditional Abrasive Machining Processes- Ultrasonic, Abrasive Jet And Abrasive Water Jet Machining",
    smeName: "Prof. Asimava Roy Choudhury",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-me17"
  },
  {
    courseName: "Non-Conventional Energy Resources",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Feb-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ge09"
  },
  {
    courseName: "Non-Conventional Energy Resources",
    smeName: "Prof. Prathap Haridos",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ge14"
  },
  {
    courseName: "Non-Conventional Energy Resources",
    smeName: "Prof. Prathap Haridos",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ge11"
  },
  {
    courseName: "Nonlinear And Adaptive Control",
    smeName: "Prof. Shubhendu Bhasin",
    institute: "IIT Delhi",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee46"
  },
  {
    courseName: "Nonlinear Programming",
    smeName: "Prof. S. K Gupta",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ma13"
  },
  {
    courseName: "Nonlinear Programming",
    smeName: "Prof. S. K. Gupta",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma20"
  },
  {
    courseName:
      "Novel Technologies For Food Processing And Shelf Life Extension",
    smeName: "Prof. Hari Niwas Mishra",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ar01"
  },
  {
    courseName: "Nuclear And Particle Physics",
    smeName: "Prof. Poulose Poulose",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ph02"
  },
  {
    courseName: "Numerical Analysis",
    smeName: "Prof. R. Usha",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ma16"
  },
  {
    courseName: "Numerical Linear Algebra",
    smeName: "Prof. P. N. Agrawal Prof. D. N. Pandey, Prof. D. N. Pandey",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ma01"
  },
  {
    courseName: "Numerical Methods",
    smeName: "Prof. Ameeya Kumar Nayak, Prof. Sanjeev Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ma14"
  },
  {
    courseName: "Numerical Methods",
    smeName: "Prof. Ameeya Kumar Nayak , Prof. Sanjeev Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma11"
  },
  {
    courseName: "Numerical Methods",
    smeName: "Prof. Ameeya Kumar Nayak And Prof. Sanjeev Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma21"
  },
  {
    courseName: "Numerical Methods And Programing",
    smeName: "Prof. P. B. Sunil Kumar",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Feb-May 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-cs05"
  },
  {
    courseName:
      "Numerical Methods And Simulation Techniques For Scientists And Engineers",
    smeName: "Prof. Saurabh Basu",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ph11"
  },
  {
    courseName: "Numerical Methods For Engineers",
    smeName: "Prof. Niket S Kaisare",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ge30"
  },
  {
    courseName: "Numerical Methods: Finite Difference Approach",
    smeName: "Prof. Ameeya Kumar Nayak",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ma03"
  },
  {
    courseName: "Object Oriented Analysis And Design",
    smeName: "Prof. Partha Pratim Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs25"
  },
  {
    courseName: "Object Oriented Analysis And Design",
    smeName: "Prof. Partha Pratim Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs48"
  },
  {
    courseName: "Object-Oriented Analysis And Design",
    smeName: "Prof. Partha Pratim Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs19"
  },
  {
    courseName:
      "Offshore Structures Under Special Loads Including Fire Resistance",
    smeName: "Prof. Srinivasan Chandrasekaran",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-oe01"
  },
  {
    courseName:
      "Offshore Structures Under Special Loads Including Fire Resistance",
    smeName: "Prof. Srinivasan Chandrasekaran",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-oe01"
  },
  {
    courseName:
      "Op-Amp Practical Applications: Design, Simulation And Implementation",
    smeName: "Prof. Hardik Jeetendra Pandya",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee37"
  },
  {
    courseName:
      "Op-Amp Practical Applications: Design, Simulation And Implementation",
    smeName: "Prof. Hardik J Pandya Prof Chandramani Kishore Singh",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee39"
  },
  {
    courseName: "Operating System Fundamentals",
    smeName: "Prof. Santanu Chattopadhyay",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs51"
  },
  {
    courseName: "Operations And Supply Chain Management",
    smeName: "Prof. G. Srinivasan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-mg04"
  },
  {
    courseName: "Operations And Supply Chain Management",
    smeName: "Prof. G. Srinivasan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mg14"
  },
  {
    courseName: "Operations And Supply Chain Management",
    smeName: "Prof. G. Srinivasan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg22"
  },
  {
    courseName: "Operations Management",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me26"
  },
  {
    courseName: "Operations Research",
    smeName: "Prof. KUSUM DEEP",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma29"
  },
  {
    courseName: "Optical Communications",
    smeName: "Prof. Pradeep Kumar K",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ec16"
  },
  {
    courseName: "Optimal Control",
    smeName: "Prof. Barjeev Tyagi",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ee11"
  },
  {
    courseName: "Optimization In Chemical Engineering",
    smeName: "Prof. Debasis Sarkar",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ch21"
  },
  {
    courseName: "Optimization Techniques For Digital VLSI Design",
    smeName: "Prof. Chandan Karfa, Prof. Santosh Biswas",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ec06"
  },
  {
    courseName: "Ordinary And Partial Differential Equations And Applications",
    smeName: "Prof. P. N. Agrawal, Prof. D. N. Pandey",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma10"
  },
  {
    courseName: "Organic Chemistry In Biology And Drug Development",
    smeName: "Prof. Amit Basak",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy22"
  },
  {
    courseName: "Organic Chemistry Laboratory Workshop",
    smeName: "Prof. Harinath Chakrapani",
    institute: "IISER PUNE",
    courseDuration: "08 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cy21"
  },
  {
    courseName: "Organic Farming For Sustainable Agricultural Production",
    smeName: "Prof. Dilip Kumar Swain",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ar06"
  },
  {
    courseName: "Organic Farming For Sustainable Agricultural Production",
    smeName: "Prof. Dilip Kumar Swain",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ag04"
  },
  {
    courseName: "Organo Metallic Chemistry",
    smeName: "Prof. Debabrata Maiti",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cy06"
  },
  {
    courseName: "Organometallic Chemistry",
    smeName: "Prof. Debabrata Maiti",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cy09"
  },
  {
    courseName: "Organometallic Chemistry",
    smeName: "Prof. Debabrata Maiti",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cy03"
  },
  {
    courseName: "Outcome Based Pedagogic Principles For Effective Teaching",
    smeName: "Prof. Shyamal Kumar Das Mandal",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ge03"
  },
  {
    courseName: "Outcome Based Pedagogic Principles For Effective Teaching",
    smeName: "Prof. Shyamal Kumar Das Mandal And Prof. Tamali Bhattacharyya.",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ge07"
  },
  {
    courseName: "Outcome Based Pedagogic Principles For Effective Teaching",
    smeName: "Prof. Shyamal Kumar Das Mandal",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ge06"
  },
  {
    courseName: "Outcome Based Pedagogic Principles For Effective Teaching",
    smeName: "Prof. Shyamal Kr Das Mandal & Prof. Tamali Bhattachary",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ge15"
  },
  {
    courseName: "Parallel Algorithms",
    smeName: "Prof. Sajith Gopalan",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs17"
  },
  {
    courseName:
      "Partial Differential Equations (PDE) For Engineers: Solution By Separation Of Variables",
    smeName: "Prof. Sirshendu De",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Mar-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ma06"
  },
  {
    courseName: "Particle Characterization (PG)",
    smeName: "Prof. Prof. R. Nagarajan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Feb-May 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ch02"
  },
  {
    courseName: "Patent Drafting For Beginners",
    smeName: "Prof. Feroz Ali",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs17"
  },
  {
    courseName: "Patent Drafting For Beginners",
    smeName: "Prof. Feroz Ali",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs01"
  },
  {
    courseName: "Patent Drafting For Beginners",
    smeName: "Prof. Feroze Ali",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs66"
  },
  {
    courseName: "Patent Law For Engineers And Scientists",
    smeName: "Prof. Feroze Ali",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mg15"
  },
  {
    courseName: "Patent Law For Engineers And Scientists",
    smeName: "Prof. Feroz Ali",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs20"
  },
  {
    courseName: "Patent Law For Engineers And Scientists",
    smeName: "Prof. Feroz Ali",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs02"
  },
  {
    courseName: "Patent Law For Engineers And Scientists",
    smeName: "Prof. Feroze Ali",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs65"
  },
  {
    courseName: "Patent Search For Engineers And Lawyers",
    smeName: "Prof. M. Padmavati, Prof. Shreya Matilal",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg59"
  },
  {
    courseName: "Path Integral And Functional Methods In Quantum Field Theory",
    smeName: "Prof. Urjit A. Yajnik",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ph17"
  },
  {
    courseName: "Pattern Recognition And Application",
    smeName: "Prof. Prabir Kumar Biswas",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee56"
  },
  {
    courseName: "Performance And Reward Management",
    smeName: "Prof. Sushmita Mukhopadhyay",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg52"
  },
  {
    courseName: "Pericyclic Reactions And Organic Photochemistry",
    smeName: "Prof. Sankararaman",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cy04"
  },
  {
    courseName: "Pericyclic Reactions And Organic Photochemistry",
    smeName: "Prof. Sankararaman S",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cy13"
  },
  {
    courseName: "Pericyclic Reactions And Organic Photochemistry",
    smeName: "Prof. Sankararaman S",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cy16"
  },
  {
    courseName: "Perspectives On Neurolinguistic",
    smeName: "Prof. Smita Jha",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs10"
  },
  {
    courseName: "Perspectives On Neurolinguistic",
    smeName: "Prof. Smita Jha",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs25"
  },
  {
    courseName: "Phase Diagrams In Materials Science And Engineering",
    smeName: "Prof. Prof. Krishanu Biswas",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-mm05"
  },
  {
    courseName:
      "Phase Equilibria In Materials (Nature & Properties Of Materials-II)",
    smeName: "Prof. Ashish Garg",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mm20"
  },
  {
    courseName: "Phase Equilibrium Thermodynamics",
    smeName: "Prof. Gargi Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ch10"
  },
  {
    courseName: "Phase Equilibrium Thermodynamics",
    smeName: "Prof. Gargi Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ch20"
  },
  {
    courseName: "Phase Equilibrium Thermodynamics",
    smeName: "Prof. Gargi Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ch25"
  },
  {
    courseName:
      "Phase Field Modelling: The Materials Science, Mathematics And Computational Aspects",
    smeName: "Prof. M. P Gururajan",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-mm10"
  },
  {
    courseName:
      "Phase Field Modelling: The Materials Science, Mathematics And Computational Aspects",
    smeName: "Prof. M. P. Gururajan",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mm17"
  },
  {
    courseName: "Phase Transformation In Materials",
    smeName: "Prof. Krishanu Biswas",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-me20"
  },
  {
    courseName: "Photogeology In Terrain Evaluation (Part 1 And 2)",
    smeName: "Prof. Javed N. Malik",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce34"
  },
  {
    courseName: "Photogeology In Terrain Evaluation (Part 2)",
    smeName: "Prof. Javed Malik",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce35"
  },
  {
    courseName: "Photogeology In Terrain Evaluation(Part-1)",
    smeName: "Prof. Javed N. Malik",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ce11"
  },
  {
    courseName: "Photonic Integrated Circuits",
    smeName: "Prof. T. Srinivas",
    institute: "IISc Bangalore",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ec07"
  },
  {
    courseName:
      "Physical Modelling For Electronics Enclosures Using Rapid Prototyping",
    smeName: "Prof. NV Chalapathi Rao",
    institute: "IISc Bangalore",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee38"
  },
  {
    courseName: "Physics Of Materials",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-mm03"
  },
  {
    courseName: "Physics Of Materials",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-mm08"
  },
  {
    courseName: "Physics Of Materials",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mm01"
  },
  {
    courseName: "Physics Of Materials",
    smeName: "Prof. Prathap Haridoss",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mm20"
  },
  {
    courseName: "Physics Of Turbulence",
    smeName: "Prof. Mahendra K. Verma",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ph12"
  },
  {
    courseName: "Physics,A Glimpse Of Undergraduate Physics Experiments",
    smeName: "Prof. Subhajit Bandyopadhyay",
    institute: "IISER KOLKATA",
    courseDuration: "",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/lab19/SEM1/lab19-ph01"
  },
  {
    courseName: "Plant Cell Bioprocessing",
    smeName: "Prof. Smita Srivastava",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-bt18"
  },
  {
    courseName: "Plant Developmental Biology",
    smeName: "Prof. Shri Ram Yadav",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-bt17"
  },
  {
    courseName: "Plastic Waste Management",
    smeName: "Prof. Brajesh K Dubey",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ce07"
  },
  {
    courseName: "Plastic Working Of Metallic Materials",
    smeName: "Prof. P. S. Robi",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me66"
  },
  {
    courseName: "Polymer Assisted Abrasive Finishing Processes",
    smeName: "Prof. M. Ravi Sankar",
    institute: "IIT Guwahati",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me33"
  },
  {
    courseName: "Population Studies",
    smeName: "Prof. A. K. Sharma",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs39"
  },
  {
    courseName: "Positive Psychology",
    smeName: "Prof. Kamlesh Singh",
    institute: "IIT Delhi",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs63"
  },
  {
    courseName: "Postcolonial Literature",
    smeName: "Prof. Sayan Chattopadhyay",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-hs12"
  },
  {
    courseName: "Postcolonial Literature",
    smeName: "Prof. Sayan Chattopadhyay",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs05"
  },
  {
    courseName: "Postcolonial Literature",
    smeName: "Prof. Sayan Chattopadhyay",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs29"
  },
  {
    courseName: "Postmodernism In Literature",
    smeName: "Prof. Merin Simi Raj",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs19"
  },
  {
    courseName: "Postmodernism In Literature",
    smeName: "Prof. Merin Simi Raj",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs08"
  },
  {
    courseName: "Power Electronics",
    smeName: "Prof. G. Bhuvaneshwari",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee37"
  },
  {
    courseName: "Power System Analysis",
    smeName: "Prof. Debapriya Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ec08"
  },
  {
    courseName: "Power System Analysis",
    smeName: "Prof. Debapriya Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee16"
  },
  {
    courseName: "Power System Analysis",
    smeName: "Prof. Debapriya Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee62"
  },
  {
    courseName: "Power System Dynamics, Control And Monitoring",
    smeName: "Prof. Debapriya Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee14"
  },
  {
    courseName: "Power System Engineering",
    smeName: "Prof. Debapriya Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ee09"
  },
  {
    courseName: "Power System Engineering",
    smeName: "Prof. Debapriya Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee02"
  },
  {
    courseName: "Practical English: Learning And Teaching",
    smeName: "Prof. Bhaskar Dasgupta",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-hs12"
  },
  {
    courseName: "Practical Machine Learning With Tensorflow",
    smeName: "Prof. Ashish Tendulkar Prof. B. Ravindran",
    institute: "IIT Madras & Google",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs81"
  },
  {
    courseName:
      "Practitioners Course In Descriptive, Predictive And Prescriptive Analytics",
    smeName: "Prof. Deepu Philip / Prof. Sanjeev Newar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg05"
  },
  {
    courseName:
      "Practitioners Course In Descriptive, Predictive And Prescriptive Analytics",
    smeName: "Prof. Deepu Philip / Prof. Amandeep Singh / Prof. Sanjeev Newar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg42"
  },
  {
    courseName: "Principles And Applications Of Building Science",
    smeName: "Prof. E. Rajasekar",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Sep-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ce11"
  },
  {
    courseName: "Principles And Applications Of Building Science",
    smeName: "Prof. E. Rajasekar",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ar01"
  },
  {
    courseName: "Principles And Applications Of Building Science",
    smeName: "Prof. E. Rajasekar",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ar03"
  },
  {
    courseName: "Principles And Applications Of NMR Spectroscopy",
    smeName: "Prof. Hanudatta S. Atreya",
    institute: "IISc Bangalore",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cy05"
  },
  {
    courseName: "Principles And Applications Of NMR Spectroscopy",
    smeName: "Prof. Hanudatta S. Atreya",
    institute: "IISc Bangalore",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ge07"
  },
  {
    courseName: "Principles And Techniques Of Modern Radar Systems",
    smeName: "Prof. Amitabha Bhattacharya",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee58"
  },
  {
    courseName: "Principles Of Casting Technology",
    smeName: "Prof. Pradeep Kumar Jha",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-me11"
  },
  {
    courseName: "Principles Of Casting Technology",
    smeName: "Prof. P. K. Jha",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me50"
  },
  {
    courseName: "Principles Of Casting Technology",
    smeName: "Prof. P. K. Jha",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me18"
  },
  {
    courseName: "Principles Of Combing, Roving Preparation & Ring Spinning",
    smeName: "Prof. R Chattopadhyay",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-te07"
  },
  {
    courseName: "Principles Of Communication Systems - I",
    smeName: "Prof. Aditya Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ee03"
  },
  {
    courseName: "Principles Of Communication Systems - I",
    smeName: "Prof. Aditya Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee08"
  },
  {
    courseName: "Principles Of Communication Systems - Part 1",
    smeName: "Prof. Aditya Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ee06"
  },
  {
    courseName: "Principles Of Communication Systems - Part II",
    smeName: "Prof. Aditya K. Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee47"
  },
  {
    courseName: "Principles Of Communication Systems: Part - II",
    smeName: "Prof. Aditya K. Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ee17"
  },
  {
    courseName: "Principles Of Construction Management",
    smeName: "Prof. Sudhir Misra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ce18"
  },
  {
    courseName: "Principles Of Construction Management",
    smeName: "Prof. Sudhir Misra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce15"
  },
  {
    courseName: "Principles Of Construction Management",
    smeName: "Prof. Sudhir Misra",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce29"
  },
  {
    courseName: "Principles Of Digital Communications",
    smeName: "Prof. S. N. Merchant",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee27"
  },
  {
    courseName: "Principles Of Digital Communications",
    smeName: "Prof. Abhishek Dixit",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee05"
  },
  {
    courseName: "Principles Of Downstream Techniques In Bioprocess",
    smeName: "Prof. Mukesh Doble",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Sep-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-bt03"
  },
  {
    courseName: "Principles Of Downstream Techniques In Bioprocess",
    smeName: "Prof. Mukesh Doble",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-bt05"
  },
  {
    courseName: "Principles Of Downstream Techniques In Bioprocess",
    smeName: "Prof. Mukesh Doble",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-bt04"
  },
  {
    courseName: "Principles Of Downstream Techniques In Bioprocess",
    smeName: "Prof. Mukesh Doble",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-bt31"
  },
  {
    courseName: "Principles Of Human Resource Management",
    smeName: "Prof. Aradhana Malik",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-mg03"
  },
  {
    courseName: "Principles Of Human Resource Management",
    smeName: "Prof. Aradhana Malik",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mg13"
  },
  {
    courseName: "Principles Of Human Resource Management",
    smeName: "Prof. Aradhana Malik",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg18"
  },
  {
    courseName: "Principles Of Human Resource Management",
    smeName: "Prof. Aradhana Malik",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg06"
  },
  {
    courseName: "Principles Of Hydraulic Machines And System Design",
    smeName: "Prof. Pranab K. Mondal",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me64"
  },
  {
    courseName: "Principles Of Mechanical Measurement",
    smeName: "Prof. Dipankar N Basu",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me03"
  },
  {
    courseName: "Principles Of Metal Forming Technology",
    smeName: "Prof. Pradeep K. Jha",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me49"
  },
  {
    courseName: "Principles Of Metal Forming Technology",
    smeName: "Prof. Pradeep Kumar Jha",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me52"
  },
  {
    courseName: "Principles Of Modern CDMA/ MIMO/ OFDM Wireless Communications",
    smeName: "Prof. Aditya Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-ec05"
  },
  {
    courseName: "Principles Of Modern CDMA/ MIMO/ OFDM Wireless Communications",
    smeName: "Prof. Aditya Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ec19"
  },
  {
    courseName: "Principles Of Modern CDMA/ MIMO/ OFDM Wireless Communications",
    smeName: "Prof. Aditya K. Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee49"
  },
  {
    courseName: "Principles Of Organic Synthesis",
    smeName: "Prof. T Punniyamurthy",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy23"
  },
  {
    courseName: "Principles Of Polymer Synthesis",
    smeName: "Prof. Rajat K Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mm08"
  },
  {
    courseName:
      "Principles Of Signal Estimation For MIMO/ OFDM Wireless Communication",
    smeName: "Prof. Aditya Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee21"
  },
  {
    courseName: "Principles Of Signals And Systems",
    smeName: "Prof. Aditya Jagannathan",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ee02"
  },
  {
    courseName: "Principles Of Signals And Systems",
    smeName: "Prof. Aditya Jagannathan",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ee07"
  },
  {
    courseName: "Principles Of Vibration Control",
    smeName: "Prof. Bishakh Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-me06"
  },
  {
    courseName: "Principles Of Vibration Control",
    smeName: "Prof. Bishakh Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me07"
  },
  {
    courseName: "Privacy And Security In Online Social Media",
    smeName: "Prof. Ponnurangam Kumaraguru",
    institute: "IIIT Delhi",
    courseDuration: "08 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs07"
  },
  {
    courseName: "Privacy And Security In Online Social Media",
    smeName: "Prof. Ponnurangam. K",
    institute: "IIIT Delhi",
    courseDuration: "08 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs31"
  },
  {
    courseName: "Privacy And Security In Online Social Media",
    smeName: "Prof. Ponnurangam. K",
    institute: "IIIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs25"
  },
  {
    courseName:
      "Probability And Random Variables/ Processes For Wireless Communications",
    smeName: "Prof. Aditya K. Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ee08"
  },
  {
    courseName:
      "Probability And Random Variables/Processes For Wireless Communications",
    smeName: "Prof. Aditya K. Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Sep-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-ec07"
  },
  {
    courseName: "Probability And Statistics",
    smeName: "Prof. Somesh Kumar",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ma03"
  },
  {
    courseName: "Probability And Statistics",
    smeName: "Prof. Somesh Kumar",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ma02"
  },
  {
    courseName: "Probability And Statistics",
    smeName: "Prof. Somesh Kumar",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ma08"
  },
  {
    courseName: "Probability And Stochastics For Finance",
    smeName: "Prof. Joydeep Dutta",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ma02"
  },
  {
    courseName: "Probability And Stochastics For Finance II",
    smeName: "Prof. Joydeep Dutta",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-hs11"
  },
  {
    courseName: "Probability Foundations For Electrical Engineers",
    smeName: "Prof. Andrew Thangaraj, Prof. R. Aravind EE",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ee01"
  },
  {
    courseName: "Probability Methods In Civil Engineering",
    smeName: "Prof. Rajib Maity",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ce03"
  },
  {
    courseName: "Problem Solving Through Programming In C",
    smeName: "Prof. Anupam Basu",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs10"
  },
  {
    courseName: "Problem Solving Through Programming In C",
    smeName: "Prof. Anupam Basu",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs31"
  },
  {
    courseName: "Problem Solving Through Programming In C",
    smeName: "Prof. Anupam Basu",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs06"
  },
  {
    courseName: "Problem Solving Through Programming In C",
    smeName: "Prof. Anupam Basu",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs43"
  },
  {
    courseName: "Process Control - Design, Analysis And Assessment",
    smeName: "Prof. Ragunathan Rengasamy",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ch10"
  },
  {
    courseName: "Processing Of Polymers And Polymer Composites",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-me36"
  },
  {
    courseName: "Processing Of Polymers And Polymer Composites",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me57"
  },
  {
    courseName: "Product Design And Development",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-me16"
  },
  {
    courseName: "Product Design And Development",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me31"
  },
  {
    courseName: "Product Design And Development",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me21"
  },
  {
    courseName: "Product Design And Innovation",
    smeName: "Prof. Supradip Das",
    institute: "IIT Guwahati",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-de02"
  },
  {
    courseName: "Product Design And Manufacturing",
    smeName: "Prof. J. Ramkumar And Prof. Amandeep Singh Oberoi",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me04"
  },
  {
    courseName: "Product Design And Manufacturing",
    smeName: "Prof. J. Ramkumar",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me23"
  },
  {
    courseName: "Product Design Using Value Engineering",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me51"
  },
  {
    courseName: "Programming And Data Structures",
    smeName: "Prof. Narayanaswamy",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-cs01"
  },
  {
    courseName: "Programming In C++",
    smeName: "Prof. Partha Pratim Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs17"
  },
  {
    courseName: "Programming In C++",
    smeName: "Prof. Partha Pratim Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-cs01"
  },
  {
    courseName: "Programming In C++",
    smeName: "Prof. Partha Pratim Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs24"
  },
  {
    courseName: "Programming In C++",
    smeName: "Prof. Partha Pratim Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs32"
  },
  {
    courseName: "Programming In C++",
    smeName: "Prof. Partha Pratim Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs10"
  },
  {
    courseName: "Programming In C++",
    smeName: "Prof. Partha Pratim Das",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs38"
  },
  {
    courseName: "Programming In Java",
    smeName: "Prof. Debasis Samanta",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs07"
  },
  {
    courseName: "Programming In Java",
    smeName: "Prof. Debasis Samanta",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs84"
  },
  {
    courseName: "Programming, Data Structures And Algorithms",
    smeName:
      "Prof. Hema A Murthy, Prof. Shankar Balachandran, Prof. N. S. Narayanaswamy",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Mar-Aug 2014",
    courseLink: "https://nptel.ac.in/noc/courses/noc14/SEM1/noc14-cs01"
  },
  {
    courseName: "Programming, Data Structures And Algorithms",
    smeName:
      "Prof. Hema A Murthy, Prof. Shankar Balachandran, Prof. N. S. Narayanaswamy",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-cs06"
  },
  {
    courseName: "Programming, Data Structures And Algorithms In Python",
    smeName: "Prof. Madhavan Mukund",
    institute: "Chennai Mathematical Institute",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs11"
  },
  {
    courseName: "Programming, Data Structures And Algorithms Using C",
    smeName:
      "Prof. Hema A Murthy, Prof. Shankar Balachandran, Prof. N. S. Narayanaswamy, Prof. Sudarshan Iyengar",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs25"
  },
  {
    courseName: "Programming, Data Structures And Algorithms Using Python",
    smeName: "Prof. Madhavan Mukund",
    institute: "Chennai Mathematical Institute",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-cs10"
  },
  {
    courseName: "Programming, Data Structures And Algorithms Using Python",
    smeName: "Prof. Madhavan Mukund",
    institute: "Chennai Mathematical Institute",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs28"
  },
  {
    courseName: "Programming, Data Structures And Algorithms Using Python",
    smeName: "Prof. Madhavan Mukund",
    institute: "Chennai Mathematical Institute",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs21"
  },
  {
    courseName: "Programming, Data Structures And Algorithms Using Python",
    smeName: "Prof. Madhavan Mukund",
    institute: "Chennai Mathematical Institute",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs34"
  },
  {
    courseName: "Programming, Data Structures And Algorithms Using Python",
    smeName: "Prof. Madhavan Mukund",
    institute: "Chennai Mathematical Institute",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs08"
  },
  {
    courseName: "Programming, Data Structures And Algorithms Using Python",
    smeName: "Prof. Madhavan Mukund",
    institute: "Chennai Mathematical Institute",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs40"
  },
  {
    courseName: "Project Management",
    smeName: "Prof. Raghunandan Sengupta",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mg01"
  },
  {
    courseName: "Project Management",
    smeName: "Prof. Raghunandan Sengupta",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg08"
  },
  {
    courseName: "Project Management",
    smeName: "Prof. Raghunandan Sengupta",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg30"
  },
  {
    courseName: "Project Management For Managers",
    smeName: "Prof. Mukesh Kumar Barua",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mg17"
  },
  {
    courseName: "Project Management For Managers",
    smeName: "Prof. Mukesh Kumar Barua",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg28"
  },
  {
    courseName: "Project Management For Managers",
    smeName: "Prof. Mukesh Kumar Barua",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg31"
  },
  {
    courseName: "Project Planning & Control",
    smeName: "Prof. Koshy Varghese",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-ce02"
  },
  {
    courseName: "Project Planning & Control",
    smeName: "Prof. Koshy Varghese",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce30"
  },
  {
    courseName: "Project Planning And Control",
    smeName: "Prof. Koshy Varghese",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ce06"
  },
  {
    courseName: "Project Planning And Control",
    smeName: "Prof. Koshy Varghese",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ce16"
  },
  {
    courseName: "Project Planning And Control",
    smeName: "Prof. Koshy Varghese",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce28"
  },
  {
    courseName: "Proteins And Gel-Based Proteomics",
    smeName: "Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Sep-Nov 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-bt04"
  },
  {
    courseName: "Proteins And Gel-Based Proteomics",
    smeName: "Prof. Prof. Sanjeeva Srivastava",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Mar-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-bt04"
  },
  {
    courseName: "Psychiatry - An Overview",
    smeName: "Prof. Alok Bajpai",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Mar-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-hs04"
  },
  {
    courseName: "Psychiatry - An Overview",
    smeName: "Prof. Alok Bajpai",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs03"
  },
  {
    courseName: "Psychiatry - An Overview",
    smeName: "Prof. Alok Bajpai",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs17"
  },
  {
    courseName: "Psychology Of Everyday",
    smeName: "Prof. Braj Bhushan And Prof. Alok Bajpai",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs56"
  },
  {
    courseName: "Python For Data Science",
    smeName: "Prof. Raghunathan Rengasamy",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs59"
  },
  {
    courseName: "Qualitative Research Methods",
    smeName: "Prof. Aradhna Malik",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-hs07"
  },
  {
    courseName: "Qualitative Research Methods And Research Writing",
    smeName: "Prof. Aradhna Malik",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ge05"
  },
  {
    courseName: "Quality Design And Control",
    smeName: "Prof. Pradip Kumar Ray",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg02"
  },
  {
    courseName: "Quality Design And Control",
    smeName: "Prof. Pradip Kumar Ray",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg18"
  },
  {
    courseName: "Quantitative Finance",
    smeName: "Prof. Raghunandan Sengupta",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-mg08"
  },
  {
    courseName: "Quantum Computing",
    smeName: "Prof. Debabrata Goswami",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-cy04"
  },
  {
    courseName: "Quantum Computing",
    smeName: "Prof. Debabrata Goswami",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cy07"
  },
  {
    courseName: "Quantum Computing",
    smeName: "Prof. Debabrata Goswami",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy31"
  },
  {
    courseName: "Quantum Information And Computing",
    smeName: "Prof. Dipan Ghosh",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ph01"
  },
  {
    courseName: "Quantum Information And Computing",
    smeName: "Prof. Dipan Ghosh",
    institute: "IIT Bombay",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ph05"
  },
  {
    courseName: "Quantum Mechanics I",
    smeName: "Prof. P. Ramadevi",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ph03"
  },
  {
    courseName: "Quantum Physics",
    smeName: "Prof. V. Balakrishnan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Feb-May 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ph04"
  },
  {
    courseName: "RAC Product Design",
    smeName: "Prof. Sanjeev Jain",
    institute: "IIT Delhi",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me42"
  },
  {
    courseName: "Radiative Heat Transfer",
    smeName: "Prof. Ankit Bansal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me08"
  },
  {
    courseName: "Randomized Algorithms",
    smeName: "Prof. Benny George K",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs16"
  },
  {
    courseName: "Rapid Manufacturing",
    smeName: "Prof. J. Ramkumar",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me24"
  },
  {
    courseName: "Reactive Intermediates Carbene And Nitrene",
    smeName: "Prof. Rajarshi Samanta",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cy14"
  },
  {
    courseName: "Reagents In Organic Synthesis",
    smeName: "Prof. Subhas Chandra Pan",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy24"
  },
  {
    courseName: "Real Time Operating System",
    smeName: "Prof. Rajib Mall",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs12"
  },
  {
    courseName: "Real Time Operating System",
    smeName: "Prof. Rajib Mall",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs21"
  },
  {
    courseName: "Recent Advances In Transmission Insulators",
    smeName: "Prof. Subba Reddy B",
    institute: "IISc Bangalore",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee17"
  },
  {
    courseName: "Refrigeration And Air-conditioning",
    smeName: "Prof. Ravi Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-me12"
  },
  {
    courseName: "Refrigeration And Air-Conditioning",
    smeName: "Prof. Ravi Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mm14"
  },
  {
    courseName: "Refrigeration And Air-Conditioning",
    smeName: "Prof. Ravi Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me46"
  },
  {
    courseName: "Refrigeration And Air-conditioning",
    smeName: "Prof. Ravi Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me58"
  },
  {
    courseName: "Regression Analysis",
    smeName: "Prof. Soumen Maity",
    institute: "IISER Pune",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ma10"
  },
  {
    courseName: "Regression Analysis",
    smeName: "Prof. Soumen Maity",
    institute: "IISER Pune",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ma20"
  },
  {
    courseName: "Regression Analysis",
    smeName: "Prof. Soumen Maity",
    institute: "IISER Pune",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma23"
  },
  {
    courseName: "Regression Analysis",
    smeName: "Prof. Soumen Maity",
    institute: "IISER Pune",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma32"
  },
  {
    courseName: "Regulatory Requirements For Medical Devices And IVDs In India",
    smeName: "Prof. Malay Mitra, Prof. Arun B. Ramteke",
    institute: "CDSA THSTI DBT",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ge14"
  },
  {
    courseName: "Reinforced Concrete Road Bridges",
    smeName: "Prof. Nirjhar Dhang",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ce24"
  },
  {
    courseName: "Reinforced Concrete Road Bridges",
    smeName: "Prof. Nirjhar Dhang",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce23"
  },
  {
    courseName: "Reinforced Concrete Road Bridges",
    smeName: "Prof. Nirjhar Dhang",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce23"
  },
  {
    courseName: "Reinforcement Learning",
    smeName: "PROF. BALARAMAN RAVINDRAN",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs09"
  },
  {
    courseName: "Reinforcement Learning",
    smeName: "PROF. BALARAMAN RAVINDRAN",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs27"
  },
  {
    courseName: "Reinforcement Learning",
    smeName: "PROF. BALARAMAN RAVINDRAN",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs55"
  },
  {
    courseName: "Remote Sensing And Digital Image Processing Of Satellite Data",
    smeName: "Prof. Arun K. Saraf",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce34"
  },
  {
    courseName: "Remote Sensing And Digital Image Processing Of Satellite Data",
    smeName: "Prof. Arun K. Saraf",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce38"
  },
  {
    courseName: "Remote Sensing And GIS",
    smeName: "Prof. Rishikesh Bharti",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce41"
  },
  {
    courseName: "Research Writing",
    smeName: "Prof. Aradhna Malik",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg13"
  },
  {
    courseName: "Rheology Of Complex Materials",
    smeName: "Prof. Abhijit P. Deshpande",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch07"
  },
  {
    courseName: "Riemann Hypothesis And Its Applications",
    smeName: "Prof. Manindra Agrawal",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-cs08"
  },
  {
    courseName: "Risk And Reliability Of Offshore Structures",
    smeName: "Prof. Srinivasan Chandrasekaran",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-oe01"
  },
  {
    courseName: "Risk And Reliability Of Offshore Structures",
    smeName: "Prof. Srinivasan Chandrasekaran",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-oe03"
  },
  {
    courseName: "Roadmap For Patent Creation",
    smeName: "Prof. Gouri Gargate",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ge09"
  },
  {
    courseName: "Robotics",
    smeName: "Prof. DK Pratihar",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me61"
  },
  {
    courseName: "Robotics",
    smeName: "Prof. DK Pratihar",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me74"
  },
  {
    courseName: "Role Of Craft And Technology In Interior - Architecture",
    smeName: "Prof. Smriti Saraswat",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ar15"
  },
  {
    courseName: "Role Of Craft And Technology In Interior - Architecture",
    smeName: "Prof. Smriti Saraswat",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ar15"
  },
  {
    courseName: "Sales And Distribution Management",
    smeName: "Prof. Sangeeta Sahney",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg07"
  },
  {
    courseName: "Satellite Attitude Dynamics And Control",
    smeName: "Prof. Manoranjan Sinha",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ae04"
  },
  {
    courseName: "Satellite Communication",
    smeName: "Prof. Kalyan Kumar Bandyopadhyay",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ec14"
  },
  {
    courseName: "Satellite Communication Systems",
    smeName: "Prof. Kalyankumar Bandyopadhyay",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ec10"
  },
  {
    courseName: "Scalable Data Science",
    smeName: "Prof. Anirban Dasgupta And Prof. Sourangshu Bhattacharya",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs39"
  },
  {
    courseName: "Scalable Data Science",
    smeName: "Prof. Anirban Dasgupta And Prof. Sourangshu Bhattacharya",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs61"
  },
  {
    courseName: "Scheduling Techniques In Projects",
    smeName: "Prof. J. Uma Maheswari",
    institute: "IIT Delhi",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce24"
  },
  {
    courseName: "Science And Technology Of Weft And Warp Knitting",
    smeName: "Prof. Bipin Kumar",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-te10"
  },
  {
    courseName: "Science Of Clothing Comfort",
    smeName: "Prof. Apurba Das",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-de05"
  },
  {
    courseName: "Science Of Clothing Comfort",
    smeName: "Prof. Apurba Das",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-te08"
  },
  {
    courseName: "Science, Technology And Society",
    smeName: "Prof. Sambit Mallick",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-hs26"
  },
  {
    courseName: "Selected Topics In Decision Modeling",
    smeName: "Prof. Biswajit Mahanty",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg32"
  },
  {
    courseName: "Selected Topics In Mathematical Physics",
    smeName: "Prof. V. Balakrishnan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Feb-May 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ph06"
  },
  {
    courseName:
      "Selection Of Nanomaterials For Energy Harvesting And Storage Application",
    smeName: "Prof. Kaushik Pal",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me73"
  },
  {
    courseName: "Semiconductor Devices And Circuits",
    smeName: "Prof. Sanjiv Sambandan",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ee32"
  },
  {
    courseName: "Semiconductor Optoelectronics",
    smeName: "Prof. M. R. Shenoy",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ph05"
  },
  {
    courseName: "Semiconductors Optoelectronics",
    smeName: "Prof. M. R. Shenoy",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ph07"
  },
  {
    courseName: "Sensors And Actuators",
    smeName: "Prof Hardik J Pandya",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ee41"
  },
  {
    courseName: "Services Marketing: A Practical Approach",
    smeName: "Prof. Biplab Datta",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mg09"
  },
  {
    courseName: "Services Marketing: A Practical Approach",
    smeName: "Prof. Biplab Datta",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg16"
  },
  {
    courseName: "Services Marketing: A Practical Approach",
    smeName: "Prof. Biplab Datta",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg09"
  },
  {
    courseName: "Short Fiction In Indian Literature",
    smeName: "Prof. Divya. A",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-hs46"
  },
  {
    courseName: "Short Fiction In Indian Literature",
    smeName: "Prof. Divya A",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs48"
  },
  {
    courseName: "Simulation Of Business Systems: An Applied Approach",
    smeName: "Prof. Deepu Philip",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg37"
  },
  {
    courseName: "Six Sigma",
    smeName: "Prof. Jitesh J Thakkar & Prof. Tapan Bagchi",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mg08"
  },
  {
    courseName: "Six Sigma",
    smeName: "Prof. T. P. Bagchi And Prof. Jitesh J Thakkar",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mg23"
  },
  {
    courseName: "Six Sigma",
    smeName: "Prof. Jitesh J Thakkar & Prof. Tapan Bagchi",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg14"
  },
  {
    courseName: "Six Sigma",
    smeName: "Prof. Jitesh J. Thakkar",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg17"
  },
  {
    courseName: "Smart Materials And Intelligent System Design",
    smeName: "Prof. Bisakh Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me60"
  },
  {
    courseName: "Smart Materials And Intelligent System Design",
    smeName: "Prof. Bisakh Bhattacharya",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me68"
  },
  {
    courseName: "Social Networks",
    smeName: "Prof. Sudarshan Iyengar",
    institute: "IIT Ropar",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs41"
  },
  {
    courseName: "Social Networks",
    smeName: "Prof. Sudarshan Iyengar",
    institute: "IIT Ropar",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs02"
  },
  {
    courseName: "Social Networks",
    smeName: "Prof. Rishi Ranjan Singh & Prof. Sudarshan Iyengar",
    institute: "IIT Ropar",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs56"
  },
  {
    courseName: "Social Networks",
    smeName: "Prof. Rishi Ranjan Singh & Prof. Sudarshan Iyengar",
    institute: "IIT Ropar",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cs30"
  },
  {
    courseName: "Social Networks",
    smeName: "Prof. Poonam Saini, Prof. Sudarshan Iyengar",
    institute: "IIT Ropar",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs66"
  },
  {
    courseName: "Sociological Perspectives On Modernity",
    smeName: "Prof. Sambit Mallick",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs15"
  },
  {
    courseName: "Sociology Of Science",
    smeName: "Prof. Aninday Jayant Mishra",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs09"
  },
  {
    courseName: "Sociology Of Science",
    smeName: "Prof. Aninday Jayant Mishra",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs24"
  },
  {
    courseName: "Soft Nano Technology",
    smeName: "Prof. Rabibrata Mukherjee",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ch06"
  },
  {
    courseName: "Soft Nano Technology",
    smeName: "Prof. Rabibrata Mukherjee",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch16"
  },
  {
    courseName: "Soft Skill Development",
    smeName: "Prof. Priyadarshi Patnaik, Prof. V. N. Giri",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-hs15"
  },
  {
    courseName: "Soft Skills",
    smeName: "Prof. Binod Mishra",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-hs02"
  },
  {
    courseName: "Soft Skills",
    smeName: "Prof. Binod Mishra",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-hs29"
  },
  {
    courseName: "Soft Skills",
    smeName: "Prof. Binod Mishra",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs33"
  },
  {
    courseName:
      "Soft Skills For Business Negotiations And Marketing Strategies",
    smeName: "Prof. Uttam Kumar Banerjee",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg10"
  },
  {
    courseName:
      "Soft Skills For Business Negotiations And Marketing Strategies",
    smeName: "Prof. Uttam Kumar Banerjee",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg11"
  },
  {
    courseName: "Software Engineering",
    smeName: "Prof. Rajib Mall",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs43"
  },
  {
    courseName: "Software Engineering",
    smeName: "Prof. Rajib Mall",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs69"
  },
  {
    courseName: "Software Project Management",
    smeName: "Prof. RAJIB MALL, Prof. DURGA PRASAD MOHAPATRA",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs70"
  },
  {
    courseName: "Software Testing",
    smeName: "Prof. Rajib Mall",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs16"
  },
  {
    courseName: "Software Testing",
    smeName: "Prof. Meenakshi D'souza",
    institute: "IIIT Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs32"
  },
  {
    courseName: "Software Testing",
    smeName: "Prof. Meenakshi D'souza",
    institute: "IIIT Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs42"
  },
  {
    courseName: "Software Testing",
    smeName: "Prof. Meenakshi D'souza",
    institute: "IIIT Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs71"
  },
  {
    courseName: "Soil And Water Conservation Engineering",
    smeName: "Prof. Rajendra Singh",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ar09"
  },
  {
    courseName: "Soil Mechanics / Geotechnical Engineering I",
    smeName: "Prof. Dilip Kumar Baidya",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ce01"
  },
  {
    courseName: "Soil Mechanics/Geotechnical Engineering I",
    smeName: "Prof. Dilip Kumar Baidya",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ce05"
  },
  {
    courseName: "Soil Science And Technology",
    smeName: "Prof. Somsubhra Chakraborty",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ar02"
  },
  {
    courseName: "Solar Photovoltaics Fundamentals, Technology And Applications",
    smeName: "Prof. Soumitra Satapathi",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ph13"
  },
  {
    courseName: "Solar Photovoltaics: Principles, Technologies & Materials",
    smeName: "Prof. Ashish Garg",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mm04"
  },
  {
    courseName: "Solid Mechanics",
    smeName: "Prof. Ajeet Kumar",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me43"
  },
  {
    courseName: "Solid State Chemistry",
    smeName: "Prof. Madhav Ranganathan",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cy16"
  },
  {
    courseName: "Solid State Devices",
    smeName: "Prof. S. Karmalkar",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ec04"
  },
  {
    courseName: "Solid State Physics",
    smeName: "Prof. Amal Kumar Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ph08"
  },
  {
    courseName: "Solid State Physics",
    smeName: "Prof. Amal Kumar Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ph08"
  },
  {
    courseName: "Solid State Physics",
    smeName: "Prof. Amal Kumar Das",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ph14"
  },
  {
    courseName: "Spatial Informatics",
    smeName: "Prof. SOUMYA K GHOSH",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs76"
  },
  {
    courseName: "Speaking Effectively",
    smeName: "Prof. Anjali Gera Roy",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-hs15"
  },
  {
    courseName: "Speaking Effectively",
    smeName: "Prof. Anjali Gera Roy",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs12"
  },
  {
    courseName: "Speaking Effectively",
    smeName: "Prof. Anjali Gera Roy",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs21"
  },
  {
    courseName: "Special Topics In Atomic Physics",
    smeName: "Prof. P. C. Deshmukh",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ph03"
  },
  {
    courseName: "Special Topics In Classical Mechanics",
    smeName: "Prof. P. C. Deshmukh",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ph02"
  },
  {
    courseName:
      "Special/Select Topics In The Theory Of Atomic Collisions And Spectroscopy",
    smeName: "Prof. P. C. Deshmukh",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ph09"
  },
  {
    courseName:
      "Spectroscopic Techniques For Pharmaceutical And Biopharmaceutical Industries",
    smeName: "Prof. Shashank Deep",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy29"
  },
  {
    courseName: "Spray Theory",
    smeName: "Prof. Mahesh V Panchagnula",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me34"
  },
  {
    courseName: "Spread Spectrum Communications And Jamming",
    smeName: "Prof. Debarati Sen",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ec01"
  },
  {
    courseName: "Spur And Helical Gear Cutting",
    smeName: "Prof. Asimava Roychoudhury",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mm15"
  },
  {
    courseName: "Statistical Inference",
    smeName: "Prof. Nilladri Chaterjee",
    institute: "IIT Delhi",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma22"
  },
  {
    courseName: "Statistical Inference",
    smeName: "Prof. Somesh Kumar",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ma09"
  },
  {
    courseName: "Statistical Mechanics",
    smeName: "Prof. Ashwin Joy",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ph06"
  },
  {
    courseName: "Steam And Gas Power Systems",
    smeName: "Prof. Ravi Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-me12"
  },
  {
    courseName: "Steam And Gas Power Systems",
    smeName: "Prof. Ravi Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me34"
  },
  {
    courseName: "Steam And Gas Power Systems",
    smeName: "Prof. Ravi Kumar",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me09"
  },
  {
    courseName: "Steam Power Engineering",
    smeName: "Prof. Vinayak N. Kulkarni",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me63"
  },
  {
    courseName:
      "Steel Quality : Role Of Secondary Refining & Continuous Casting",
    smeName: "Prof. Santanu Kr. Ray",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mm10"
  },
  {
    courseName:
      "Steel Quality : Role Of Secondary Refining & Continuous Casting",
    smeName: "Prof. Santanu Kr. Ray",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mm16"
  },
  {
    courseName: "Stereochemistry",
    smeName: "Prof. Amit Basak",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cy11"
  },
  {
    courseName: "Stereochemistry",
    smeName: "Prof. Amit Basak",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cy11"
  },
  {
    courseName: "Stereochemistry",
    smeName: "Prof. Amit Basak",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy25"
  },
  {
    courseName: "Stochastic Processes",
    smeName: "Prof. Dharmaraja",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ma09"
  },
  {
    courseName: "Stochastic Processes",
    smeName: "Prof. S. Dharamraja",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ma06"
  },
  {
    courseName: "Stochastic Processes",
    smeName: "Prof. S Dharmaraja",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ma30"
  },
  {
    courseName: "Stochastic Processes - 1",
    smeName: "Prof. S. Dharamraja",
    institute: "IIT Delhi",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ma08"
  },
  {
    courseName: "Strategic Communication For Sustainable Development",
    smeName: "Prof. Aradhna Malik",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Sep-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-mg07"
  },
  {
    courseName: "Strategic Marketing - Contemporary Issues",
    smeName: "Prof. Jayanta Chatterjee",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Apr-Jun 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-mg03"
  },
  {
    courseName: "Strategic Performance Management",
    smeName: "Prof. Kbl Srivastava",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-hs14"
  },
  {
    courseName: "Strategy: An Introduction To Game Theory",
    smeName: "Prof. Aditya Jagannatham, Prof. Vimal Kumar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-mg02"
  },
  {
    courseName: "Strategy: An Introduction To Game Theory",
    smeName: "Prof. Aditya Jagannatham",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-mg01"
  },
  {
    courseName: "Strategy: An Introduction To Game Theory",
    smeName: "Prof. Aditya K. Jagannatham & Prof. Vimal Kumar",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mg11"
  },
  {
    courseName: "Strength Of Materials",
    smeName: "Prof. Sriman Kumar Bhattacharya",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ce22"
  },
  {
    courseName: "Strength Of Materials",
    smeName: "Prof. Sriman Kr Bhattacharya",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce17"
  },
  {
    courseName: "Strength Of Materials",
    smeName: "Prof. Sriman Kumar Bhattacharyya",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce18"
  },
  {
    courseName: "Stress Management",
    smeName: "Prof. Rajlakshmi Guha",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Sep-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ge04"
  },
  {
    courseName: "Stress Management",
    smeName: "Prof. Rajlakshmi Guha",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ge18"
  },
  {
    courseName: "Stress Management",
    smeName: "Prof. Rajlakshmi Guha",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ge26"
  },
  {
    courseName: "Structural Analysis - I",
    smeName: "Prof. Amit Shaw",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ce25"
  },
  {
    courseName: "Structural Analysis Of Nanomaterials",
    smeName: "Prof. Kaushik Pal",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mm13"
  },
  {
    courseName: "Structural Analysis Of Nanomaterials",
    smeName: "Prof. Kaushik Pal",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mm22"
  },
  {
    courseName: "Structural Analysis-I",
    smeName: "Prof. Amit Shaw",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce26"
  },
  {
    courseName: "Structural Dynamics",
    smeName: "Prof. Ramancharala Pradeep Kumar",
    institute: "IIIT Hyderabad",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ce08"
  },
  {
    courseName: "Structural Dynamics For Civil Engineers - SDOF Systems",
    smeName: "Prof. Riya Catherine George",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce27"
  },
  {
    courseName: "Structural Geology",
    smeName: "Prof. Santanu Misra",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce47"
  },
  {
    courseName: "Structural Health Monitoring",
    smeName: "Prof. Srinivas Chandrasekaran",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-oe05"
  },
  {
    courseName: "Subsurface Exploration : Importance And Techniques Involved",
    smeName: "Prof. Abhishek Kumar",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ce10"
  },
  {
    courseName: "Supply Chain Analytics",
    smeName: "Prof. Rajat Agrawal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mg12"
  },
  {
    courseName: "Supply Chain Analytics",
    smeName: "Prof. Rajat Agrawal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg20"
  },
  {
    courseName: "Supply Chain Analytics",
    smeName: "Prof. Rajat Agrawal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg21"
  },
  {
    courseName:
      "Surface Engineering For Corrosion And Wear Resistance Application",
    smeName: "Prof. Indranil Manna, Prof. JyotsnaDuttaMajumdar",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mm06"
  },
  {
    courseName: "Surface Engineering Of Nanomaterials",
    smeName: "Prof. Kaushik Pal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mm05"
  },
  {
    courseName: "Surface Engineering Of Nanomaterials",
    smeName: "Prof. Kaushik Pal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me36"
  },
  {
    courseName: "Surface Engineering Of Nanomaterials",
    smeName: "Prof. Kaushik Pal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me30"
  },
  {
    courseName: "Surrogates And Approximations In Engineering Design",
    smeName: "Prof. Palaniappaan Ramu",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me67"
  },
  {
    courseName:
      "Sustainability Through Green Manufacturing Systems: An Applied Approach",
    smeName: "Prof. Deepu Philip, Prof. Amandeep Singh",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-me33"
  },
  {
    courseName:
      "Sustainability Through Green Manufacturing Systems: An Applied Approach",
    smeName: "Prof. Deepu Philip/Prof. Amandeep Singh",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg38"
  },
  {
    courseName:
      "Sustainable And Affordable Sanitation Solutions For Small Towns: Policy, Planning And Practice",
    smeName: "Prof. N. C. Narayanan",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ge29"
  },
  {
    courseName: "Sustainable Engineering Concepts And Life Cycle Analysis",
    smeName: "Prof. Brajesh Kumar Dubey",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ce08"
  },
  {
    courseName: "Sustainable Materials And Green Buildings",
    smeName: "Prof. B Bhattacharjee",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce40"
  },
  {
    courseName: "Sustainable River Basin Management",
    smeName: "Prof. Franziska Steinbruch",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM2/noc15-ce03"
  },
  {
    courseName: "Switching Circuits And Logic Design",
    smeName: "Prof. Indranil Sengupta",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs30"
  },
  {
    courseName: "Switching Circuits And Logic Design",
    smeName: "Prof. Indranil Sengupta",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs74"
  },
  {
    courseName: "Symbolic Logic",
    smeName: "Prof. Chhanda Chakraborti",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-hs16"
  },
  {
    courseName: "Symbolic Logic",
    smeName: "Prof. Chhanda Chakraborti",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ge17"
  },
  {
    courseName: "Symmetry And Group Theory",
    smeName: "Prof. Anindya Datta",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cy15"
  },
  {
    courseName: "Symmetry And Structure In The Solid State",
    smeName: "Prof. T. N. Guru Row",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-cy17"
  },
  {
    courseName: "Synthesis Of Digital Systems",
    smeName: "Prof. Preeti Ranjan Panda",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs11"
  },
  {
    courseName: "Synthesis Of Digital Systems",
    smeName: "Prof. Preeti Ranjan Panda",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs73"
  },
  {
    courseName: "System Design For Sustainability",
    smeName: "Prof. Sharmistha Banerjee",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-de01"
  },
  {
    courseName: "System Design For Sustainability",
    smeName: "Prof. Sharmistha Banerjee",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-de03"
  },
  {
    courseName: "Systems Engineering: Theory & Practice",
    smeName: "Prof. Deepu Philip",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-mg02"
  },
  {
    courseName: "Systems Engineering: Theory & Practice",
    smeName: "Prof. Deepu Philip",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg06"
  },
  {
    courseName: "Systems Engineering: Theory & Practice",
    smeName: "Prof. Deepu Philip",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg25"
  },
  {
    courseName: "TALE 2: Course Design And Instruction Of Engineering Course",
    smeName: "Prof. N J Rao And Prof K Rajani Kanth",
    institute: "IISc Bangalore",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ge17"
  },
  {
    courseName: "Teaching And Learning In Engineering (TALE)",
    smeName: "Prof. N J Rao",
    institute: "IISc Bangalore",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ge04"
  },
  {
    courseName: "Teaching And Learning In General Programs: TALG",
    smeName: "Prof. N J Rao",
    institute: "IISc Bangalore",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ge16"
  },
  {
    courseName: "Technical English For Engineers",
    smeName: "Prof. Aysha Iqbal",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-hs01"
  },
  {
    courseName: "Technical English For Engineers",
    smeName: "Prof. Aysha Iqbal",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-hs19"
  },
  {
    courseName: "Technical English For Engineers",
    smeName: "Prof. Aysha Iqbal",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-hs27"
  },
  {
    courseName: "Technical English For Engineers",
    smeName: "Prof. Aysha Iqbal",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs31"
  },
  {
    courseName: "Techniques In Inorganic Chemistry",
    smeName: "Prof. Harinath Chakrapani",
    institute: "IISER PUNE",
    courseDuration: "",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/lab19/SEM1/lab19-cy05"
  },
  {
    courseName: "Techniques In Organic Chemistry",
    smeName: "Prof. Harinath Chakrapani",
    institute: "IISER PUNE",
    courseDuration: "",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/lab19/SEM1/lab19-cy01"
  },
  {
    courseName: "Techniques In Organic Chemistry (Advanced)",
    smeName: "Prof. Harinath Chakrapani",
    institute: "IISER PUNE",
    courseDuration: "",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/lab19/SEM1/lab19-cy04"
  },
  {
    courseName: "Technologies For Clean And Renewable Energy Production",
    smeName: "Prof. P. Mondal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ch26"
  },
  {
    courseName: "Technology Transfer Through Joint Venture",
    smeName: "Prof. Indrajit Dube",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Mar-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-hs05"
  },
  {
    courseName: "Testing Of Functional And Technical Textiles",
    smeName: "Prof. Apurba Das",
    institute: "IIT Delhi",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-te02"
  },
  {
    courseName: "Text, Textuality And Digital Media",
    smeName: "Prof. Arjun Ghosh",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs54"
  },
  {
    courseName: "Textile Finishing",
    smeName: "Prof. Kushal Sen",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-te06"
  },
  {
    courseName: "Textured Yarn Technology",
    smeName: "Prof. KUSHAL SEN",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-te05"
  },
  {
    courseName: "The Ethical Corporation",
    smeName: "Prof Chhanda Chakraborti",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg56"
  },
  {
    courseName: "The Joy Of Computing Using Python",
    smeName: "Prof. Sudarshan Iyengar",
    institute: "IIT Ropar",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-cs35"
  },
  {
    courseName: "The Joy Of Computing Using Python",
    smeName: "Prof. Sudarshan Iyengar",
    institute: "IIT Ropar",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs41"
  },
  {
    courseName: "The Nineteenth-Century English Novel",
    smeName: "Prof. DIVYA A",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-hs23"
  },
  {
    courseName: "The Psychology Of Language",
    smeName: "Prof. Naveen Kashyap",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs44"
  },
  {
    courseName: "The Renaissance And Shakespeare",
    smeName: "Prof. Shormishtha Panja",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-hs18"
  },
  {
    courseName: "The Victorian Gothic Short Story",
    smeName: "Prof. Divya A",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs49"
  },
  {
    courseName: "Theoretical Mechanics",
    smeName: "Prof. Charudatt Kadolkar",
    institute: "IIT Guwahati",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ph15"
  },
  {
    courseName: "Theory And Practice Of Non Destructive Testing",
    smeName: "Prof. Ranjit Bauri",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-mm07"
  },
  {
    courseName: "Theory And Practice Of Non Destructive Testing",
    smeName: "Prof. Ranjit Bauri",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mm04"
  },
  {
    courseName: "Theory And Practice Of Non Destructive Testing",
    smeName: "Prof. Ranjit Bauri",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mm07"
  },
  {
    courseName: "Theory Of Computation",
    smeName: "Prof. Raghunath Tewari",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-cs14"
  },
  {
    courseName: "Theory Of Computation",
    smeName: "Prof. Raghunath Tewari",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs34"
  },
  {
    courseName: "Theory Of Computation",
    smeName: "Prof. Raghunath Tewari",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cs79"
  },
  {
    courseName: "Theory Of Elasticity",
    smeName: "Prof. Amit Shaw & Prof. Biswanath Banjerjee",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce18"
  },
  {
    courseName: "Theory Of Groups For Physics Applications",
    smeName: "Prof. Urjit A. Yajnik",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ph11"
  },
  {
    courseName: "Theory Of Production Processes",
    smeName: "Prof. Pradeep K. Jha",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me27"
  },
  {
    courseName: "Theory Of Rectangular Plates -Part1",
    smeName: "Prof. Poonam Kumari",
    institute: "IIT Guwahati",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me65"
  },
  {
    courseName: "Theory Of Yarn Structure",
    smeName: "Prof. Dipayan Das",
    institute: "IIT Delhi",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-te03"
  },
  {
    courseName:
      "Thermal Operations In Food Process Engineering: Theory And Applications",
    smeName: "Prof. Tridib Kumar Goswami",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ag06"
  },
  {
    courseName: "Thermal Processing Of Foods",
    smeName: "Prof. R. Anandalakshmi",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ag07"
  },
  {
    courseName: "Thermo-Mechanical And Thermo-Chemical Processes",
    smeName: "Prof. Vivek Pancholi & Prof. S. R. Meka",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mm17"
  },
  {
    courseName: "Thermodynamics",
    smeName: "Prof. S. R. KALE",
    institute: "IIT Delhi",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me12"
  },
  {
    courseName: "Thermodynamics Of Fluid Phase Equilibria",
    smeName: "Prof. Jayant Singh",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch01"
  },
  {
    courseName: "Thermodynamics Of Fluid Phase Equilibria",
    smeName: "Prof. Jayant Singh",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ch15"
  },
  {
    courseName: "Thermodynamics: Classical To Statistical",
    smeName: "Prof. Sandip Paul",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy32"
  },
  {
    courseName: "Time Value Of Money Concepts And Calculations",
    smeName: "Prof. Bikash Mohanty",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Sep-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-hs24"
  },
  {
    courseName: "Tissue Engineering",
    smeName: "Prof. Vignesh Muthuvijayan",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-bt33"
  },
  {
    courseName: "Total Quality Management - I",
    smeName: "Prof. Raghunandan Sengupta",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mg18"
  },
  {
    courseName: "Total Quality Management - I",
    smeName: "Prof. Raghunandan Sengupta",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg39"
  },
  {
    courseName: "Total Quality Management - II",
    smeName: "Prof. Raghunandan Sengupta",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-mg04"
  },
  {
    courseName: "Total Quality Management - II",
    smeName: "Prof. Raghunandan Sengupta",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mg19"
  },
  {
    courseName: "Toyota Production System",
    smeName: "Prof. Rajat Agrawal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg57"
  },
  {
    courseName:
      "Trace And Ultratrace Element Determination Of Metal Ions By Atomic Absorption Spectrometry",
    smeName: "Prof. J. R. Mudakavi",
    institute: "IISc Bangalore",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ch07"
  },
  {
    courseName: "Traditional And Non-Traditional Optimization Tools",
    smeName: "Prof. Dilip Kumar Pratihar",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me17"
  },
  {
    courseName: "Training Of Trainers",
    smeName: "Prof. Santosh Rangnekar",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg32"
  },
  {
    courseName:
      "Transform Calculus And Its Applications In Differential Equations",
    smeName: "Prof. ADRIJIT GOSWAMI",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ma04"
  },
  {
    courseName: "Transform Techniques For Engineers",
    smeName: "Prof. Manam",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ma12"
  },
  {
    courseName:
      "Transition Metal Organometallic Chemistry: Principles To Applications",
    smeName: "Prof. P. Ghosh",
    institute: "IIT Bombay",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cy02"
  },
  {
    courseName: "Transport Phenomena",
    smeName: "Prof. Sunando Dasgupta",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ch11"
  },
  {
    courseName: "Transport Phenomena In Materials",
    smeName: "Prof. Gandham Phanikumar",
    institute: "IIT Madras",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me09"
  },
  {
    courseName: "Transport Phenomena In Materials",
    smeName: "Prof. Gandham Phanikumar",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mm25"
  },
  {
    courseName: "Transport Phenomena Of Non-Newtonian Fluids",
    smeName: "Prof. Nanda Kishore",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ch11"
  },
  {
    courseName: "Transport Processes I: Heat And Mass Transfer",
    smeName: "Prof. V. Kumaran",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ch02"
  },
  {
    courseName: "Transport Processes I: Heat And Mass Transfer",
    smeName: "Prof. V. Kumaran",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch14"
  },
  {
    courseName: "Turbulent Combustion: Theory And Modelling",
    smeName: "Prof. Ashok De",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me64"
  },
  {
    courseName: "Two Phase Flow And Heat Transfer",
    smeName: "Prof. Arup Kumar Das",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-me11"
  },
  {
    courseName: "Two Phase Flow And Heat Transfer",
    smeName: "Prof. Arup Kumar Das",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-me32"
  },
  {
    courseName:
      "Two-Phase Flow With Phase Change In Conventional And Miniature Channels",
    smeName: "Prof. Manmohan Pandey",
    institute: "IIT Guwahati",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me54"
  },
  {
    courseName: "Ultrafast Optics And Spectroscopy",
    smeName: "Prof. Atanu Bhattacharya, Prof. K. S. Mallikarjuna Rao",
    institute: "IISc Bangalore",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-cy28"
  },
  {
    courseName: "Understanding Design",
    smeName: "Prof. Nina Sabnani",
    institute: "IIT Bombay",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-de06"
  },
  {
    courseName: "Understanding Design Thinking & People Centred Design",
    smeName: "Prof. Jhumkee Iyengar",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-hs19"
  },
  {
    courseName: "Unit Operations Of Particulate Matter",
    smeName: "Prof. Shabina Khanam",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-ch12"
  },
  {
    courseName: "Unit Operations Of Particulate Matter",
    smeName: "Prof. Shabina Khanam",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ch23"
  },
  {
    courseName: "Unit Operations Of Particulate Matter",
    smeName: "Prof. Shabina Khanam",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ch30"
  },
  {
    courseName: "Unsaturated Soil Mechanics",
    smeName: "Prof. T. V Bharat",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce38"
  },
  {
    courseName: "Upstream LNG Technology",
    smeName: "Prof. Pavitra Sandilya",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ph15"
  },
  {
    courseName: "Urban Governance And Development Management (UGDM)",
    smeName: "Prof. Uttam K. Roy",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ar05"
  },
  {
    courseName: "User Interface Design",
    smeName: "Prof. Saptarshi Kolay",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ar10"
  },
  {
    courseName: "Variational Methods In Mechanics",
    smeName: "Prof. Ananthasuresh, Prof. Safvan Palathingal",
    institute: "IISc Bangalore",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-me20"
  },
  {
    courseName: "Vibration And Structural Dynamics",
    smeName: "Prof. Mira Mitra",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ae09"
  },
  {
    courseName: "Vibrations Of Structures",
    smeName: "Prof. Anirvam Dasgupta",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM1/noc16-me07"
  },
  {
    courseName: "Virtual Reality Engineering",
    smeName: "Prof. M Manivannan",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ge08"
  },
  {
    courseName: "Visual Communication Design For Digital Media",
    smeName: "Prof. Saptarshi Kolay",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ce03"
  },
  {
    courseName: "Visual Communication Design For Digital Media",
    smeName: "Prof. Saptarshi Kolay",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ar02"
  },
  {
    courseName: "Visual Communication Design For Digital Media",
    smeName: "Prof. Saptarshi Kolay",
    institute: "IIT Roorkee",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ar09"
  },
  {
    courseName: "Visual Perception And Art: A Survey Across The Cultures",
    smeName: "Prof. Soumik Nandy Majumdar",
    institute: "Visva Bharati University, Santiniketan",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-hs23"
  },
  {
    courseName: "Visual Perception And Art: A Survey Across The Cultures",
    smeName: "Prof. Soumik Nandy Majumdar",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-hs41"
  },
  {
    courseName: "Visual Perception And Art: A Survey Across The Cultures",
    smeName: "Prof. Soumik Nandy Majumdar",
    institute: "IIT Kanpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs62"
  },
  {
    courseName: "Visual Semiotics For Visual Communication",
    smeName: "Prof. Mainak Ghosh",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Jan-Feb 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ce06"
  },
  {
    courseName: "VLSI Design Verification And Test",
    smeName:
      "Prof. Santhosh Biswas, Prof. Jatindra Kumar Deka, Prof. Arnab Sarkar",
    institute: "IIT Guwahati",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2016",
    courseLink: "https://nptel.ac.in/noc/courses/noc16/SEM2/noc16-ec08"
  },
  {
    courseName: "VLSI Physical Design",
    smeName: "Prof. Indranil Sengupta",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-cs15"
  },
  {
    courseName: "VLSI Physical Design",
    smeName: "Prof. Indranil Sengupta",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs06"
  },
  {
    courseName: "VLSI Technology",
    smeName: "Prof. Prof. Nandita Dasgupta",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Feb-May 2015",
    courseLink: "https://nptel.ac.in/noc/courses/noc15/SEM1/noc15-ec02"
  },
  {
    courseName: "Waste To Energy Conversion",
    smeName: "Prof. P. Mondal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-ch05"
  },
  {
    courseName: "Waste To Energy Conversion",
    smeName: "Prof. P. Mondal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-ch06"
  },
  {
    courseName: "Waste To Energy Conversion",
    smeName: "Prof. P. Mondal",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-ch13"
  },
  {
    courseName: "Wastewater Treatment And Recycling",
    smeName: "Prof. Manoj Kumar Tiwari",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-ce26"
  },
  {
    courseName: "Wastewater Treatment And Recycling",
    smeName: "Prof. Manoj Kumar Tiwari",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ce32"
  },
  {
    courseName: "Water Economics And Governance",
    smeName: "Prof. Manoj Kumar Tiwari",
    institute: "IIT Kharagpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-oe02"
  },
  {
    courseName: "Water, Society And Sustainability",
    smeName: "Prof. Jenia Mukherjee",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-hs36"
  },
  {
    courseName: "Water, Society And Sustainability",
    smeName: "Prof. Jenia Mukherjee",
    institute: "IIT Kharagpur",
    courseDuration: "04 weeks",
    timeline: "Aug-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-hs41"
  },
  {
    courseName: "Waves And Oscillations",
    smeName: "Prof. M. S. Santhanam",
    institute: "IISER Pune",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-ph18"
  },
  {
    courseName: "Weldability Of Metals",
    smeName: "Prof. Dheerendra Kumar Dwivedi",
    institute: "IIT Roorkee",
    courseDuration: "08 weeks",
    timeline: "Feb-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-me19"
  },
  {
    courseName: "Welding Metallurgy",
    smeName: "Prof. Pradeep K. Jha",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mm19"
  },
  {
    courseName:
      "Welding Of Advanced High Strength Steels For Automotive Applications",
    smeName: "Prof. Murugaiyan Amirthalingam",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mm21"
  },
  {
    courseName:
      "Welding Of Advanced High Strength Steels For Automotive Applications.",
    smeName: "Prof. Murugaiyan Amirthalingam",
    institute: "IIT Madras",
    courseDuration: "04 weeks",
    timeline: "Jul-Aug 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mm18"
  },
  {
    courseName: "Welding Processes",
    smeName: "Prof. Murugaiyan Amirthalingam",
    institute: "IIT Madras",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-mm12"
  },
  {
    courseName: "Wild Life Ecology",
    smeName: "Prof. Ankur Awadhiya, Prof. Mainak Das",
    institute: "IIT Kanpur",
    courseDuration: "12 weeks",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM1/noc19-bt09"
  },
  {
    courseName: "WildLife Conservation",
    smeName: "Prof. Ankur Awadhiya",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Aug-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-bt26"
  },
  {
    courseName: "WildLife Conservation",
    smeName: "Prof. Ankur Awadhiya",
    institute: "IIT Kanpur",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-bt32"
  },
  {
    courseName: "Wireless Ad Hoc And Sensor Networks",
    smeName: "Prof. Sudip Misra",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Jan-Mar 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM1/noc17-cs07"
  },
  {
    courseName: "Wireless Ad Hoc And Sensor Networks",
    smeName: "Prof. Sudip Misra",
    institute: "IIT Kharagpur",
    courseDuration: "08 weeks",
    timeline: "Feb-Mar 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM1/noc18-cs09"
  },
  {
    courseName: "Work System Design",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-me68"
  },
  {
    courseName: "Work System Design",
    smeName: "Prof. Inderdeep Singh",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-me50"
  },
  {
    courseName: "Working Capital Management",
    smeName: "Prof. Anil K. Sharma",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-mg40"
  },
  {
    courseName: "Working Capital Management",
    smeName: "Prof. Anil K. Sharma",
    institute: "IIT Roorkee",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-mg40"
  },
  {
    courseName: "Workshop In Theoretical Chemistry",
    smeName: "Prof. Harinath Chakrapani",
    institute: "IISER PUNE",
    courseDuration: "",
    timeline: "Jan-Apr 2019",
    courseLink: "https://nptel.ac.in/noc/courses/lab19/SEM1/lab19-cy02"
  },
  {
    courseName: "X-ray Crystallography & Diffraction",
    smeName: "Prof. Ranjit Kumar Ray",
    institute: "IIEST Shibpur",
    courseDuration: "12 weeks",
    timeline: "Jul-Oct 2017",
    courseLink: "https://nptel.ac.in/noc/courses/noc17/SEM2/noc17-mm11"
  },
  {
    courseName: "Yarn Manufacture I : Principle Of Carding And Drawing",
    smeName: "Prof. R Chattopadhyay",
    institute: "IIT Delhi",
    courseDuration: "08 weeks",
    timeline: "Aug-Sep 2018",
    courseLink: "https://nptel.ac.in/noc/courses/noc18/SEM2/noc18-de04"
  },
  {
    courseName: "Yarn Manufacture I : Principle Of Carding And Drawing",
    smeName: "Prof. R Chattopadhyay",
    institute: "IIT Delhi",
    courseDuration: "08 weeks",
    timeline: "Jul-Sep 2019",
    courseLink: "https://nptel.ac.in/noc/courses/noc19/SEM2/noc19-te09"
  }
];

var finalCourses = [];
var done = 0;

(async () => {
  for (var p = 0; p < allCourses.length; p++) {
    var initialCourseObj = allCourses[p];
    const nptelURL = initialCourseObj.courseLink;

    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      const navigationPromise = page.waitForNavigation();

      await page.goto(nptelURL);
      await page.evaluate(_ => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.waitFor(500);
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

      // console.log("totalEnrollment =", totalEnrollment);
      // console.log("totalRegistration =", totalRegistration);
      // console.log("youtubeLink=", youtubeLink);
      const enrollmentTableSelector =
        "#role > div > div:nth-child(1) > div > div > table > tbody";

      const enrollmentStatsLength = await page.$eval(
        enrollmentTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      //console.log(enrollmentStatsLength);

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

      //console.log(enrollmentStats);

      const registrationTableSelector =
        "#piechart1 > div > div:nth-child(1) > div > div > table > tbody  ";

      const registrationStatsLength = await page.$eval(
        registrationTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      //console.log(registrationStatsLength);

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

      //console.log(registrationStats);

      const genderTableSelector =
        "#gender > div > div:nth-child(1) > div > div > table > tbody  ";

      const genderStatsLength = await page.$eval(
        genderTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      //console.log(genderStatsLength);

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

      //console.log(genderStats);

      const reasonTableSelector =
        "#feed_back > div > div:nth-child(1) > div > div > table > tbody ";

      const reasonStatsLength = await page.$eval(
        reasonTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      //console.log(reasonStatsLength);

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

      //console.log(reasonStats);

      const assignmentScoreTableSelector =
        "#avg_score > div > div:nth-child(1) > div > div > table > tbody ";

      const assignmentScoreStatsLength = await page.$eval(
        assignmentScoreTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      //console.log(assignmentScoreStatsLength);

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

      //console.log(assignmentScoreStats);

      const assignmentSubmissionsTableSelector =
        "#avg_score > div > div:nth-child(1) > div > div > table > tbody ";

      const assignmentSubmissionsStatsLength = await page.$eval(
        assignmentSubmissionsTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      //console.log(assignmentSubmissionsStatsLength);

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

      //console.log(assignmentSubmissionsStats);

      const enrollmentStateTableSelector =
        "#state > div > div:nth-child(1) > div > div > table > tbody";

      const enrollmentStateStatsLength = await page.$eval(
        enrollmentStateTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      //console.log(enrollmentStateStatsLength);

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

      // console.log(enrollmentStateStats);

      const enrollmentAgeTableSelector =
        "#age_range > div > div:nth-child(1) > div > div > table > tbody";

      const enrollmentAgeStatsLength = await page.$eval(
        enrollmentAgeTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      // console.log(enrollmentAgeStatsLength);

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

      // console.log(enrollmentAgeStats);

      const enrollmentCountryTableSelector =
        "#conrty_div > div > div:nth-child(1) > div > div > table > tbody";

      const enrollmentCountryStatsLength = await page.$eval(
        enrollmentCountryTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      // console.log(enrollmentCountryStatsLength);

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

      // console.log(enrollmentCountryStats);

      const registrationStateTableSelector =
        "#state_div > div > div:nth-child(1) > div > div > table > tbody";

      const registrationStateStatsLength = await page.$eval(
        registrationStateTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      // console.log(registrationStateStatsLength);

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

      // console.log(registrationStateStats);

      const registrationChapterTableSelector =
        "#clg_details > div > div:nth-child(1) > div > div > table > tbody";

      const registrationChapterStatsLength = await page.$eval(
        registrationChapterTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      // console.log(registrationChapterStatsLength);

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

      // console.log(registrationChapterStats);

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

      // console.log(assignmentScoreDistributionStatsLength);

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

      // console.log(assignmentScoreDistributionStats);

      const examScoreDistributionTableSelector =
        "#exam > div > div:nth-child(1) > div > div > table > tbody";

      const examScoreDistributionStatsLength = await page.$eval(
        examScoreDistributionTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      // console.log(examScoreDistributionStatsLength);

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

      // console.log(examScoreDistributionStats);

      const finalScoreDistributionTableSelector =
        "#scoree > div > div:nth-child(1) > div > div > table > tbody";

      const finalScoreDistributionStatsLength = await page.$eval(
        finalScoreDistributionTableSelector,
        uiElement => {
          return uiElement.children.length;
        }
      );

      // console.log(finalScoreDistributionStatsLength);

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

      // console.log(finalScoreDistributionStats);

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
      done++;
      console.log("current - " + p + " completed - " + done);
      console.log(p);

      fs.writeFile(
        "./rest700final.json",
        JSON.stringify(finalCourses),
        function(err) {
          if (err) {
            console.error("error");
          }
        }
      );

      await browser.close();
    } catch {
      await browser.close();
      continue;
    }
  }
})();
