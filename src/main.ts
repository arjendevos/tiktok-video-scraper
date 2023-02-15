import dotenv from 'dotenv';

import RL from 'readline';

import { fetchProfileVideos } from '@/functions/profile';
import { downloadVideo } from '@/functions/snaptik';
import { getAccount } from '@utils/index';

dotenv.config();

(async () => {
  const username = await asyncQuestion('Username: ');
  await getVideosWithoutWatermark({ username });
})();

async function getVideosWithoutWatermark({ username }: { username: string }) {
  try {
    const account = getAccount({ username });
    if (!account) {
      console.log(`${username} does not exists yet, fetching now`);
      await fetchProfileVideos({ username });
      return getVideosWithoutWatermark({ username });
    }

    if (account.posts.length > account.lastSavedIndex) {
      console.log(`${username} does exists already, downloading now`);
      for (let i = account.lastSavedIndex; i < account.posts.length; i++) {
        await downloadVideo({ username, post: account.posts[i] });
      }

      return;
    }

    console.log(`${username} no new videos found`);
    return;
  } catch (err) {
    console.error('restarting ', err);
    return getVideosWithoutWatermark({ username });
  }
}

function asyncQuestion(question: string): Promise<string> {
  const rl = RL.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
