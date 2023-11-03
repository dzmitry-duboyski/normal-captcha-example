# How to automate an image-based captcha solution in JavaScript

## Description
In this example, you can see how automate an image-based captcha solution in JavaScript using [Puppeteer](https://pptr.dev/) and the 2captcha service.
[Puppeteer](https://pptr.dev/) is Node.js library using for automation. [2captcha](https://2captcha.com) is service used to solve the captcha.

### Presetting
Set your `API KEY` in the file  [./index.js#L3](./index.js#L5)

`APIKEY=yourApiKey`

### Usage

`npm i`

`npm run start`

### Example
```js
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
```

Screenshot:

![imageCaptcha](https://user-images.githubusercontent.com/38065632/236539708-ee094431-2be8-4629-97b7-285871cffba1.gif)

