lint:
	eslint .

install-server:
	cd server && npm ci

install-agent:
	cd agent && npm ci

develop-server:
	cd server && npm start

develop-agent:
	cd agent && npm start

build-server:
	cd server && rm -rf dist && npm run build

build-agent:
	cd agent && rm -rf dist && npm run build

start-server:
	cd server && npm run start:prod

start-agent:
	cd agent && npm run start:prod

install:
	make install-server
	make install-agent

build:
	make build-server
	make build-agent
