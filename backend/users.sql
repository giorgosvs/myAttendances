DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    studentid VARCHAR(50) UNIQUE, 
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    userRole ENUM('Admin', 'Secretariat', 'Professor', 'Student') NOT NULL,
    department_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--insert enum like users
INSERT INTO users (id, username, password, name, surname, userRole, department_id)
VALUES 
(1, 'admin', 'admin123', 'Admin', 'User', 'Admin', NULL),
(11, 'secretary', 'secret123', 'Despoina', 'Mavropoulou', 'Secretariat', 'IT'),
(2, 'professor1', 'prof123', 'Alice', 'Williams', 'Professor', 'IT');

INSERT INTO users (studentid, username, password, name, surname, userRole, department_id)
VALUES 
('IT2003', 'student1', 'student123', 'Emily', 'Johnson', 'Student', 'IT');
