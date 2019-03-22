FROM ubuntu:latest

# ---
# ---
# ---

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
        build-essential \
        pkg-config \
        python python-dev \
        libkrb5-dev \
        libcairo2-dev \
        libjpeg-dev \
        libgif-dev && \
    apt-get clean

# ---
# ---
# ---

RUN curl --location https://bootstrap.pypa.io/get-pip.py | python

RUN pip install awscli awsebcli

# ---
# ---
# ---

RUN curl --location https://deb.nodesource.com/setup_10.x | bash -

RUN apt-get install -y nodejs

# ---
# ---
# ---

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install yarn

# ---
# ---
# ---

RUN npm install -g serverless@1.39.1

# ---
# ---
# ---

ADD . /root

WORKDIR /root/

# ---
