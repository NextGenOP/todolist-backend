FROM node:16.19-alpine3.16

RUN mkdir app
WORKDIR /app

COPY . .
RUN yarn
RUN yarn run tsc
CMD yarn run sequelize-cli db:migrate
CMD yarn run start
EXPOSE 8002/tcp

ENV NODE_ENV=production
ENV DB_HOST_DATABASE_PRODUCTION=postgresql-backend
ENV DB_PORT=5432
ENV DB_USER_PRODUCTION=postgres
ENV DB_PASSWORD_PRODUCTION=root
ENV DB_NAME_PRODUCTION=todo-list
ENV PORT=8002
ENV JWT_SECRET_KEY=skafjklasfklsasdajf
ENV DB_USER_PRODUCTION=postgres
ENV CORS_DOMAIN_ALLOW=https://gh-pages.todolist-frontend.pages.dev
