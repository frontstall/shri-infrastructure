// @ts-check
import path from 'path';
import util from 'util';
import fs from 'fs';
import os from 'os';
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);
const mkdtemp = util.promisify(fs.mkdtemp);


class Builder {
  constructor(api, agentId) {
    this.tempDir = os.tmpdir();
    this.api = api;
    this.agentId = agentId;
  }

  async start({
    id,
    repoUrl,
    commitHash,
    buildCommand,
  }) {
    const log = [];
    let status;
    const start = new Date();

    try {
      const repoDir = await mkdtemp(`${this.tempDir}${path.sep}`);
      await exec(`git clone ${repoUrl} ${repoDir}`);
      await exec(`cd ${repoDir} && git checkout ${commitHash}`);
      const buildLog = await exec(`cd ${repoDir} && npm ci && ${buildCommand}`);
      log.push(buildLog.stdout, buildLog.stderr);
      const testLog = await exec(`cd ${repoDir} && npm run test`);
      log.push(testLog.stdout, testLog.stderr);
      status = 0;
    } catch ({ code, stdout, stderr }) {
      log.push(stdout, stderr);
      status = code;
    }

    const finish = new Date();
    const duration = finish.getTime() - start.getTime();

    try {
      await this.api.sendBuildResult({
        agentId: this.agentId,
        id,
        buildLog: log.join('\n'),
        status,
        duration,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default Builder;
