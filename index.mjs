//importing packages jo mujhe chaiye
// const cheerio = require('cheerio');
import cheerio from "cheerio";
import fetch from "node-fetch";

//information website se link and expected price
const AMAZON_URL = 'https://www.amazon.in/Infinity-Glide-500-Wireless-Headphones/dp/B07W6NDVSR/?th=1'
const EXPECTED_AMOUNT = 1000

// Create Price converter function
const convertPrice = (amount) => parseInt(Number(amount.replace(/[^0-9.-]+/g, "")));

//start web scrapper code
var getHtml = async url => {
    const headers = {
        method: 'get',
        headers: {
            'User-Agent': //for this search karo google pe "what is my user agent"
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        }
    }

    const res = await fetch(url);
    const html = await res.text();
    return cheerio.load(html);
}

//parser sabse imp function
const cheackAmazonPrice = async (url, expected_price) => {
    const $_parsed_html = await getHtml(url);
    const price = $_parsed_html('.a-price').find('span.a-price-whole')[0].text() //fetch price
    const name = $_parsed_html('div').find('#productTitle').text() //fetch product name

    console.log(`this is price without change ${price}`); //for checking

    var priceInt = convertPrice(price) //convert price to int value

    console.log(priceInt); //for checking

    if(priceInt <= expected_price){
        sendPush(priceInt, name)
        console.log("Haan bhai lele ab yeh sasta hogaya")
    }
    else{
        console.log("Abhi ruk bhai thoda aur sasta hone de fir lelena")
    }
}

const sendPush = async (price, name) => {
    const notifyChannelId = 'MfGM2vjSWgJnNb1YPjkl'
    const dataString = `Price went down: ${name} went below ${price} `
    var headers = {
        method : 'POST',
        body : 'dataString',
        headers : {
            'User-Agent' :
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        }
    }

    const res = await fetch(`https://notify.run/${notifyChannelId}`, headers)
    return true
}

cheackAmazonPrice(AMAZON_URL, 100)