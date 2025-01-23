import express from "express";
import cors from "cors";
import { pool } from "./database.js";
import {
  getAllCourses,
  getCourse,
  createCourse,
  deleteCourseById,
  updateCourseById,
} from "./CRUD/courses.js";
import {
  createDepartment,
  deleteDepartmentById,
  getAllDepartments,
  getDepartmentById,
  updateDepartmentById,
} from "./CRUD/departments.js";
import {
  createCurriculum,
  deleteCurriculumById,
  getAllCurriculums,
  getCurriculum,
  updateCurriculumById,
} from "./CRUD/curriculums.js";
import {
  createClass,
  getAllClasses,
  getClass,
  deleteClassById,
  updateClassById,
} from "./CRUD/classes.js";
import {
  createStudent,
  deleteStudentById,
  getAllStudents,
  getStudent,
  updateStudentById,
} from "./CRUD/students.js";
import {
  createProfessor,
  deleteStaffById,
  getAllProfessors,
  getProfessor,
  updateStaffById,
} from "./CRUD/professors.js";
import {
  getAllAssignments,
  getAssignment,
  createAssignment,
} from "./CRUD/assignments.js";
import {
  createEnrollment,
  getEnrollment,
  getAllEnrollments,
  deleteEnrollment,
  updateEnrollment,
} from "./CRUD/enrollments.js";
import {
  createRecord,
  deleteRecordById,
  getAllRecords,
  getRecord,
  updateRecordById,
} from "./CRUD/records.js";
import {
  createAttendance,
  deleteAttendanceById,
  getAllAttendances,
  getAttendance,
  getAttendanceByRecordId,
  getAttendanceByStudentId,
  updateAttendanceById,
} from "./CRUD/attendances.js";
import {
  getAllCurriculumCourses,
  getCurriculumCourses,
} from "./CRUD/curriculumCourses.js";

const app = express();
app.use(express.json());
app.use(cors());
const router = express.Router();

//CRUD mapping for courses API

app.get("/api/courses", async (req, res) => {
  const courses = await getAllCourses();
  res.send(courses);
});

app.get("/api/courses/:id", async (req, res) => {
  const id = req.params.id;
  const course = await getCourse(id);
  res.send(course);
});

app.post("/api/courses", async (req, res) => {
  const {
    title,
    department_id,
    coursedesc,
    coursetype,
    ects,
    semester,
    startDate,
    endDate,
  } = req.body;
  const course = await createCourse(
    title,
    department_id,
    coursedesc,
    coursetype,
    ects,
    semester,
    startDate,
    endDate
  );
  res.status(201).send(course);
});

app.delete("/api/courses/:id", async (req, res) => {
  const id = req.params.id;
  const deletedCourse = await deleteCourseById(id);
  res.send(deletedCourse);
});

app.put("/api/courses/:id", async (req, res) => {
  const id = req.params.id;
  const {
    title,
    department_id,
    coursedesc,
    coursetype,
    ects,
    semester,
    startDate,
    endDate,
  } = req.body;
  const updatedCourse = await updateCourseById(
    id,
    title,
    department_id,
    coursedesc,
    coursetype,
    ects,
    semester,
    startDate,
    endDate
  );
  res.status(201).send(updatedCourse);
});

//CRUD mapping for department API

app.get("/api/departments", async (req, res) => {
  const departments = await getAllDepartments();
  res.send(departments);
});

app.get("/api/departments/:id", async (req, res) => {
  const id = req.params.id;
  const department = await getDepartmentById(id);
  res.send(department);
});

app.post("/api/departments", async (req, res) => {
  const { title,custom_id } = req.body;
  const department = await createDepartment(title,custom_id);
  res.status(201).send(department);
});


app.delete("/api/departments/:id", async (req, res) => {
  const id = req.params.id;
  const deletedDepartment = await deleteDepartmentById(id);
  res.send(deletedDepartment);
});



