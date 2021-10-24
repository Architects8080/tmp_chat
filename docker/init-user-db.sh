#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER hysimok;
    CREATE DATABASE t11e;
    GRANT ALL PRIVILEGES ON DATABASE t11e TO hysimok;
EOSQL