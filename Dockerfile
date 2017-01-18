FROM alpine:3.4
MAINTAINER Victor Jacobs <victor@chullo.io>

# Install dumb-init
RUN apk add --no-cache --virtual .build-deps \
        alpine-sdk \
        bash \
        wget \
    && mkdir /tmp/build \
    && cd /tmp/build \
    && wget https://github.com/Yelp/dumb-init/archive/v1.2.0.tar.gz \
    && tar -xf v1.2.0.tar.gz \
    && cd dumb-init-1.2.0 \
    && make \
    && mv dumb-init /usr/local/bin \
    && cd && rm -rf /tmp/build \
    && apk del .build-deps

# Node and npm packages
RUN apk add --no-cache nodejs \
    && npm install -g typescript forever yarn

COPY . /app
WORKDIR /app
VOLUME /app/uploads
RUN apk add --no-cache --virtual .build-deps \
        alpine-sdk \
        python \
    && apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing \
        vips-dev \
    && yarn install --production \
    && npm run build \
    && git rev-parse HEAD > dist/VERSION \
    && apk del .build-deps

EXPOSE 3000
CMD ["dumb-init", "forever", "dist/app.js"]
