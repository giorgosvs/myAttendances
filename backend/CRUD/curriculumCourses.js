import { pool } from "../database.js";

export async function getAllCurriculumCourses() {
    const q = "SELECT * FROM curriculum_course;";
    const [rows] = await pool.query(q);
    return rows;
  }

  export async function getCurriculumCourses(curriculum_id) {
    const [rows] = await pool.query("SELECT course_id FROM curriculum_course WHERE curriculum_id = ?", [curriculum_id]);
    return rows;
  }
  