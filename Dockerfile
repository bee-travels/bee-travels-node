FROM node:12.11.0-alpine

COPY .yarn .yarn
COPY .pnp.js .
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .
