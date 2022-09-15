import fs from 'fs';
import https from 'https';
import { createBrowserInstance } from '@utils/browser';
import { getHost, saveAccount } from '@utils/index';
import { Post } from '@typesx/index';

export async function downloadVideo({ username, post }: { username: string; post: Post }) {
  const browser = await createBrowserInstance({ host: getHost() });
  try {
    const context = await browser.newContext();

    const page = await context.newPage();
    await page.goto(`https://snaptik.app`);
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="url"]', post.url);
    await page.waitForTimeout(1000);
    await page.click('button[id="submiturl"]');
    await page.waitForSelector('a[title="Download Server 01"]');
    await page.waitForTimeout(4000);
    const downloadLink = await page.$eval(
      'a[title="Download Server 01"]',
      (el: HTMLLinkElement) => {
        return el.href;
      }
    );
    console.log('close browser');
    await browser.close();

    // link to file you want to download
    const path = './' + username + '/'; // location to save videos
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    const downloadPath =
      path + post.url.replace(`https://www.tiktok.com/@${username}/video/`, '') + '.mp4';
    if (fs.existsSync(downloadPath)) {
      console.log('Video already exist');
      return;
    }

    https
      .get(downloadLink, function (response) {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(downloadPath);
          response.pipe(file);

          file.on('finish', () => {
            file.close();
            saveAccount({ lastSavedIndex: post.index, username });
            console.log(file.path + ' Saved!');
          });
        }
      })
      .on('error', function (err) {
        throw err;
      });
    return;
  } catch (err) {
    await browser.close();
    throw err;
  }
}
