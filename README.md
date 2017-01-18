# Chullo

Chullo is an application you can throw files to in a RESTful way and then will serve them. Basically CloudApp, but self-hosted.

Currently there are a [CLI client](https://github.com/victorjacobs/chullo-client) and an [iOS app](https://github.com/victorjacobs/chullo-ios). Neither of these are actually very feature complete nor stable, but are complete enough for my use.

## Running

You can run the server in one of two ways. Either with docker-compose or by installing dependencies and building manually.

### Docker

1. `docker-compose up`
2. Application is available on port 3000

### Manual

1. Install dependencies: MongoDB, Node, Typescript, Yarn (and maybe some sort of toolchain to build *bcrypt* and *sharp*)
2. `yarn install`
3. `node dist/app.js`
4. Application is running on port 3000
