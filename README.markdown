Setup
=====

Database
--------

Install Postgres, and log in as the `postgres` user with psql.

```
CREATE USER zotago WITH PASSWORD 'secret';
CREATE DATABASE zotago_development;
GRANT ALL PRIVILEGES ON DATABASE zotago_development TO zotago;
```

Amend `config/config.json` with the password you chose.

Run `seeders/seed.js` to populate the database with some dummy data and test
that everything works.


Email
-----

Amend `config/email.json` with your SMTP server settings and credentials.
Note that if you use an unsafe TLS certificate, node will need the environment
variable `NODE_TLS_REJECT_UNAUTHORIZED=0`.
