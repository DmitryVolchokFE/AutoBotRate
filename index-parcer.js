const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://plg.bet/ru');
  await wait(2000);
  const bodyHandle = await page.$('body');

  while(true) {
    const value = await page.evaluate(body => {
      let text = Array.from(body.querySelectorAll('.ball'), el => el.innerText).at(-1);
      return text;
    }, bodyHandle);
    console.log(value);
    fs.appendFile('statistics.txt',`${value}, `, () => {})
    await wait(35000);
  }
})();

// Функція затримки дій.

async function wait(delay) {

  await new Promise((resolve) => {
      setTimeout(resolve, delay)
  })
}