app.put("/api/departments/:id", async (req, res) => {
  const id = req.params.id;
  const { title, custom_id } = req.body;

  if (!title || !custom_id) {
    return res.status(400).send({ error: "Both title and custom_id are required" });
  }

  try {
    const updatedDepartment = await updateDepartmentById(id, title, custom_id);
    res.status(200).send(updatedDepartment);
  } catch (err) {
    console.error("Error updating department:", err);
    res.status(500).send({ error: "Failed to update department" });
  }
});

//CRUD mapping for curriculum API

app.get("/api/curriculums", async (req, res) => {
  const curriculums = await getAllCurriculums();
  res.send(curriculums);
});

app.get("/api/curriculums/:id", async (req, res) => {
  const id = req.params.id;
  const curriculum = await getCurriculum(id);
  res.send(curriculum);
});

app.post("/api/curriculums", async (req, res) => {
  const { title, department_id, curdesc, curtype, active } = req.body;
  const curriculum = await createCurriculum(
    title,
    department_id,
    curdesc,
    curtype,
    active
  );
  res.status(201).send(curriculum);
});

app.delete("/api/curriculums/:id", async (req, res) => {
  const id = req.params.id;
  const deletedCurriculum = await deleteCurriculumById(id);
  res.send(deletedCurriculum);
});

app.put("/api/curriculums/:id", async (req, res) => {
  const id = req.params.id;
  const { title, department_id, curdesc, curtype, active } = req.body;
  const updatedCurriculum = await updateCurriculumById(
    id,
    title,
    department_id,
    curdesc,
    curtype,
    active
  );
  res.status(201).send(updatedCurriculum);
});

//CRUD mapping for curriculum_courses API

app.get("/api/curriculum_course", async (req, res) => {
  const curriculum_courses = await getAllCurriculumCourses();
  res.send(curriculum_courses);
});

app.get("/api/curriculum_course/:id", async (req, res) => {
  const curriculum_id = req.params.id;
  const course = await getCurriculumCourses(curriculum_id);
  res.send(course);
});

app.post("/api/curriculum_course", async (req, res) => {
  const { curriculum_id, course_id } = req.body;

  try {
    const query =
      "INSERT INTO curriculum_course (curriculum_id, course_id) VALUES (?, ?)";
    const [result] = await pool.query(query, [curriculum_id, course_id]);

    res
      .status(201)
      .json({ message: "Course associated with curriculum successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to associate course with curriculum" });
  }
});

//returns an array of courses that are assigned to a curriculum_id.
app.get("/api/curriculums/:id/courses", async (req, res) => {
  const curriculumId = req.params.id;

  try {
    const query =
      "SELECT course_id FROM curriculum_course WHERE curriculum_id = ?";
    const [rows] = await pool.query(query, [curriculumId]);

    const courseIds = rows.map((row) => row.course_id); // Extract the course_ids
    res.status(200).json(courseIds);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to retrieve courses for the curriculum" });
  }
});

//CRUD mapping for class API

app.get("/api/classes", async (req, res) => {
  const classes = await getAllClasses();
  res.send(classes);
});

app.get("/api/classes/:id", async (req, res) => {
  const id = req.params.id;
  const aclass = await getClass(id);
  res.send(aclass);
});

app.post("/api/classes", async (req, res) => {
  const { title, course_id, coursetype } = req.body;
  const cl = await createClass(title, course_id, coursetype);
  res.status(201).send(cl);
});

app.delete("/api/classes/:id", async (req, res) => {
  const id = req.params.id;
  const deletedClass = await deleteClassById(id);
  res.send(deletedClass);
});

app.put("/api/classes/:id", async (req, res) => {
  const id = req.params.id;
  const { title, course_id, coursetype } = req.body;
  const updatedClass = await updateClassById(id, title, course_id, coursetype);
  res.status(201).send(updatedClass);
});

