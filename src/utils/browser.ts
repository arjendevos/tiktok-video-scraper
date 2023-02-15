import { Proxy } from '@typesx/index';
import Playwright from 'Playwright';

export async function createBrowserInstance({
  withProxy,
  host
}: {
  withProxy?: boolean;
  host?: string;
}) {
  if (withProxy) {
    let proxy: Proxy = {
      server: `http://${host}:8080`,
      username: process.env.PRIVATEVPN_USERNAME,
      password: process.env.PRIVATEVPN_PASSWORD
    };

    console.log(
      `Using ${host.split('-')[1].split('.')[0].toUpperCase()} in ${host
        .split('-')[0]
        .toUpperCase()}`
    );
    return await Playwright['firefox'].launch({
      proxy,
      headless: true,
      slowMo: 400
    });
  }

  return await Playwright['firefox'].launch({
    headless: true,
    slowMo: 400
  });
}
