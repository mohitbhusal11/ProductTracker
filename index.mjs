import cheerio from "cheerio";
import fetch from "node-fetch";
import nodemailer from 'nodemailer';


const AMAZON_URL = 'https://www.amazon.in/Infinity-Glide-500-Wireless-Headphones/dp/B07W6NDVSR/?th=1';
const EXPECTED_AMOUNT = 1000;

const convertPrice = (amount) => parseInt(Number(amount.replace(/[^0-9.-]+/g, "")));

const getHtml = async (url) => {
  const headers = {
    method: 'get',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    }
  };

  const res = await fetch(url, headers);
  const html = await res.text();
  return cheerio.load(html);
};

const checkAmazonPrice = async (url, expected_price) => {
  const $ = await getHtml(url);
  const price = $('.a-price-whole').first().text().trim();
  const name = $('#productTitle').text().trim();

  console.log(`Price: ${price}`);
  console.log(`Product Name: ${name}`);

  const priceInt = convertPrice(price);

  console.log(`Price (Integer): ${priceInt}`);

  if (priceInt <= expected_price) {
    sendPush(priceInt, name);
    console.log("Haan bhai lele ab yeh sasta hogaya");
  } else {
    console.log("Abhi ruk bhai thoda aur sasta hone de fir lelena");
  }
};

// const sendPush = async (price, name) => {
//   const notifyChannelId = 'MfGM2vjSWgJnNb1YPjkl';
//   const dataString = `Price went down: ${name} went below ${price}`;

//   const headers = {
//     method: 'POST',
//     body: dataString,
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
//     }
//   };

//   const res = await fetch(`https://notify.run/${notifyChannelId}`, headers);
//   return true;
// };


//----this is change----

const sendPush = async (price, name) => {
    const mailOptions = {
        from: 'iamfake001122@gmail.com',
        to: 'rohitbhusal158@gmail.com',
        subject: 'Price Alert',
        text: `Price went down: ${name} is now below ${price}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully.');
    }   catch (error) {
        console.error('Error sending email notification:', error);
    }
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iamfake001122@gmail.com',
      pass: 'Mohit@989',
    },
});
checkAmazonPrice(AMAZON_URL, EXPECTED_AMOUNT);