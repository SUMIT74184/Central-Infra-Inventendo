-- Shared PostgreSQL Init Script
-- Creates one database per microservice so they remain fully isolated
-- while all sharing a single Postgres container.

CREATE DATABASE auth_db;
CREATE DATABASE inventory_db;
CREATE DATABASE movement_db;
CREATE DATABASE tenant_db;
CREATE DATABASE warehousedb;
CREATE DATABASE billing_db;
-- order-service uses MySQL (kept separate, see order-mysql service)
