import { pool } from "../database.js";

export async function getAllClasses() {
    const q = 'SELECT * FROM class;';
    const [rows] = await pool.query(q);
    return rows;
}

export async function getClass(id) {
    const q = 'SELECT * FROM class WHERE id = ?;';
    const [rows] = await pool.query(q,[id]);
    return rows;
}

export async function createClass(title,course_id,coursetype){
    const q = 'INSERT INTO class (title,course_id,coursetype) VALUES (?, ?, ?);';
    const [result] = await pool.query(q,[title,course_id,coursetype]);

    const id = result.insertId;

    return getClass(id);
}

export async function deleteClassById(id) {
    const [result] = await pool.query(
      "DELETE FROM class WHERE id = ?",
      [id],
      (err, data) => {
        if (err) return res.json(err);
        return res.json("Class has been deleted successfully!");
      }
    );
  
    console.log(result);
  }
  
  export async function updateClassById(id,title,course_id,coursetype) {
    const q =
      "UPDATE class SET `title`=?, `course_id`=?, `coursetype`=? WHERE id = ?";
  
    const [result] = await pool.query(q, [title,
      course_id,
      coursetype,id], (err, data) => {
      if (err) return res.json(err);
      return res.json("Class has been updated successfully!");
    });
  }