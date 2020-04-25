import createApi from '../api/agentApi';

const STATUSES_TO_BUILD = {
  waiting: 'Waiting',
};

const AGENT_STATES = {
  idle: 'idle',
  building: 'building',
};

const CHECK_INTERVAL = 5000;

const filterBuilds = (builds) => builds.filter(
  ({ status }) => Object.values(STATUSES_TO_BUILD).includes(status),
);

class Queue {
  constructor(api) {
    this.api = api;
    this.builds = [];
    this.agents = {};
    this.timerId = null;
  }

  async fetchBuilds() {
    const builds = await this.api.getBuilds();
    this.builds = filterBuilds(builds);
  }

  start() {
    this.timerId = setInterval(async () => {
      const idleAgents = Object.values(this.agents)
        .filter(({ state }) => state === AGENT_STATES.idle);

      if (!idleAgents.length) {
        return;
      }

      if (!this.builds.length < idleAgents.length) {
        await this.fetchBuilds();
        const promises = idleAgents.reduce((acc, agent) => {
          const {
            agentId,
            id,
            repoUrl,
            commitHash,
            buildCommand,
          } = agent;
          const build = this.builds.shift();
          return build ? [...acc, this.startBuild({
            agentId,
            id,
            repoUrl,
            commitHash,
            buildCommand,
          })] : acc;
        }, []);
        Promise.all(promises).catch(console.error);
      }
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
    repoUrl,
    commitHash,
    buildCommand,
  }) {
    const agent = this.agents[agentId];

    try {
      const buildStartTime = new Date();
      agent.state = AGENT_STATES.building;
      agent.buildId = buildId;
      const agentApi = createApi(agent.baseUrl);
      await agentApi.build({
        id: buildId,
        repoUrl,
        commitHash,
        buildCommand,
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
        success: status === 1,
        buildLog,
      });
    } catch (error) {
      console.log(error);
    }

    agent.state = AGENT_STATES.idle;
    agent.buildId = null;
  }
}

export default Queue;
