import { pool } from "../database.js";

export async function getAllRecords() {
    const q = 'SELECT * FROM records;';
    const [rows] = await pool.query(q);
    return rows;
}

export async function getRecord(id) {
    const q = 'SELECT * FROM records WHERE id = ?;';
    const [rows] = await pool.query(q,[id]);
    return rows;
}

export async function createRecord(title,course_date,class_id){
    const q = 'INSERT INTO records (title, course_date, class_id) VALUES (?, ?, ?);';
    const [result] = await pool.query(q,[title,course_date,class_id]);
    const id = result.insertId;

    return getRecord(id);
}

export async function deleteRecordById(id) {
    const [result] = await pool.query(
      "DELETE FROM records WHERE id = ?",
      [id],
      (err, data) => {
        if (err) return res.json(err);
        return res.json("Record has been deleted successfully!");
      }
    );
  
    console.log(result);
  }

  export async function updateRecordById(id,title,course_date,class_id) {
    const q =
      "UPDATE records SET `title`=?, `course_date`=?, `class_id`=? WHERE id = ?";
  
    const [result] = await pool.query(q, [title,
      course_date,class_id,id], (err, data) => {
      if (err) return res.json(err);
      return res.json("Record has been updated successfully!");
    });
  }