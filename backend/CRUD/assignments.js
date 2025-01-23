import {pool } from "../database.js";

export async function getAllAssignments() {
    const q = 'SELECT * FROM assignment;';
    const [rows] = await pool.query(q);
    return rows;
}

export async function getAssignment(id) {
    const [rows] = await pool.query('SELECT * FROM assignment WHERE id = ?', [id]);
    return rows;
}

export async function createAssignment(professor_id,course_id,assigned_year) {
    const [result] = await pool.query(`
        INSERT INTO assignment (professor_id, course_id, assigned_year)
        VALUES (?, ?, ?);
    `, [professor_id,course_id,assigned_year]);
    
    const id = result.insertId; //insertId is returned as a field when we use insert query

    return getAssignment(id);
}