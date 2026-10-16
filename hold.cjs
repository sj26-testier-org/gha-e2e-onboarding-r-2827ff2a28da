const fs = require('node:fs');
const assert = require('node:assert/strict');
const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const names = ['GITHUB_TOKEN', 'GH_TOKEN', 'ACTIONS_RUNTIME_TOKEN'];
const present = Object.fromEntries(names.map(k => [k, Boolean(process.env[k])]));
console.log('PB3523_TOKEN_PRESENCE ' + JSON.stringify(present));
if (process.env.GITHUB_EVENT_NAME === 'merge_group') {
  assert.ok(Object.values(present).every(v => !v));
  console.log('PB3523_LIVE ' + JSON.stringify({action:event.action,head:event.merge_group.head_sha,base:event.merge_group.base_sha}));
  if (event.action === 'checks_requested') {
    setTimeout(() => {
      console.log('PB3523_HOLD_DONE');
      // Never allow a fixture merge if the executor is interrupted.
      if (process.env.PROBE_WORKFLOW.endsWith('/ci.yml')) process.exitCode = 1;
    }, 600000);
  }
}
