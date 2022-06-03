install:
		npm ci
lint:
		npx eslint .
test:
		NODE_OPTIONS=--experimental-vm-modules npx jest
coverage:
		NODE_OPTIONS=--experimental-vm-modules npx jest --coverage --coverageProvider=v8