import {pool } from "../database.js";

export async function getAllEnrollments() {
    const q = 'SELECT * FROM enrollment;';
    const [rows] = await pool.query(q);
    return rows;
}

export async function getEnrollment(id) {
    const [rows] = await pool.query('SELECT * FROM enrollment WHERE id = ?', [id]);
    return rows;
}

export async function createEnrollment(student_id,course_id,class_id,enrolled_year) {
    const [result] = await pool.query(`
        INSERT INTO enrollment (student_id, course_id, class_id, enrolled_year)
        VALUES (?, ?, ?, ?);
    `, [student_id,course_id,class_id,enrolled_year]);
    
    const id = result.insertId; //insertId is returned as a field when we use insert query

    return getEnrollment(id);
}

export async function deleteEnrollment(id) {
    const [result] = await pool.query(
      "DELETE FROM enrollment WHERE id = ?",
      [id],
      (err, data) => {
        if (err) return res.json(err);
        return res.json("Enrollment has been deleted successfully!");
      }
    );
  
    console.log(result);
  }
  
  export async function updateEnrollment(id,student_id,course_id,class_id,enrolled_year) {
    const q =
      "UPDATE enrollment SET `student_id`=?, `course_id`=?, `class_id`=?, `enrolled_year`=? WHERE id = ?";
  
    const [result] = await pool.query(q, [student_id,course_id,class_id,enrolled_year,id], (err, data) => {
      if (err) return res.json(err);
      return res.json("Enrollment has been updated successfully!");

      
    });
  }

  