import { Proxy } from '@typesx/index';
import Playwright from 'playwright';

export async function createBrowserInstance({ host }: { host?: string }) {
  let proxy: Proxy = {
    server: `http://${host}:8080`,
    username: process.env.PRIVATEVPN_USERNAME,
    password: process.env.PRIVATEVPN_PASSWORD
  };

  console.log(
    `Using ${host.split('-')[1].split('.')[0].toUpperCase()} in ${host.split('-')[0].toUpperCase()}`
  );
  return await Playwright['chromium'].launch({
    proxy,
    headless: false,
    slowMo: 400
  });
}
