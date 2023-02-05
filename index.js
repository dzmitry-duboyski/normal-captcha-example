const fs = require('fs');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const Captcha = require('2captcha');
const APIKEY = process.env.APIKEY;
const solver = new Captcha.Solver(APIKEY);

(async () => {
  const puppeteerSettings = {
    headless: true
  }

  const browser = await puppeteer.launch(puppeteerSettings)
  const page = await browser.newPage();
  await page.goto('https://2captcha.com/demo/normal')

  await page.waitForSelector('img[alt="normal captcha example"]')
  const element = await page.$('img[alt="normal captcha example"]')
  await element.screenshot({path: './captchas/image.png'})
  
  const getCaptchaAnswer = async () => {
    try {
      const res = await solver.imageCaptcha(fs.readFileSync('./captchas/image.png', 'base64'))
      return res.data
    } catch (err) {
      console.log(err);
    }
  }

  const captchaAnswer = await getCaptchaAnswer()
  console.log('captchaAnswer:' + captchaAnswer)

  await page.type('#simple-captcha-field', captchaAnswer, {delay: 500})
  await page.evaluate(() => {
    document.querySelector('button[type=submit]').click()
  })

  const getResult = await page.evaluate(() => {
      let result

      const errorElem = document.querySelector('._1Or-n9RKBk1X_Bc_vZYSf4')
      if(!errorElem){
        // console.log('element not found')
      } else {
        console.log('errorMsg: '+ errorElem.innerText)
        result = 'Incorrect CAPTCHA answer, please try again.'
        return result
      }

      const successElem = document.querySelector('.j4U8b8WW7BD_DOSsopoys')
      if(!successElem){
        // console.log('element not found')
      } else {
        result = 'Captcha is passed successfully!'
        return result
      }
  })

  const isSuccess = getResult == 'Captcha is passed successfully!'
  if(isSuccess) {
    console.log(chalk.bgGreen(getResult))
  } else {
    console.log(chalk.bgRed(getResult))
  }

  browser.close()
})();