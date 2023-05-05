const fs = require("fs");
const puppeteer = require("puppeteer");
const chalk = require("chalk");
const Captcha = require("2captcha-ts");
const APIKEY = "<Your 2captcha APIKEY>";
const solver = new Captcha.Solver(APIKEY);

(async () => {
  const puppeteerSettings = {
    headless: false,
  };

  const browser = await puppeteer.launch(puppeteerSettings);
  const page = await browser.newPage();
  await page.goto("https://2captcha.com/demo/normal");

  await page.waitForSelector('img[alt="normal captcha example"]');
  const element = await page.$('img[alt="normal captcha example"]');
  // save captcha
  await element.screenshot({ path: "./image_captcha.png" });

  const getCaptchaAnswer = async () => {
    try {
      //send captcha
      const base64Captcha = fs.readFileSync("./image_captcha.png", "base64");
      const res = await solver.imageCaptcha({
        body: base64Captcha,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const captchaAnswer = await getCaptchaAnswer();
  console.log("captchaAnswer:" + captchaAnswer);

  //set captcha answer
  await page.type("#simple-captcha-field", captchaAnswer, { delay: 500 });
  await page.evaluate(() => {
    //click on 'check'
    document.querySelector("button[type=submit]").click();
  });

  const getResult = await page.evaluate(() => {
    let result;

    const elementErrorMsg = document.querySelector("._1Or-n9RKBk1X_Bc_vZYSf4");
    if (elementErrorMsg) {
      console.log("errorMsg: " + elementErrorMsg.innerText);
      result = "Incorrect CAPTCHA answer, please try again.";
      return result;
    }

    const elementSuccessMsg = document.querySelector(".j4U8b8WW7BD_DOSsopoys");
    if (elementSuccessMsg) {
      result = "Captcha is passed successfully!";
      return result;
    }
  });

  const isSuccess = getResult === "Captcha is passed successfully!";
  if (isSuccess) {
    console.log(chalk.bgGreen(getResult));
  } else {
    console.log(chalk.bgRed(getResult));
  }

  browser.close();
})();
