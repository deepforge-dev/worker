FROM node:12

LABEL maintainer1.name="Brian Broll"\
      maintainer1.email="brian.broll@gmail.com"

LABEL maintainer2.name="Umesh Timalsina"\
      maintainer2.email="umesh.timalsina@vanderbilt.edu"

SHELL ["/bin/bash", "-c"]

ENV MINICONDA Miniconda3-latest-Linux-x86_64.sh

ADD . /deepforge-worker

WORKDIR /tmp

RUN curl -O  https://repo.continuum.io/miniconda/$MINICONDA && bash $MINICONDA -b && rm -f $MINICONDA

ENV PATH /root/miniconda3/bin:$PATH
ENV NODE_ENV production

WORKDIR /deepforge-worker

RUN conda update conda -yq
RUN npm config set unsafe-perm true && npm install

ENTRYPOINT ["node", "index.js"]
