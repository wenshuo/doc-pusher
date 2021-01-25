const { execSync } = require('child_process');
const s3 = require('s3');
const path = require('path');

function emitterToPromise(emitter) {
  return new Promise((resolve, reject) => {
    emitter.on('end', data => resolve(data));
    emitter.on('error', err => reject(err));
  });
}

// compare url format
// https://github.com/user/repo/compare/0b77fef38d1f377d11ed0f0afa005eab13add3e1...baffeb5fc25148d1052fe453c30a5814a9dd95a7'

const REQUIRED_ENV_VARS = [
  'CIRCLE_COMPARE_URL',
  'STORYBOOK_UI_PATH_TO_WATCH', // path relative to clarity root
  'STORYBOOK_UI_S3_KEY_ID',
  'STORYBOOK_UI_S3_ACCESS_KEY',
  'STORYBOOK_UI_S3_BUCKET_REGION',
  'STORYBOOK_UI_DOC_FOLDER', // path relative to the release.js
  'STORYBOOK_UI_S3_BUCKET'
];

const errors = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);

if (errors.length) {
  throw new Error(`These required environment variable(s) ${errors.join(', ')} are not set in circleci!`);
}

const tokens = process.env.CIRCLE_COMPARE_URL.split('/');
const commits = tokens[tokens.length - 1].split('...');

if (commits.length !== 2) {
  return console.log('CIRCLE_COMPARE_URL is in wrong format, nothing to release!');
}

const filesChanged = execSync(`git diff --name-only ${commits[1]} ${commits[0]}`).toString().split('\n');
const canDeploy = filesChanged.some(f => f.startsWith(process.env.STORYBOOK_UI_PATH_TO_WATCH));

if (!canDeploy) {
  return console.log('No ui updates to release!');
}

const s3Client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.STORYBOOK_UI_S3_KEY_ID,
    secretAccessKey: process.env.STORYBOOK_UI_S3_ACCESS_KEY,
    region: process.env.STORYBOOK_UI_S3_BUCKET_REGION
  }
});

const request = s3Client.uploadDir({
  localDir: path.resolve(__dirname, process.env.STORYBOOK_UI_DOC_FOLDER),
  s3Params: {
    Bucket: process.env.STORYBOOK_UI_S3_BUCKET,
    Prefix: '/'
  }
});

emitterToPromise(request).then(
  () => console.log('Storybook ui release completed.'),
  (err) => console.log('Storybook ui release failed.', err);
);
