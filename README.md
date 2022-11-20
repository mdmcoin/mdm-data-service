# Waves data service API

**⚠️ This service is currently in /v0. Breaking changes are coming in /v1 (also possible, but not likely, within /v0 releases). Please use with caution.**

This is an API aimed at retrieving data from blockchain quickly and conveniently. We  support public APIs for:
- Mainnet
  - [https://apidata.mdmcoin.net/](https://apidata.wavesplatform.com/)
- Testnet
  - [https://apidatatest.mdmcoin.net/](https://apidatatest.mdmcoin.net/)

Visit `/docs` for Swagger documentation.


## Data service on-premise

It is possible to create your own instance of this service. To do so, follow the guide below.

#### Requirements

1. PostgreSQL 11 database with a table stricture found in [mdmcoin/mdmcoin-blockchain-postgres-sync](https://github.com/mdmcoin/mdmcoin-blockchain-postgres-sync)
2. Downloaded and continuously updated blockchain data in the database
2. NodeJS or Docker for either running the service directly, or in a container

#### Installation and start

The service uses following environment variables:

|Env variable|Default|Required|Description|
|------------|-------|--------|-----------|
|`PORT`|3000|NO|HTTP service port|
|`PGHOST`||YES|Postgres host address|
|`PGPORT`|`5432`|NO|Postgres port|
|`PGDATABASE`||YES|Postgres database name|
|`PGUSER`||YES|Postgres user name|
|`PGPASSWORD`||YES|Postgres password|
|`PGPOOLSIZE`|`20`|NO|Postgres pool size|
|`PGSTATEMENTTIMEOUT`|false|NO|Postgres `statement_timeout` number in ms. 0 disables timeout, false — use server settings; at this moment used only as default `STATEMENT_TIMEOUT`|
|`LOG_LEVEL`|`info`|NO|Log level `['info','warn','error']`|
|`DEFAULT_MATCHER`||YES|Default matcher public address|
|`MATCHER_SETTINGS_URL`||NO|Default matcher URL for getting settings|
|`DEFAULT_TIMEOUT`|30000|NO|Default timeout in ms; at this moment used only as `PG STATEMENT_TIMEOUT`|

`PGPOOLSIZE` is used by the `pg-pool` library to determine Postgres connection pool size per NodeJS process instance. A good value depends on your server and db configuration and can be found empirically. You can leave it at the default value to start with.

Set those variables to a `variables.env` file in the root of the project for convenience. In the next steps we will assume this file exists.

If you would like to use some other way of setting environment variables, just replace relevant commands below with custom alternatives.


##### NodeJS
1. Install dependencies
   ```bash
   npm install    # or `yarn install`, if you prefer
   ```
2. Build the server
   ```bash
   npm run build
   ```
3. Start the server
   ```bash
   export $(cat variables.env | xargs) && NODE_ENV=production node dist/index.js
   ```
 or use SCREEN
 
 ```bash
screen -d -m -S MDM-data-service  cd /mdm-data-service && export $(cat /mdm-data-service/variables.env | xargs) && NODE_ENV=production node /mdm-data-service/dist/index.js
 ```

Server will start at `localhost:PORT` (defaults to 3000). Logs will be directed to stdout.

If you decide to use NodeJS directly (without Docker), we recommend using a process manager, such as `pm2`.


#### General recommendations
- Set up a dedicated web server such as Nginx in front of data-service backends (for ssl/caching/balancing);
- Implement a caching strategy. Different endpoints may need different cache time (or no cache at all);
- Run several process instances behind a load balancer per machine. `docker-compose --scale` can help with that, or it can be done manually. A good rule of thumb is to use as many instances as CPU cores available;
- Use several machines in different data centers and a balancer to minimize downtime;
- Experiment with PostgreSQL settings to find out what works best for your configuration. Tweaking `PGPOOLSIZE` also can help performance;
- Run the sql from `mainnet.sql` to increase exchange-transactions service performance.
