import createApi from '../api/agentApi';

const STATUSES_TO_BUILD = {
  waiting: 'Waiting',
};

const AGENT_STATES = {
  idle: 'idle',
  building: 'building',
};

const CHECK_INTERVAL = 10000;

const filterBuilds = (builds, exeptionList = []) => builds.filter(
  ({ status, id }) => Object.values(STATUSES_TO_BUILD).includes(status)
    && !exeptionList.includes(id),
);

class Queue {
  constructor(api, config) {
    const {
      repoName,
      buildCommand,
    } = config;

    console.log('config is');
    console.log(config);

    this.api = api;
    this.builds = [];
    this.agents = {};
    this.timerId = null;
    this.repoName = repoName;
    this.buildCommand = buildCommand;
  }

  async fetchBuilds() {
    const builds = await this.api.getBuilds();
    const exeptionList = Object.values(this.agents)
      .reduce((acc, { buildId }) => (buildId ? [...acc, buildId] : acc), []);
    this.builds = filterBuilds(builds, exeptionList);
  }

  start() {
    this.timerId = setInterval(async () => {
      const idleAgents = Object.values(this.agents)
        .filter(({ state }) => state === AGENT_STATES.idle);

      if (!idleAgents.length) {
        return;
      }

      if (this.builds.length < idleAgents.length) {
        await this.fetchBuilds();
      }

      const promises = idleAgents.reduce((acc, agent) => {
        const { agentId } = agent;
        const build = this.builds.shift();
        return build ? [...acc, this.startBuild({
          agentId,
          id: build.id,
          commitHash: build.commitHash,
        })] : acc;
      }, []);
      Promise.all(promises).catch(console.error);
    }, CHECK_INTERVAL);
  }

  stop() {
    clearInterval(this.timerId);
  }

  addAgent({ agentId, host, port }) {
    this.agents[agentId] = {
      agentId,
      state: AGENT_STATES.idle,
      buildId: null,
      baseUrl: `http://${host}:${port}`,
    };
  }

  async startBuild({
    agentId,
    id: buildId,
    commitHash,
  }) {
    const agent = this.agents[agentId];

    try {
      const buildStartTime = new Date();
      agent.state = AGENT_STATES.building;
      agent.buildId = buildId;
      const agentApi = createApi(agent.baseUrl);
      await agentApi.build({
        id: buildId,
        repoUrl: this.repoName,
        commitHash,
        buildCommand: this.buildCommand,
      });
      await this.api.startBuild({ dateTime: buildStartTime, buildId });
      this.builds = this.builds.filter(({ id }) => id !== buildId);
    } catch (error) {
      agent.state = AGENT_STATES.idle;
      agent.buildId = buildId;
      console.error(error);
    }
  }

  async finishBuild({
    agentId,
    id,
    buildLog,
    status,
    duration,
  }) {
    const agent = this.agents[agentId];

    try {
      await this.api.finishBuild({
        buildId: id,
        duration,
        success: parseInt(status, 10) === 0,
        buildLog,
      });
    } catch (error) {
      console.error(error);
    }

    agent.state = AGENT_STATES.idle;
    agent.buildId = null;
  }
}

export default Queue;
