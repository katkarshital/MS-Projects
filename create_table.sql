/***********************************************************
* Create the database named orderdb and all of its tables
************************************************************/

DROP DATABASE IF EXISTS orderdb;

CREATE DATABASE orderdb;

USE orderdb;


CREATE TABLE Orders (
  OrderID INT NOT NULL AUTO_INCREMENT,
  grandTotal DOUBLE(10,2),
  noOfPizza INT,
  PRIMARY KEY(OrderID)
);

CREATE TABLE PizzaDetails (
  PizzaID INT NOT NULL AUTO_INCREMENT,
  TypeOfPizza VARCHAR(50),
  SizeOfPizza VARCHAR(50),
  extra INT,
  qty INT,
  PRIMARY KEY(PizzaID) 
);


