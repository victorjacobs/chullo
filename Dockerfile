FROM node:6.1
MAINTAINER Victor Jacobs <victor@chullo.io>

RUN npm install -g typings tsc forever nodemon

COPY . /app
WORKDIR /app
RUN npm install --unsafe-perm

EXPOSE 3000
CMD ["forever", "/app/dist/app.js"]
