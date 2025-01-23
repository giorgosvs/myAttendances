import { pool } from "../database.js";

export async function getAllDepartments() {
    const q = 'SELECT * FROM department;';
    const [rows] = await pool.query(q);
    return rows;
}

export async function getDepartmentById(id) {
    const q = 'SELECT * FROM department WHERE id = ?;';
    const [rows] = await pool.query(q,[id]);
    return rows;
}

export async function createDepartment(title,custom_id) {
    const q = 'INSERT INTO department (title,custom_id) VALUES (?,?);';
    const [result] = await pool.query(q, [title,custom_id]);

    const id = result.insertId;

    return getDepartmentById(id);
}

export async function deleteDepartmentById(id) {
    const [result] = await pool.query(
      "DELETE FROM department WHERE id = ?",
      [id],
      (err, data) => {
        if (err) return res.json(err);
        return res.json("Department has been deleted successfully!");
      }
    );
  
    console.log(result);
  }

  export async function updateDepartmentById(id,title,custom_id) {
    const q =
      "UPDATE department SET `title`=?, `custom_id`=? WHERE id = ?";
  
    const [result] = await pool.query(q, [title,custom_id,id], (err, data) => {
      if (err) return res.json(err);
      return res.json("Department has been updated successfully!");
    });
  }
  