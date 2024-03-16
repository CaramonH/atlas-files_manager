FROM ubuntu:18.04

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    vim \
    emacs \
    locales \
    build-essential

RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# MongoDB
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" > /etc/apt/sources.list.d/mongodb-org-4.2.list
RUN mkdir -p /data/db
RUN apt-get update

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/Chicago
RUN apt-get install -y tzdata

RUN apt-get install -y mongodb-org

# Node JS
RUN curl -sl https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh

RUN apt-get update && apt-get install -y nodejs

# Install redis server and the redis client
RUN apt-get -y install redis-server

RUN sed -i "s/bind .*/bind 127.0.0.1/g" /etc/redis/redis.conf

RUN mkdir /tmp/node_packages
# COPY package.json /tmp/node_packages/package.json
RUN cd /tmp/node_packages && npm install

# Create test user
RUN useradd -M correction_tester

# Keep the container running indef
CMD ["tail", "-f", "/dev/null"]
