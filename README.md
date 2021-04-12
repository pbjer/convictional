# Convictional Engineering Challenge V3


To run the application locally, run `docker compose up` from the root of project.

This will build and run two containers, one for NodeJS and one for Postgres.

1. Postgres will initialize and create the database, user, and required extension for use by the application based on the files in `/postgres/init`.

2. The Node application will run the schema migrations against the database.

3. The Node application will then call any external APIs defined in `/node/src/seed/sources.js`, format the data based on the supplied mapping function in the source config, and seed the database with it.

4. Once all the above steps are complete, the http server will initialize and expose the following routes via `localhost:3000`:
    - GET /products
    - GET /products/:productId
    - GET /store/inventory

Note: The Node container will log an error during step 3, because I made the decision to add a unique constraint on the images table to prevent what would be considered duplicate data in a production environment. This is intended behavior.
