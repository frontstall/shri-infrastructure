lint-agent:
	cd agent && eslint .

lint-servet:
	cd server && eslint .

lint: lint-agent && lint-server
