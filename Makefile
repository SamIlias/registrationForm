install:
	npm install

test:
	npm test

http-server:
	npx http-server ./dist
	
bundle:
	npm run build

# build-image:
# 	docker build -t registration-form .
#
# run: build-image
# 	docker run -d -p 8080:80 registration-form
#
# deploy: bundle build-image run

build:
	docker-compose up --build -d

stop-conteiners:
	docker-compose down

