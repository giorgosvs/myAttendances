import { pool } from "../database.js";

export async function getAllStudents() {
  const q = "SELECT * FROM student;";
  const [rows] = await pool.query(q);
  return rows;
}

export async function getStudent(id) {
  const q = "SELECT * FROM student WHERE studentid = ?;";
  const [rows] = await pool.query(q, [id]);
  return rows;
}

export async function createStudent(studentid, name, surname, department_id) {
  const q =
    "INSERT INTO student (studentid, name, surname,department_id) VALUES (?, ?, ?, ?);";
  const [result] = await pool.query(q, [
    studentid,
    name,
    surname,
    department_id,
  ]);

  const id = result.insertId;

  return getStudent(id);
}

export async function deleteStudentById(id) {
  const [result] = await pool.query(
    "DELETE FROM student WHERE studentid = ?",
    [id],
    (err, data) => {
      if (err) return res.json(err);
      return res.json("Student has been deleted successfuly!");
    }
  );
  console.log(result);
}

export async function updateStudentById(
  studentid,
  name,
  surname,
  department_id
) {
  const q =
    "UPDATE student SET `name`=?, `surname`=?, `department_id`=? WHERE studentid = ?";

  const [result] = await pool.query(
    q,
    [name, surname, department_id, studentid],
    (err, data) => {
      if (err) return res.json(err);
      return res.json("Student has been updated successfully!");
    }
  );
}