app.get("/api/classes/:id/records", async (req, res) => {
  const classId = req.params.id; // Extract the class ID from the route parameters

  try {
    // Query the records table for records with the matching class_id
    const query = "SELECT * FROM records WHERE class_id = ?";
    const [records] = await pool.query(query, [classId]);

    // Send back the matching records as the response
    res.json(records);
  } catch (err) {
    console.error("Error fetching records:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching records." });
  }
});

//CRUD mapping for students API

app.get("/api/students", async (req, res) => {
  const students = await getAllStudents();
  res.send(students);
});

app.get("/api/students/:id", async (req, res) => {
  const id = req.params.id;
  const student = await getStudent(id);
  res.send(student);
});

app.post("/api/students", async (req, res) => {
  const { studentid, name, surname, department_id } = req.body;
  const student = await createStudent(studentid, name, surname, department_id);
  res.status(201).send(student);
});

app.delete("/api/students/:id", async (req, res) => {
  const id = req.params.id;
  const deletedStudent = await deleteStudentById(id);
  res.send(deletedStudent);
});

app.put("/api/students/:id", async (req, res) => {
  const studentid = req.params.id;
  const { name, surname, department_id } = req.body;
  const updatedStudent = await updateStudentById(
    studentid,
    name,
    surname,
    department_id
  );
  res.status(201).send(updatedStudent);
});

//CRUD mapping for professors API

app.get("/api/professors", async (req, res) => {
  const professors = await getAllProfessors();
  res.send(professors);
});

app.get("/api/professors/:id", async (req, res) => {
  const id = req.params.id;
  const student = await getProfessor(id);
  res.send(student);
});

app.post("/api/professors", async (req, res) => {
  const { name, surname, ranking, department_id } = req.body;
  const professor = await createProfessor(
    name,
    surname,
    ranking,
    department_id
  );
  res.status(201).send(professor);
});

app.delete("/api/professors/:id", async (req, res) => {
  const id = req.params.id;
  const deletedStaff = await deleteStaffById(id);
  res.send(deletedStaff);
});

//returns an array of courses that are assigned to a curriculum_id.
app.get("/api/professors/:id/courses", async (req, res) => {
  const professorId = req.params.id;

  try {
    const query = "SELECT course_id FROM assignment WHERE professor_id = ?;";
    const [rows] = await pool.query(query, [professorId]);

    const courseIds = rows.map((row) => row.course_id); // Extract the course_ids
    res.status(200).json(courseIds);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to retrieve courses for the curriculum" });
  }
});

app.put("/api/professors/:id", async (req, res) => {
  const id = req.params.id;
  const { name, surname, ranking, department_id } = req.body;
  const updatedProfessor = await updateStaffById(
    id,
    name,
    surname,
    ranking,
    department_id
  );
  res.status(201).send(updatedProfessor);
});

//CRUD mapping for assignment API

app.get("/api/assignments", async (req, res) => {
  const assignments = await getAllAssignments();
  res.send(assignments);
});

app.get("/api/assignments/:id", async (req, res) => {
  const id = req.params.id;
  const assignment = await getAssignment(id);
  res.send(assignment);
});

app.post("/api/assignments", async (req, res) => {
  const { professor_id, course_id, assigned_year } = req.body;
  const assignment = await createAssignment(
    professor_id,
    course_id,
    assigned_year
  );
  res.status(201).send(assignment);
});

app.delete("/api/assignments/professor/:professorId", async (req, res) => {
  const professorId = req.params.professorId;
  try {
    const q = "DELETE FROM assignment WHERE professor_id = ?";
    await pool.query(q, [professorId]);
    res.status(200).send("All assignments for the professor have been deleted.");
  } catch (err) {
    console.error("Error deleting assignments:", err);
    res.status(500).send("Failed to delete assignments.");
  }
});

app.delete("/api/assignments/:id", async (req, res) => {
  const assignmentId = req.params.id;
  try {
    const result = await pool.query("DELETE FROM assignment WHERE id = ?", [assignmentId]);
    if (result.affectedRows === 0) {
      return res.status(404).send("Assignment not found.");
    }
    res.send("Assignment deleted successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting assignment.");
  }
});


