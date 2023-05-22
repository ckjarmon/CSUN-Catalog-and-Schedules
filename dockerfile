FROM debian:bullseye-slim

RUN apt-get update \
    && apt-get install -y python3 python3-pip \
    && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_19.x | bash - \
    && apt update && apt upgrade && apt install nodejs \
    && apt-get install gcc g++ make \
    && npm install -g typescript \
    && apt dist-upgrade 



# Set the working directory
WORKDIR /app


COPY package.json .
COPY tsconfig.json .
COPY ./run/ /app/run/

RUN npm install
RUN tsc


RUN apt-get update && apt-get upgrade -y
COPY requirements.txt .
RUN pip3 install -r requirements.txt

EXPOSE 2222


