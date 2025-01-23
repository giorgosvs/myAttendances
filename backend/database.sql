-- Department table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    custom_id VARCHAR(10) UNIQUE NOT NULL,
    title VARCHAR(250),
    PRIMARY KEY (id)
);

-- Curriculum table
CREATE TABLE curriculum (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(250),
    department_id VARCHAR(10),  -- Foreign key references custom_id
    curdesc VARCHAR(250),
    curtype VARCHAR(250),
    active BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(custom_id)
);

-- Course table
CREATE TABLE course (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(250) NOT NULL,
    department_id VARCHAR(10) NOT NULL,  -- Foreign key references custom_id
    coursedesc VARCHAR(250),
    coursetype VARCHAR(250),
    ects INT NOT NULL,
    semester INT NOT NULL,
    startDate VARCHAR(50),
    endDate VARCHAR(50),
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(custom_id)
);

-- Curriculum-Course mapping table
CREATE TABLE curriculum_course (
    curriculum_id INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (curriculum_id, course_id),
    FOREIGN KEY (curriculum_id) REFERENCES curriculum(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- Student table
CREATE TABLE student (
    studentid VARCHAR(20) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    department_id VARCHAR(10) NOT NULL,  -- Foreign key references custom_id
    FOREIGN KEY (department_id) REFERENCES department(custom_id)
);

-- Professor table
CREATE TABLE professor (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    ranking VARCHAR(50) NOT NULL,
    department_id VARCHAR(10) NOT NULL,  -- Foreign key references custom_id
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(custom_id)
);

-- Assignment table
CREATE TABLE assignment (
    id INT NOT NULL AUTO_INCREMENT,
    professor_id INT NOT NULL,       -- Foreign key references professor(id)
    course_id INT NOT NULL,          -- Foreign key references course(id)
    assigned_year INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (professor_id) REFERENCES professor(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id)
);

-- Class table
CREATE TABLE class (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50),
    course_id INT NOT NULL,          -- Foreign key references course(id)
    coursetype VARCHAR(50),
    PRIMARY KEY (id),
    FOREIGN KEY (course_id) REFERENCES course(id)
);

-- Enrollment table
CREATE TABLE enrollment (
    id INT NOT NULL AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL, -- Foreign key references student(studentid)
    course_id INT NOT NULL,          -- Foreign key references course(id)
    class_id INT NOT NULL,           -- Foreign key references class(id)
    enrolled_year INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (student_id) REFERENCES student(studentid),
    FOREIGN KEY (course_id) REFERENCES course(id),
    FOREIGN KEY (class_id) REFERENCES class(id),
    UNIQUE KEY unique_studcourse_class_year (student_id, course_id, class_id, enrolled_year) -- Unique constraint
);


-- Records table
CREATE TABLE records (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    course_date VARCHAR(50) NOT NULL,
    class_id INT NOT NULL,           -- Foreign key references class(id)
    PRIMARY KEY (id),
    FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE attendance (
    id INT NOT NULL AUTO_INCREMENT,
    record_id INT NOT NULL,          -- Foreign key references records(id)
    student_id VARCHAR(20) NOT NULL, -- Foreign key references student(studentid)
    present BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(studentid) ON DELETE CASCADE
);

ALTER TABLE attendance
ADD CONSTRAINT unique_attendance UNIQUE (record_id, student_id);

ALTER TABLE attendance
ADD COLUMN verified BOOLEAN DEFAULT FALSE;
