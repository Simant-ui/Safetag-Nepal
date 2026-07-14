import { UAParser } from 'ua-parser-js';

export function parseUserAgent(uaString: string | undefined) {
  if (!uaString) return { browserName: undefined, deviceType: undefined };
  const result = new UAParser(uaString).getResult();
  return {
    browserName: result.browser.name,
    deviceType: result.device.type ?? 'desktop',
  };
}
