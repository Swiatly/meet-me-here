to create database on docker: 
docker run -p 5432:5432 --name meetMeHereDataBase -e POSTGRES_PASSWORD=mysecretpassword -e PGDATA=/var/lib/postgresql/data/pgdata -v /custom/mount:/var/lib/postgresql/data postgres

postgres://postgres:mysecretpassword@localhost:5432/meetMeHereDataBase