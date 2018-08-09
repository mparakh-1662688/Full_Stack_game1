-- Name: Mohneel Parakh
-- TA: Brian Dai
-- Assignment-7
-- this file creates the database where the pokemon information get stored.

CREATE DATABASE IF NOT EXISTS hw7;

use hw7;

DROP TABLE IF EXISTS Pokedex;

CREATE TABLE Pokedex (
	name VARCHAR(30) PRIMARY KEY,
	nickname VARCHAR(30),
	datefound DATETIME
);


