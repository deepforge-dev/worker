FROM node:12

LABEL maintainer1.name="Brian Broll"\
      maintainer1.email="brian.broll@gmail.com"

LABEL maintainer2.name="Umesh Timalsina"\
      maintainer2.email="umesh.timalsina@vanderbilt.edu"

SHELL ["/bin/bash", "-c"]

ENV MINICONDA Miniconda3-latest-Linux-x86_64.sh

ADD . /deepforge-worker

WORKDIR /tmp

RUN cd /tmp && curl -O  https://repo.continuum.io/miniconda/$MINICONDA && \
    bash $MINICONDA -b && rm -f $MINICONDA && \
    export PATH=/root/miniconda3/bin:$PATH && conda update conda -yq && \
    cd /deepforge-worker && npm config set unsafe-perm true && npm install

ENV NODE_ENV production
WORKDIR /deepforge-worker

ENTRYPOINT ["node", "index.js"]
