FROM node:14-slim

WORKDIR /app

# Setup a path for using local npm packages
RUN mkdir -p /opt/node_modules

COPY ./package.json /app
COPY ./yarn.lock /app

RUN yarn install

COPY ./ /app

RUN yarn run build
# server build needs to run after client build because the client build using Vite
# removes the dist/ folder before compiling its code
# RUN yarn run server:build

EXPOSE 3001

CMD ["yarn", "run", "preview"]