Task Management Web App

A full-stack task management application built with Spring Boot and React. This repository contains the backend service developed for Lab 1.

Tech Stack

Backend: Spring Boot, Spring Security (JWT)

Database: MariaDB

ORM: Spring Data JPA (Hibernate)

Build Tool: Maven

Quick Start
Prerequisites

JDK 17+

Maven 3.6+

MariaDB Server

Running the Application

Clone the repository:

code
Bash
download
content_copy
expand_less
git clone https://github.com/dumanrogger/task-management-web-app.git
cd task-management-web-app

Configure the database:

Create a new MariaDB database named task_management_db.

Update the database credentials in src/main/resources/application.properties:

code
Properties
download
content_copy
expand_less
spring.datasource.url=jdbc:mariadb://localhost:3306/task_management_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

Run the application:

code
Bash
download
content_copy
expand_less
mvn spring-boot:run

The backend server will start on http://localhost:8080.

Core API Endpoints

All protected endpoints require a Bearer token in the Authorization header.

Method	Endpoint	Description
POST	/api/auth/register	Registers a new user.
POST	/api/auth/login	Authenticates a user and returns a JWT.
GET	/api/tasks	Retrieves a list of all tasks.
POST	/api/tasks	Creates a new task.
POST	/api/tasks/assign	Automatically assigns a task to an available user.
