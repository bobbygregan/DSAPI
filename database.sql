CREATE TABLE users ( id INTEGER PRIMARY KEY,name TEXT,email TEXT, pswd TEXT);

CREATE TABLE used_cars (id INTEGER PRIMARY KEY, year TEXT, km INTEGER, price NUMERIC, user_id INTEGER, model TEXT);


CREATE TABLE dealership_messages (id INTEGER PRIMARY KEY, message TEXT, rating INTEGER, salesperson TEXT, servicedepartment TEXT, price NUMERIC); 

CREATE TABLE dealership (id INTEGER PRIMARY KEY, name TEXT, address TEXT, city TEXT);