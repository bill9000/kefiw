#!/usr/bin/env node

const KEY = '346e1fffd0b74c5fac0f1847009406b1';
const HOST = 'kefiw.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = process.env.INDEXNOW_ENDPOINT ?? 'https://api.indexnow.org/indexnow';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const rawUrls = args.filter((arg) => arg !== '--dry-run');

function usage() {
  console.error('Usage: node scripts/indexnow-submit.mjs [--dry-run] https://kefiw.com/url/ [...]');
}

function normalizeUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`Invalid URL: ${raw}`);
  }

  if (url.protocol !== 'https:') {
    throw new Error(`IndexNow URL must use https: ${raw}`);
  }

  if (url.hostname === 'www.kefiw.com') {
    url.hostname = HOST;
  }

  if (url.hostname !== HOST) {
    throw new Error(`IndexNow URL must belong to ${HOST}: ${raw}`);
  }

  url.hash = '';
  return url.toString();
}

function unique(values) {
  return [...new Set(values)];
}

if (rawUrls.length === 0) {
  usage();
  process.exit(2);
}

const urlList = unique(rawUrls.map(normalizeUrl));

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

if (dryRun) {
  console.log(JSON.stringify({ endpoint: ENDPOINT, payload }, null, 2));
  process.exit(0);
}

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  const body = await response.text().catch(() => '');
  console.error(`[indexnow] ${response.status} ${response.statusText}`);
  if (body) console.error(body);
  process.exit(1);
}

console.log(`[indexnow] Submitted ${urlList.length} URL(s). Status: ${response.status} ${response.statusText}`);
