FROM bee-travels/node-base:v1 as ui

WORKDIR /services/ui/frontend

COPY frontend .

RUN yarn build


FROM bee-travels/node-base:v1 as release

WORKDIR /services/ui/backend

COPY --from=ui /services/ui/frontend/build client/build
COPY  backend/index.js backend/doc-collector.js backend/info-collector.js backend/streamableAxios.js backend/package.json ./

EXPOSE 9000

CMD ["yarn", "node", "index.js"]
