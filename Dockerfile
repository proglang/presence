# build environment
FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install
#RUN npm install react-scripts@3.0.1
COPY . /app
RUN npm run build
#CMD ["npm", "run", "build"]

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/docker/start.sh /start.sh
COPY --from=build /app/build/config.js /usr/share/nginx/html/config_default.js

RUN chmod +x /start.sh
ENTRYPOINT /start.sh