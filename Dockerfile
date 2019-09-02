# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/build /usr/share/nginx/html
COPY ./docker/start.sh /start.sh

RUN chmod +x /start.sh
#RUN /start.sh
ENTRYPOINT [ "/start.sh" ]
CMD ["nginx", "-g", "daemon off;"]