// Endpoint to fetch assignments for a specific professor
app.get("/api/professors/:professor_id/assignments", async (req, res) => {
  const professor_id = req.params.professor_id;

  try {
    // Query the database for assignments by professor_id
    const [assignments] = await pool.query(
      "SELECT * FROM assignment WHERE professor_id = ?",
      [professor_id]
    );

    res.status(200).send(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).send({ error: "Failed to fetch assignments." });
  }
});



//CRUD mapping for enrollment API

app.get("/api/enrollments", async (req, res) => {
  const enrollments = await getAllEnrollments();
  res.send(enrollments);
});

app.get("/api/enrollments/:id", async (req, res) => {
  const id = req.params.id;
  const enrollment = await getEnrollment(id);
  res.send(enrollment);
});

app.post("/api/enrollments", async (req, res) => {
  const { student_id, course_id, class_id, enrolled_year } = req.body;
  const enrollment = await createEnrollment(
    student_id,
    course_id,
    class_id,
    enrolled_year
  );
  res.status(201).send(enrollment);
});

app.delete("/api/enrollments/:id", async (req, res) => {
  const id = req.params.id;
  const deletedEnrollment = await deleteEnrollment(id);
  res.send(deletedEnrollment);
});

app.put("/api/enrollments/:id", async (req, res) => {
  const id = req.params.id;
  const { student_id, course_id, class_id, enrolled_year } = req.body;
  const updatedEnrollment = await updateEnrollment(
    id,
    student_id, course_id, class_id, enrolled_year
  );
  res.status(201).send(updatedEnrollment);
});

let bulkInsertLog = []; // Global array to track bulk insertion IDs

app.post("/api/enrollments/bulk", async (req, res) => {
  const { enrollments } = req.body;

  if (!enrollments || !Array.isArray(enrollments) || enrollments.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid or empty data provided" });
  }

  try {
    const insertedRecords = []; // Store enrollment details instead of just IDs
    const duplicates = [];

    for (const enrollment of enrollments) {
      try {
        // Check for duplicate enrollment for the same year
        const [existing] = await pool.query(
          "SELECT id FROM enrollment WHERE student_id = ? AND course_id = ? AND class_id = ? AND enrolled_year = ?",
          [enrollment.student_id, enrollment.course_id, enrollment.class_id, enrollment.enrolled_year]
        );

        if (existing.length > 0) {
          duplicates.push(enrollment); // Track duplicates
          continue; // Skip inserting duplicates
        }

        // Insert valid enrollments
        const [result] = await pool.query(
          "INSERT INTO enrollment (student_id, course_id, class_id, enrolled_year) VALUES (?, ?, ?, ?)",
          [enrollment.student_id, enrollment.course_id, enrollment.class_id, enrollment.enrolled_year]
        );

        // Save full record for undo
        insertedRecords.push({
          id: result.insertId,
          student_id: enrollment.student_id,
          course_id: enrollment.course_id,
          class_id: enrollment.class_id,
          enrolled_year: enrollment.enrolled_year,
        });
      } catch (insertError) {
        console.error(`Error inserting enrollment for student_id ${enrollment.student_id}:`, insertError);
      }
    }

    if (insertedRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No enrollments were inserted. Please check for duplicates or malformed data.",
        duplicates,
      });
    }

    // Log the successful bulk operation for undo
    bulkInsertLog.push(insertedRecords);

    res.status(201).json({
      success: true,
      message: "Enrollments added successfully.",
      insertedRecords,
      duplicates,
    });
  } catch (error) {
    console.error("Error during bulk insert:", error);
    res.status(500).json({ success: false, message: "Server error during bulk insert", error: error.message });
  }
});





