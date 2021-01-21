const { execSync } = require('child_process');

let deployed = false;

// compare url format
// https://github.com/user/repo/compare/0b77fef38d1f377d11ed0f0afa005eab13add3e1...baffeb5fc25148d1052fe453c30a5814a9dd95a7'

if (!process.env.UI_PATH_TO_WATCH) {
  throw new Error('UI_PATH_TO_WATCH environment variable must be set in circleci!');
}

if (process.env.CIRCLE_COMPARE_URL) {
  const tokens = process.env.CIRCLE_COMPARE_URL.split('/');

  if (tokens.length) {
    const commits = tokens[tokens.length - 1].split('...');

    if (commits.length === 2) {
      const filesChanged = execSync(`git diff --name-only ${commits[1]} ${commits[0]}`).toString().split('\n');
      const canDeploy = filesChanged.some(f => f.startsWith(process.env.UI_PATH_TO_WATCH));
      if (canDeploy) {
        console.log('filesChanged: ');
        console.log(filesChanged);
        deployed = true;
      }
    }
  }

}

if (!deployed) {
  console.log('No UI updates to deploy!')
}
