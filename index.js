const puppeteer = require('puppeteer');
const fs = require('fs');


(async () => {
  const browser = await puppeteer.launch({ headless: false, protocolTimeout: 0 });
  const page = await browser.newPage();
  await page.goto('https://plgeubet.com/ru');
  await wait(40000);

  page.on('console', (msg) => {
    const text = msg.text();
    
    if (text.startsWith('😂')) {
      const [,row] = text.split('😂')
      console[msg.type()]('', row);
  
      fs.appendFile('bet_statistics.txt', `\n ${row}`, () => {});
    }
  });
  
  //Записує ставку в поле вводу.
  await page.evaluate(async () => {
    
    const arrValue = [1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191];
    const sequenceColors = ['red', 'dark', 'red', 'red', 'dark', 'red', 'dark', 'dark',];
    let n = 0;

    for (let cell = 0; true; cell++) {
      let rnum = arrValue[n];
      let color = sequenceColors[cell];
      const randomDelay = Math.round((100 + Math.random() * 1000));

      const input = document.getElementById('roulette_amount');
      if (input) {
        input.value = rnum;
      }
      await wait(randomDelay);

      //Пушить ставку на колір.
      document.querySelector(`.${color}_button`).dispatchEvent(new Event('click', { bubbles: true }))

      //затримка 35сек.
      await wait(35000 - randomDelay);

      // витягує поточне число яке випало.
      const value = Array.from(document.querySelectorAll('.ball'), el => el.innerText).at(-1);

      // Перевіряє відповідність числа до кольору рулетки.
      let valueColor = (value < 1) ? 'green' : (value <= 7) ? 'red' : 'dark';

      console.log('😂', value, rnum, valueColor === sequenceColors[cell]);
      
      (valueColor === sequenceColors[cell]) ? n = 0 : n++;
      
      if (cell + 1 === sequenceColors.length) {
        cell = -1;
      }
      
    }

    async function wait(delay) {
      await new Promise((resolve) => {
        setTimeout(resolve, delay)
      })
    }
  });
})();

// Функція затримки дій.
async function wait(delay) {

  await new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}