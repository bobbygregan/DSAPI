Project DriveSave
 
The project is DriveSave API, it's a back end of postgrest sql. It allows web tokens for verification It is a out of the box run of the mill back end API. It’s most note worthy features are, pullings cars info and users info. The key concept it to make sure that the info is pulled correctly and shows user info while secure.
Here is the front end https://github.com/bobbygregan/DriveSave.git
And the back end 
https://github.com/bobbygregan/DSAPI.git
Code example 
TO run use the server
./bin/www local host 8000 tables are CREATE TABLE users ( id SERIAL PRIMARY KEY,name TEXT,email TEXT, pswd TEXT);
CREATE TABLE used_cars (id SERIAL PRIMARY KEY, year TEXT, km INTEGER, price NUMERIC, user_id INTEGER, model TEXT);
CREATE TABLE dealership_messages (id SERIAL PRIMARY KEY, message TEXT, rating INTEGER, salesperson TEXT, servicedepartment TEXT, price NUMERIC);
CREATE TABLE dealership (id SERIAL PRIMARY KEY, name TEXT, address TEXT, city TEXT);
 
Motivation
 
 
The API back end exists to hold the info of the users and create tokens for logins. 
Its the run of the mill out of the box back end API that users use with insomnia, and postgres. I enjoyed using SQL and I always wanted to learn how to use it. It also went hand and hand with the info I was collecting from users. 
Contributing
 
 
Include any essential instructions for:
Make sure you have Postgresql installed, Insomnie to run the data pulled and the tokens. Clone the repo. 
Getting it
Contributing
 
Contributor bobbygregan
Format commite messages as update
Thank you
Next steps
Next step it to link the two 
Adding pictures 
Bugs are known and data isn’t in a consistent environment as of yet
Features planned
Known bugs (shortlist)
Contact
 
Email address
robertgregan89@gmail.com
License
Project DriceSave
 
 
