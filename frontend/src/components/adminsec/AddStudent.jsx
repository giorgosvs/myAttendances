import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button
} from "@mui/material";

export const AddStudent = ({ user }) => {
  const [student, setStudent] = useState({
    studentid: "",
    name: "",
    surname: "",
    department_id: user.userRole === "Secretariat" ? user.department_id : "",
  });

  const [deps, setDeps] = useState([]);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/students", student);
      toast.success(`Student ${student.studentid} added successfully!`);
      setTimeout(() => navigate("/entities/showEntities"), 200);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchAllDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/departments");
        setDeps(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllDepartments();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 3,
        backgroundColor: "#f7f7f7",
        borderRadius: 2,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: "bold",
          textAlign: "left",
          color: "rgba(0, 0, 0, 0.87)",
          
        }}
        marginTop={2}
        marginBottom={2}
      >
        Add New Student
      </Typography>

      {/* Student ID */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold" }}
        >
          Student ID
        </Typography>
        <TextField
          name="studentid"
          value={student.studentid || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Student ID"
        />
      </Box>

      {/* Name */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold" }}
        >
          Name
        </Typography>
        <TextField
          name="name"
          value={student.name || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Name"
        />
      </Box>

      {/* Surname */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold" }}
        >
          Surname
        </Typography>
        <TextField
          name="surname"
          value={student.surname || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Surname"
        />
      </Box>

      {/* Department */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold" }}
        >
          Department
        </Typography>
        {user.userRole === "Secretariat" ? (
          <TextField
            value={
              deps.find((dep) => dep.custom_id === user.department_id)?.title ||
              "Your Department"
            }
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: "#f4f4f4",
              color: "#666",
            }}
          />
        ) : (
          <FormControl fullWidth>
            <Select
              name="department_id"
              value={student.department_id || ""}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Department
              </MenuItem>
              {deps.map((dep) => (
                <MenuItem key={dep.id} value={dep.custom_id}>
                  {dep.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          component={Link}
          to="/entities/showEntities"
          variant="contained"
          sx={{
            backgroundColor: "#e0e0e0",
            color: "#333",
            "&:hover": { backgroundColor: "#d0d0d0" },
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleAddStudent}
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#007bff", color: "#fff" }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );

};
