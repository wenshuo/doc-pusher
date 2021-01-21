const git = require('octonode');

const client = git.client(process.env.GIT_AUTH_TOKEN);

const { execSync } = require('child_process');

const output = execSync(`git diff --name-only ${process.env.CIRCLE_SHA1} HEAD`);
console.log('diff from cmd');
console.log(output.toString());

client.get('/repos/wenshuo/doc-pusher/pulls/', {}, (err, status, body) => {
  console.log('diff from api');
  console.log(JSON.parse(body));
});