app.post("/api/enrollments/undoLastBulk", async (req, res) => {
  if (bulkInsertLog.length === 0) {
    return res.status(400).json({ success: false, message: "No bulk operation to undo." });
  }

  const lastBatch = bulkInsertLog.pop();

  if (!Array.isArray(lastBatch) || lastBatch.some((entry) => isNaN(Number(entry.id)))) {
    return res.status(400).json({ success: false, message: "Invalid data in the bulk operation log." });
  }

  let connection;

  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Delete each enrollment in the last batch
    for (const entry of lastBatch) {
      await connection.query(
        "DELETE FROM enrollment WHERE id = ? AND student_id = ? AND course_id = ? AND class_id = ? AND enrolled_year = ?",
        [entry.id, entry.student_id, entry.course_id, entry.class_id, entry.enrolled_year]
      );
    }

    // Commit the transaction
    await connection.commit();

    res.status(200).json({
      success: true,
      message: `Successfully undone ${lastBatch.length} enrollments.`,
      undoneRecords: lastBatch,
    });
  } catch (error) {
    console.error("Error undoing last bulk operation:", error);

    // Rollback the transaction on error
    if (connection) await connection.rollback();

    res.status(500).json({
      success: false,
      message: "Error undoing last bulk operation",
      error: error.message,
    });
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
});


//CRUD mapping for record API

app.get("/api/records", async (req, res) => {
  const records = await getAllRecords();
  res.send(records);
});

app.get("/api/records/:id", async (req, res) => {
  const id = req.params.id;
  const record = await getRecord(id);
  res.send(record);
});

app.post("/api/records", async (req, res) => {
  const { title, course_date, class_id } = req.body;
  const record = await createRecord(title, course_date, class_id);
  res.status(201).send(record);
});

app.get("/api/records/:record_id/attendances", async (req, res) => {
  const record_id = req.params.record_id;
  const attendances = await getAttendanceByRecordId(record_id);
  res.send(attendances);
});

app.delete("/api/records/:id", async (req, res) => {
  const id = req.params.id;
  const deletedRecord = await deleteRecordById(id);
  res.send(deletedRecord);
});

app.put("/api/records/:id", async (req, res) => {
  const id = req.params.id;
  const { title,course_date,class_id } = req.body;
  const updatedRecord = await updateRecordById(
    id,
    title,course_date,class_id
  );
  res.status(201).send(updatedRecord);
});

//CRUD mapping for attendance API

app.get("/api/attendances", async (req, res) => {
  const attendances = await getAllAttendances();
  res.send(attendances);
});

app.get("/api/attendances/:id", async (req, res) => {
  const id = req.params.id;
  const attendance = await getAttendance(id);
  res.send(attendance);
});

app.get("/api/attendances/student/:student_id", async (req, res) => { // Fixed conflicting route name
  const student_id = req.params.student_id;
  const attendances = await getAttendanceByStudentId(student_id);
  res.send(attendances);
});

app.delete("/api/attendances/:id", async (req, res) => {
  const id = req.params.id;
  const deletedAttendance = await deleteAttendanceById(id);
  res.send(deletedAttendance);
});

app.post("/api/attendances", async (req, res) => {
  const { record_id, student_id, present, verified = false } = req.body; // Include verified
  const attendance = await createAttendance(record_id, student_id, present, verified);
  res.status(201).send(attendance);
});

app.put("/api/attendances/:id", async (req, res) => {
  const id = req.params.id;
  const { record_id, student_id, present, verified } = req.body; // Include verified
  const updatedAttendance = await updateAttendanceById(
    id,
    record_id,
    student_id,
    present,
    verified
  );
  res.status(201).send(updatedAttendance);
});



//Attendance Verification backend
app.put("/api/records/:record_id/verify", async (req, res) => {
  const { record_id } = req.params;
  const { verified } = req.body;

  try {
    const query = "UPDATE attendance SET verified = ? WHERE record_id = ?";
    const [result] = await pool.query(query, [verified, record_id]);
    res.status(200).json({ message: "Attendance verification updated.", result });
  } catch (err) {
    console.error("Error updating attendance verification:", err);
    res.status(500).json({ error: "Failed to update attendance verification." });
  }
});



//-----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Backend started :");
  console.log("Server running on port 8080");
});
