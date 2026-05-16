-- Shared PostgreSQL Init Script
-- Creates one database per microservice so they remain fully isolated
-- while all sharing a single Postgres container.

CREATE DATABASE auth_db;
CREATE DATABASE inventory_db;
CREATE DATABASE movement_db;
CREATE DATABASE tenant_db;
CREATE DATABASE warehousedb;
CREATE DATABASE billing_db;
CREATE DATABASE alert_db;
-- order_db is in MySQL, but we can add it here too if we ever switch
CREATE DATABASE order_db;
