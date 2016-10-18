'use strict';
const alfy = require('alfy');
const alfredNotifier = require('alfred-notifier');
const fs = require('fs');

alfredNotifier();

const home = process.env.HOME || process.env.USERPROFILE;
const configFile = process.argv[3] || `${home}/.bitbuckfred.json`
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
const host = config.host || 'localhost'
const port = config.port || 8080;
const user = config.user || 'admin';
const password = config.password || 'admin';
const auth = new Buffer(`${user}:${password}`).toString('base64')
const options = {
  method: 'GET',
  query: {
    'name': alfy.input,
  },
  headers: {
    'Authorization': 'Basic ' + auth
  },
  maxAge: 300000
};

alfy.fetch(`${host}:${port}/rest/api/1.0/repos`, options).then(data => {
  const items= data.values.map(x => ({
    title: x.name,
    subtitle: x.project.name,
    arg: x.links.self[0].href
  }));

  alfy.output(items);
});
