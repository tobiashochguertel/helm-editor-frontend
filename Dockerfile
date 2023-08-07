FROM node:14-alpine  AS builder

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
RUN yarn install
COPY ./ /app
RUN yarn run build

FROM nginx:1.25.1-alpine AS runner

WORKDIR /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY ./nginx/templates /etc/nginx/templates

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 4173