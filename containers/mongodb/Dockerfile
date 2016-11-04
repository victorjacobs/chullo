FROM alpine:3.4

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

RUN apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing \
        mongodb \
    && rm /usr/bin/mongosniff /usr/bin/mongoperf

VOLUME /data/db
EXPOSE 27017 28017

CMD ["dumb-init", "mongodb"]
