const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE_URL = process.env.DEPLOY_URL || 'https://mhussaingit.github.io/Milestone-Project-2--destination-guide/';
const resources = [
  { local: 'index.html', remote: 'index.html', type: 'html' },
  { local: 'destinations.html', remote: 'destinations.html', type: 'html' },
  { local: '404.html', remote: '404.html', type: 'html' },
  { local: 'assets/css/styles.css', remote: 'assets/css/styles.css', type: 'text' },
  { local: 'assets/js/app.js', remote: 'assets/js/app.js', type: 'text' }
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const status = res.statusCode;
        if (status !== 200) {
          reject(new Error(`${url} returned HTTP ${status}`));
          res.resume();
          return;
        }

        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

function normalizeHtml(html) {
  return html
    .replace(/\r\n/g, '\n')
    .replace(/>\s+</g, '><')
    .replace(/\s+$/gm, '')
    .trim();
}

function normalizeText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\s+$/gm, '')
    .trim();
}

function findFirstDifference(localLines, remoteLines) {
  const maxLength = Math.max(localLines.length, remoteLines.length);
  for (let i = 0; i < maxLength; i += 1) {
    if (localLines[i] !== remoteLines[i]) {
      return {
        line: i + 1,
        local: localLines[i] || '',
        remote: remoteLines[i] || ''
      };
    }
  }
  return null;
}

(async function main() {
  console.log(`Comparing local source files with deployed content at: ${BASE_URL}`);

  let failed = false;

  for (const resource of resources) {
    const localPath = path.join(__dirname, resource.local);
    const localContent = fs.readFileSync(localPath, 'utf8');
    const remoteContent = await fetchPage(`${BASE_URL}${resource.remote}`);

    const localNormalized = resource.type === 'html'
      ? normalizeHtml(localContent)
      : normalizeText(localContent);
    const remoteNormalized = resource.type === 'html'
      ? normalizeHtml(remoteContent)
      : normalizeText(remoteContent);

    if (localNormalized === remoteNormalized) {
      console.log(`✅ ${resource.local} matches deployment`);
      continue;
    }

    failed = true;
    console.error(`❌ ${resource.local} does not match deployment`);

    const localLines = localNormalized.split('\n');
    const remoteLines = remoteNormalized.split('\n');
    const diff = findFirstDifference(localLines, remoteLines);

    if (diff) {
      console.error(`  First difference at line ${diff.line}:`);
      console.error(`    local : ${diff.local}`);
      console.error(`    remote: ${diff.remote}`);
    }
  }

  if (failed) {
    console.error('\nDeployment comparison failed. Review the mismatched files above.');
    process.exitCode = 1;
  } else {
    console.log('\nAll compared local files match the deployed site.');
  }
})().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
