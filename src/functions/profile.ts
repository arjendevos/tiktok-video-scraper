import { autoScroll, getHost, saveAccount } from '@utils/index';

import { createBrowserInstance } from '@utils/browser';

export async function fetchProfileVideos({ username }: { username: string }) {
  const browser = await createBrowserInstance({ host: getHost(), withProxy: false });
  try {
    const context = await browser.newContext();

    const page = await context.newPage();
    await page.goto(`https://tiktok.com/@${username}`);

    await page.waitForLoadState('networkidle');

    await autoScroll({ page });

    const posts = await page.$$eval('div[data-e2e="user-post-item"]', (headElements) => {
      const posts = [];
      headElements.forEach((headEl, index) => {
        const url = headEl.querySelector('a').href;
        posts.push({ url, index });
      });

      return posts;
    });

    saveAccount({ username, posts, lastSavedIndex: 0 });
    console.log('posts are saved!');
    await browser.close();
    return;
  } catch (err) {
    await browser.close();
    throw err;
  }
}
