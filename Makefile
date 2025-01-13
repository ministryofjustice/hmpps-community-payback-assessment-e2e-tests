SHELL = '/bin/bash'
PROJECT_NAME = hmpps-arn-acceptance-tests
TEST_COMPOSE_FILES = -f docker-compose.yml -f docker-compose.test.yml
LOCAL_COMPOSE_FILES = -f docker-compose.yml -f docker-compose.local.yml
export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

pull: ## Pulls the latest containers
	docker compose pull --policy missing

up: ## Starts the UI in a production container.
	docker compose ${LOCAL_COMPOSE_FILES} up community-payback-assessment-ui --wait --no-recreate

down: ## Stops and removes all containers in the project.
	docker compose ${LOCAL_COMPOSE_FILES} down
	make test-down

test-up: pull ## Stands up a test environment.
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test up community-payback-assessment-ui --wait --force-recreate

test-down: ## Stops and removes all of the test containers.
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test down

BASE_URL ?= "http://localhost:3000"
e2e: up ## Run the end-to-end tests locally in the Cypress app. Override the default base URL with BASE_URL=...
	npm i
	npx cypress install
	npx cypress open -c baseUrl=$(BASE_URL)

BASE_URL_CI ?= "http://community-payback-assessment-ui:3000"
e2e-ci: ## Run the end-to-end tests in parallel in a headless browser. Used in CI. Override the default base URL with BASE_URL_CI=...
	docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test run --rm cypress --headless -b edge -c baseUrl=${BASE_URL_CI}
	#circleci tests glob "cypress/integration/features/**/*.feature" | circleci tests split --split-by=timings --verbose | paste -sd ',' > tmp_specs.txt
	#cat tmp_specs.txt
	#rm -R -f cypress/reports && mkdir cypress/reports
	#docker compose ${TEST_COMPOSE_FILES} -p ${PROJECT_NAME}-test run --rm cypress --headless -b edge -c baseUrl=${BASE_URL_CI} -s "$$(<tmp_specs.txt)"
