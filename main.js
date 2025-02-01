const puppeteer = require('puppeteer');

async function getProfileInfo(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('header img', { timeout: 5000 });
        await page.waitForSelector('h2', { timeout: 5000 });

        const profileImageURL = await page.$eval('header img', img => img.src);
        const username = await page.$eval('h2', el => el.innerText);

        let sexo;
        if (username === "Esta conta é privada") {
            sexo = await page.$eval('h1', el => el.innerText);
        } else {
            sexo = username;
        }

        // 
        const bio = await page.$eval('span._ap3a._aaco._aacu._aacx._aad7._aade', el => el.innerText).catch(() => 'N/A');
        const posts = await page.$eval('ul li:nth-child(1) span', el => el.innerText).catch(() => 'N/A');
        const followers = await page.$eval('ul li:nth-child(2) span', el => el.innerText).catch(() => 'N/A');
        const following = await page.$eval('ul li:nth-child(3) span', el => el.innerText).catch(() => 'N/A');
        const isVerified = await page.$('svg[aria-label="Verificado"]').then(el => !!el).catch(() => false);


        const profileInfo = {
            avatar: profileImageURL,
            username: sexo,
            bio: bio,
            posts: posts,
            followers: followers,
            following: following,
            verified: isVerified
        };

        console.log(profileInfo);
    } catch (error) {
        console.error(`Error fetching profile info from ${url}:`, error);
    } finally {
        await browser.close();
    }
}

async function getProfiles(urls) {
    for (let url of urls) {
        await getProfileInfo(url);
    }
}

const urls = [
    'https://www.instagram.com/twice/'
];

getProfiles(urls);
