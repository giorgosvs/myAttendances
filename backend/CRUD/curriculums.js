import { pool } from "../database.js";

export async function getAllCurriculums(){
    const q = 'SELECT * FROM curriculum;';
    const [rows] = await pool.query(q);
    return rows;
}

export async function getCurriculum(id) {
    const q = 'SELECT * FROM curriculum WHERE id = ?;';
    const [rows] = await pool.query(q, [id]);
    return rows;
}

export async function createCurriculum(title,department_id,curdesc,curtype, active) {
    const q = 'INSERT INTO curriculum (title, department_id, curdesc, curtype, active) VALUES (?, ?, ?, ?, ?);';
    const [result] = await pool.query(q, [title,department_id,curdesc,curtype, active]);

    const id = result.insertId;

    return getCurriculum(id);

}

export async function deleteCurriculumById(id) {
    const [result] = await pool.query(
      "DELETE FROM curriculum WHERE id = ?",
      [id],
      (err, data) => {
        if (err) return res.json(err);
        return res.json("Curriculum has been deleted successfully!");
      }
    );
  
    console.log(result);
  }

  export async function updateCurriculumById(id,title,department_id,curdesc,curtype,active) {
    const q =
      "UPDATE curriculum SET `title`=?, `department_id`=?, `curdesc`=?, `curtype`=?, `active`=? WHERE id = ?";
  
    const [result] = await pool.query(q, [title,
      department_id,
      curdesc,
      curtype,
      active,
      id], (err, data) => {
      if (err) return res.json(err);
      return res.json("Curriculum has been updated successfully!");
    });
  }

  