import Playwright from 'Playwright';
import fs from 'fs';

import { Account, Post } from '@typesx/index';

export async function autoScroll({ page }: { page: Playwright.Page }) {
  let isAtBottom = false;
  let previousHeight = 0;
  while (!isAtBottom) {
    //INFINITE SCROLLING

    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    const newHeight = await page.evaluate('document.body.scrollHeight');

    console.log('scrolling...');
    if (newHeight > previousHeight) {
      await page.waitForTimeout(2000);
    } else {
      isAtBottom = true;
    }

    // await page.evaluate(`window.scrollTo(0, ${(previousHeight += 400)})`);
    // await page.waitForTimeout(1000);
  }
  return;
}

export function getHost(): string {
  const hostFile = fs.readFileSync('socks5.hosts.txt', {
    encoding: 'utf-8'
  });
  const hosts = hostFile.split('\n');
  return hosts[Math.round(Math.random() * hosts.length)];
}

export function getAccount({ username }: { username: string }): Account | undefined {
  const rawJSON = fs.readFileSync('data/accounts.json', { encoding: 'utf-8' });
  const allAccounts = JSON.parse(rawJSON) as Account[];

  const thisAccountIndex = allAccounts.findIndex((a) => a.username === username);
  if (thisAccountIndex < 0) {
    return undefined;
  }

  return allAccounts[thisAccountIndex];
}

export function saveAccount({
  lastSavedIndex,
  posts,
  username
}: {
  lastSavedIndex?: number;
  posts?: Post[];
  username: string;
}) {
  const rawJSON = fs.readFileSync('data/accounts.json', { encoding: 'utf-8' });
  const allAccounts = JSON.parse(rawJSON) as Account[];

  const thisAccountIndex = allAccounts.findIndex((a) => a.username === username);
  if (thisAccountIndex < 0) {
    allAccounts.push({ username, posts, lastSavedIndex: 0 });
  } else {
    allAccounts[thisAccountIndex] = {
      posts: posts ?? allAccounts[thisAccountIndex].posts,
      lastSavedIndex: lastSavedIndex ?? allAccounts[thisAccountIndex].lastSavedIndex,
      username
    };
  }

  fs.writeFileSync('data/accounts.json', JSON.stringify(allAccounts, null, 4));
}
