import { pool } from "../database.js";

export async function getAllCourses() {
  const q = "SELECT * FROM course;";
  const [rows] = await pool.query(q);
  return rows;
}

export async function getCourse(id) {
  const [rows] = await pool.query("SELECT * FROM course WHERE id = ?", [id]);
  return rows;
}

export async function createCourse(
  title,
  department_id,
  coursedesc,
  coursetype,
  ects,
  semester,
  startDate,
  endDate
) {
  const [result] = await pool.query(
    `
        INSERT INTO course (title, department_id, coursedesc, coursetype, ects, semester, startDate, endDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      title,
      department_id,
      coursedesc,
      coursetype,
      ects,
      semester,
      startDate,
      endDate,
    ]
  );

  const id = result.insertId; //insertId is returned as a field when we use insert query

  return getCourse(id);
}

export async function deleteCourseById(id) {
  const [result] = await pool.query(
    "DELETE FROM course WHERE id = ?",
    [id],
    (err, data) => {
      if (err) return res.json(err);
      return res.json("Course has been deleted successfully!");
    }
  );

  console.log(result);
}

export async function updateCourseById(id,title,department_id,coursedesc,coursetype,ects,semester,startDate,endDate) {
  const q =
    "UPDATE course SET `title`=?, `department_id`=?, `coursedesc`=?, `coursetype`=?, `ects`=?, `semester`=?, `startDate`=?, `endDate`=? WHERE id = ?";

  const [result] = await pool.query(q, [title,
    department_id,
    coursedesc,
    coursetype,
    ects,
    semester,
    startDate,
    endDate,id], (err, data) => {
    if (err) return res.json(err);
    return res.json("Course has been updated successfully!");
  });
}



// const course = await getCourse(1);
// console.log(course);

// const result = await createCourse('test',1,2,'test','test',4,1,'test','test')
// console.log(result);
