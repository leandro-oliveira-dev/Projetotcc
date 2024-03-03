## Preencher variveis no arquivo .env

DATABASE_URL=
PORT=
SECRET_KEY=

## Instalacao do postgres via docker

`docker build -t postgres-image .`

## Inicializa o container docker do postgres

`docker run -d -p 5432:5432 --name postgres-container postgres-image`

## Inicializar container

`docker start postgres-container`

# Prisma

## Atualizar prisma client class

`yarn prisma generate`

## Seed DB initial data

`yarn prisma db seed`

## Sincronizar o banco de dados com as migrations

`yarn prisma migrate dev`

## Criar nova migration (APENAS AO ALTERAR SCHEMA DO PRISMA)

`yarn prisma migrate dev --name <NOME_DA_MIGRATION>`
