TESTS      = $(shell find tests -type f -name test-*.js)

-TEST-ENV := ./node/index.js

-MOCHA    := ./node_modules/.bin/mocha

default: dev

dev: npm-install test-pre

test-pre: unitTests

unitTests:
	@echo "\033[31m begin unit test!\033[39;49;0m\n"
	@$(-MOCHA) \
		--colors \
		--reporter spec \
		$(TESTS)

npm-install:
	@echo "\033[31m checking node modules... \033[39;49;0m\n"
	@npm install
	@echo "\033[32m node modules are all clear! \033[39;49;0m\n"

commit:
	@echo "code committing"
	@git add .
	@git commit -a
	@git push
