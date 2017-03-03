TO run use the  server 

./bin/www 
local host 8000
tables are 
CREATE TABLE users ( id SERIAL PRIMARY KEY,name TEXT,email TEXT, pswd TEXT);

CREATE TABLE used_cars (id SERIAL PRIMARY KEY, year TEXT, km INTEGER, price NUMERIC, user_id INTEGER, model TEXT);


CREATE TABLE dealership_messages (id SERIAL PRIMARY KEY, message TEXT, rating INTEGER, salesperson TEXT, servicedepartment TEXT, price NUMERIC); 

CREATE TABLE dealership (id SERIAL PRIMARY KEY, name TEXT, address TEXT, city TEXT);  

clone repo @ https://bobbygregan.github.io/DSAPI/.