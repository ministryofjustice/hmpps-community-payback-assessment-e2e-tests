FROM cypress/included as e2e

RUN apt-get update
RUN apt-get install -y nodejs npm

WORKDIR /e2e
ADD . .

RUN npm install
