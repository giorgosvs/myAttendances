import { pool } from "../database.js";

export async function getAllProfessors() {
    const q = 'SELECT * FROM professor;';
    const [rows] = await pool.query(q);
    return rows;
}

export async function getProfessor(id) {
    const q = 'SELECT * FROM professor WHERE id = ?;';
    const [rows] = await pool.query(q,[id]);

    return rows;
}

export async function createProfessor(name,surname,ranking,department_id) {
    const q = 'INSERT INTO professor (name, surname, ranking, department_id) VALUES (?, ?, ?, ?);';
    const [result] = await pool.query(q,[name,surname,ranking,department_id]);

    const id = result.insertId;
    return getProfessor(id);
}

export async function deleteStaffById(id){
    const [result] = await pool.query(
        'DELETE FROM professor WHERE id = ?',[id],(err,data) => {
            if(err) return res.json(err);
            return res.json("Staff member has been deleted successfuly!");
        }

       
    );
    console.log(result);
}

export async function updateStaffById(
    id,
    name,
    surname,
    ranking,
    department_id
  ) {
    const q =
      "UPDATE professor SET `name`=?, `surname`=?, `ranking`=?, `department_id`=? WHERE id = ?";
  
    const [result] = await pool.query(
      q,
      [name, surname, ranking, department_id, id],
      (err, data) => {
        if (err) return res.json(err);
        return res.json("Professor has been updated successfully!");
      }
    );
  }

