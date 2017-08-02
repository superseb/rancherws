FROM node

RUN npm install ws
COPY rancherws.js /rancherws.js

ENTRYPOINT [ "node", "rancherws.js" ]
