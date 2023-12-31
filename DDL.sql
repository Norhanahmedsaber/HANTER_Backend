CREATE DATABASE hanter;
CREATE TABLE users (id SERIAL PRIMARY KEY , first_name VARCHAR(255) , last_name VARCHAR(255) , email VARCHAR(255) UNIQUE , password VARCHAR(255) , github_account VARCHAR(255));
CREATE TABLE rules (id SERIAL PRIMARY KEY, name VARCHAR(255), url VARCHAR(255), created_by INT, FOREIGN KEY(created_by) REFERENCES users(id));
CREATE TABLE projects (id SERIAL PRIMARY KEY, name VARCHAR(255), config VARCHAR(65535), url VARCHAR(255), user_id int, FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE projects_rules (project_id int, rule_id int, FOREIGN KEY(project_id) REFERENCES projects(id), FOREIGN KEY(rule_id) REFERENCES rules(id));
