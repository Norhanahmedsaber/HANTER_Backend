

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    config JSON,
    url VARCHAR(255),
    user_id INTEGER,
    last_scan TIMESTAMP,
    vuls JSON
);
CREATE TABLE projects_rules (
    project_id INTEGER,
    rule_id INTEGER,
    PRIMARY KEY (project_id, rule_id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (rule_id) REFERENCES rules(id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    github_account VARCHAR(255),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE rules (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    sevirty VARCHAR(255) NOT NULL,
    created_by INTEGER,
    uuid UUID NOT NULL,
    public BOOLEAN

);


CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    project_id INTEGER,
    filepath VARCHAR(255) NOT NULL,
    line INT,
    col INT,
    rule_name VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);




