const { execSync } = require('child_process');
const s3 = require('s3');
const path = require('path');
const fs = require('fs');

function emitterToPromise(emitter) {
  return new Promise((resolve, reject) => {
    emitter.on('end', data => resolve(data));
    emitter.on('error', err => reject(err));
    emitter.on('fileUploadEnd', (localFilePath, s3Key) => {
      console.log(`finished upload ${localFilePath}, ${s3Key}`);
    });
  });
}

// compare url format
// https://github.com/user/repo/compare/0b77fef38d1f377d11ed0f0afa005eab13add3e1...baffeb5fc25148d1052fe453c30a5814a9dd95a7'

const STORYBOOK_UI_PATH_TO_WATCH = 'frontends/new_horizon/src';

const REQUIRED_ENV_VARS = [
  'CIRCLE_COMPARE_URL',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY'
];

const errors = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);

if (errors.length) {
  throw new Error(`These required environment variable(s) ${errors.join(', ')} are not set in circleci!`);
}

const tokens = process.env.CIRCLE_COMPARE_URL.split('/');
const diffCommits  = tokens[tokens.length - 1];

if (!diffCommits.includes('...')) {
  return console.log('CIRCLE_COMPARE_URL is in wrong format, nothing to release!');
}

console.log('=========================', process.env.CIRCLE_COMPARE_URL);

const filesChanged = execSync(`git diff --name-only ${diffCommits}`).toString().split('\n');
console.log('filesChanged: ', filesChanged);

const canDeploy = filesChanged.some(f => f.includes(STORYBOOK_UI_PATH_TO_WATCH));

if (!canDeploy) {
  return console.log('No storbook ui updates to release!');
}

try {
  const DOC_PATH = path.resolve(__dirname, './storybook-static');
  console.log('Start releasing:')
  console.log(`Removing: ${DOC_PATH}...`);
  execSync(`rm -rf ${DOC_PATH}`);
  console.log(`Removing: ${DOC_PATH} completed.`)
  console.log('Building static pages...')
  execSync('yarn build-storybook --quiet');
  console.log('Building static pages completed.');
  console.log('Uploading files to S3...');
  const s3Client = s3.createClient({
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1'
    }
  });

  const request = s3Client.uploadDir({
    localDir: DOC_PATH,
    deleteRemoved: true, // doesn't support versioning at this moment
    s3Params: {
      Bucket: 'bb-ui-storybook'
    }
  });

  emitterToPromise(request).then(
    () => console.log('Storybook ui release completed.'),
    (err) => console.log('Storybook ui release failed.', err)
  );

  console.log('files', fs.readdirSync(DOC_PATH));

} catch (err) {
  console.log('Release failed!', err);
}
