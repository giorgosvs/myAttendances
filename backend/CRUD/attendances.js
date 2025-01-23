import { pool } from "../database.js";

export async function getAllAttendances() {
  const q = "SELECT * FROM attendance;";
  const [rows] = await pool.query(q);
  return rows;
}

export async function getAttendance(id) {
  const q = "SELECT * FROM attendance WHERE id = ?;";
  const [rows] = await pool.query(q, [id]);
  return rows;
}

export async function getAttendanceByStudentId(student_id) {
  const q = "SELECT * FROM attendance WHERE student_id = ?;";
  const [rows] = await pool.query(q, [student_id]);
  return rows;
}

export async function getAttendanceByRecordId(record_id) {
  const q = "SELECT * FROM attendance WHERE record_id = ?;";
  const [rows] = await pool.query(q, [record_id]);
  return rows;
}

export async function createAttendance(record_id, student_id, present, verified = false) {
  const q = "INSERT INTO attendance (record_id, student_id, present, verified) VALUES (?, ?, ?, ?);";
  const [result] = await pool.query(q, [record_id, student_id, present, verified]);
  const id = result.insertId;

  return getAttendance(id);
}

export async function deleteAttendanceById(id) {
  const q = "DELETE FROM attendance WHERE id = ?;";
  const [result] = await pool.query(q, [id]);
  return result;
}

export async function updateAttendanceById(id, record_id, student_id, present, verified) {
  const q = "UPDATE attendance SET `record_id`=?, `student_id`=?, `present`=?, `verified`=? WHERE id = ?;";
  const [result] = await pool.query(q, [record_id, student_id, present, verified, id]);
  return getAttendance(id);
}
