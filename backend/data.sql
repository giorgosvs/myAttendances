-- Inserting departments with custom_id
INSERT INTO department (custom_id, title) 
VALUES 
('IT', 'Informatics and Telematics'),
('DE', 'Nutrition and Dietetics'),
('GE', 'Geography');

-- Inserting curriculum for departments
INSERT INTO curriculum (title, department_id, curdesc, curtype, active) 
VALUES 
('2023-2024 Computer Science Pregraduate Curriculum', 'IT', 'Pregraduate courses for the Computer Science program.', 'Pregraduate', FALSE),
('2023-2024 Computer Science Postgraduate Curriculum', 'IT', 'Postgraduate courses for the Computer Science program.', 'Postgraduate', FALSE),
('2023-2024 Nutrition and Dietetics Pregraduate Curriculum', 'DE', 'Pregraduate courses for the Nutrition and Dietetics program.', 'Pregraduate', FALSE),
('2023-2024 Nutrition and Dietetics Postgraduate Curriculum', 'DE', 'Postgraduate courses for the Nutrition and Dietetics program.', 'Postgraduate', FALSE),
('2023-2024 Geography Pregraduate Curriculum', 'GE', 'Pregraduate courses for the Geography program.', 'Pregraduate', FALSE),
('2023-2024 Geography Postgraduate Curriculum', 'GE', 'Postgraduate courses for the Geography program.', 'Postgraduate', FALSE);

-- Inserting courses for departments
INSERT INTO course (title, department_id, coursedesc, coursetype, ects, semester, startDate, endDate) 
VALUES 
-- Informatics and Telematics courses
('Introduction to Programming', 'IT', 'Learn the fundamentals of programming using Python.', 'Core', 6, 1, '2023-09-01', '2023-12-20'),
('Data Structures and Algorithms', 'IT', 'Study efficient algorithms and complex data structures.', 'Core', 6, 2, '2024-02-01', '2024-05-30'),
('Database Systems', 'IT', 'Learn database design and SQL programming.', 'Core', 5, 1, '2023-09-01', '2023-12-20'),
('Operating Systems', 'IT', 'Understand the workings of operating systems and processes.', 'Core', 6, 2, '2024-02-01', '2024-05-30'),
('Artificial Intelligence', 'IT', 'Introduction to AI concepts and machine learning algorithms.', 'Elective', 4, 2, '2024-02-01', '2024-05-30'),
('Web Development', 'IT', 'Build web applications using HTML, CSS, JavaScript.', 'Elective', 5, 1, '2023-09-01', '2023-12-20'),

-- Nutrition and Dietetics courses
('Introduction to Human Nutrition', 'DE', 'Study the basics of human nutrition and macronutrients.', 'Core', 5, 1, '2023-09-01', '2023-12-20'),
('Medical Nutrition Therapy', 'DE', 'Learn nutrition interventions for various diseases.', 'Core', 6, 2, '2024-02-01', '2024-05-30'),
('Community Nutrition', 'DE', 'Explore nutrition programs in public health settings.', 'Core', 5, 1, '2023-09-01', '2023-12-20'),
('Sports Nutrition', 'DE', 'Study how nutrition impacts athletic performance.', 'Elective', 4, 2, '2024-02-01', '2024-05-30'),
('Food Safety and Sanitation', 'DE', 'Understand food safety principles and prevention of foodborne illnesses.', 'Elective', 4, 1, '2023-09-01', '2023-12-20');

-- Geography department courses
INSERT INTO course (title, department_id, coursedesc, coursetype, ects, semester, startDate, endDate)
VALUES
('Physical Geography', 'GE', 'Introduction to landforms, climate, and natural processes.', 'Core', 5, 1, '2023-09-01', '2023-12-20'),
('Geographical Information Systems', 'GE', 'Using GIS for spatial data analysis.', 'Core', 6, 2, '2024-02-01', '2024-05-30'),
('Human Geography', 'GE', 'Study of human activities and their relationship to the environment.', 'Core', 5, 1, '2023-09-01', '2023-12-20'),
('Environmental Policy and Management', 'GE', 'Analysis of environmental management practices.', 'Elective', 4, 2, '2024-02-01', '2024-05-30');

-- Inserting students
INSERT INTO student (name, surname, studentid, department_id)
VALUES 
('John', 'Doe', 'IT2001', 'IT'),
('Jane', 'Smith', 'DE2002', 'DE'),
('Emily', 'Johnson', 'IT2003', 'IT'),
('Michael', 'Brown', 'GE2004', 'GE'),
('Emma', 'Davis', 'DE2005', 'DE'),
('Olivia', 'Wilson', 'IT2006', 'IT'),
('Liam', 'Moore', 'IT2007', 'IT'),
('Noah', 'Taylor', 'GE2008', 'GE'),
('Sophia', 'Anderson', 'DE2009', 'DE'),
('James', 'Thomas', 'DE2010', 'DE');

-- Inserting professors
INSERT INTO professor (name, surname, ranking, department_id)
VALUES 
('Alice', 'Williams', 'Professor', 'IT'),
('Robert', 'Miller', 'Associate Professor', 'DE'),
('Laura', 'Harris', 'Assistant Professor', 'GE'),
('David', 'Clark', 'Lecturer', 'IT'),
('Linda', 'Martin', 'Professor', 'DE'),
('Ethan', 'Baker', 'Professor', 'IT'),
('Isabella', 'Garcia', 'Associate Professor', 'IT'),
('Benjamin', 'Rodriguez', 'Assistant Professor', 'IT'),
('Lucas', 'Martinez', 'Lecturer', 'IT'),
('Mia', 'Perez', 'Professor', 'IT'),
('Despoina','Mavropoulou','Secretariat','IT'),
('Tom','Williams','Secretariat','GE'),
('Maria','Cortaki','Secretariat','DE');

-- Assigning professors to courses
INSERT INTO assignment (professor_id, course_id, assigned_year)
VALUES
(1, 1, 2023),  -- Alice Williams assigned to Introduction to Programming in 2023
(2, 2, 2024),  -- Robert Miller assigned to Data Structures and Algorithms in 2024
(3, 3, 2023),  -- Laura Harris assigned to Database Systems in 2023
(4, 4, 2024),  -- David Clark assigned to Operating Systems in 2024
(5, 5, 2023);  -- Linda Martin assigned to Artificial Intelligence in 2023

-- Inserting classes
INSERT INTO class (title, course_id, coursetype)
VALUES 
('Introduction to Programming - Theory', 1, 'Theory Course'),
('Introduction to Programming - Lab', 1, 'Lab Course'),
('Data Structures and Algorithms - Theory', 2, 'Theory Course'),
('Data Structures and Algorithms - Lab', 2, 'Lab Course'),
('Database Systems - Theory', 3, 'Theory Course');

-- Inserting enrollments
INSERT INTO enrollment (student_id, course_id, class_id, enrolled_year)
VALUES
('IT2001', 1, 1, 2023),
('DE2002', 2, 2, 2024),
('IT2003', 3, 3, 2023);

-- Inserting records
INSERT INTO records (title, course_date, class_id)
VALUES
('Introduction to Programming - Lecture 1', '2023-09-01', 1);

-- Inserting attendance
INSERT INTO attendance (record_id, student_id, present)
VALUES
(1, 'IT2001', TRUE),
(1, 'DE2002', FALSE);
