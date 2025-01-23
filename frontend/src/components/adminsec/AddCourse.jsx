import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { styles } from "/home/user/Desktop/project/app/frontend/src/styles/style.css";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
} from "@mui/material";


const AddCourse = ({ user }) => {
  const location = useLocation(); // Access previous route state
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    department_id: user.userRole === "Secretariat" ? user.department_id : "",
    coursedesc: "",
    coursetype: "",
    ects: "",
    semester: "",
    startDate: "",
    endDate: "",
  });

  const [deps, setDeps] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setCourse((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault(); // Prevent page refresh
    if (!course.department_id) {
      setError("Department is required.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/courses", course);
      toast.success("Course added successfully!");

      // Navigate back to the previous page or default to /courses/showCourses
      const previousPath = location.state?.from || "/courses/showCourses";
      setTimeout(() => navigate(previousPath), 1000);
    } catch (err) {
      console.error("Error adding the course:", err);
      setError("Failed to add the course. Please try again.");
    }
  };

  useEffect(() => {
    const fetchAllDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/departments");
        setDeps(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
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
        Add New Course
      </Typography>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Title
        </Typography>
        <TextField
          name="title"
          value={course.title || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Title"
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
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
              value={course.department_id || ""}
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

      {error && (
        <Typography color="error" sx={{ marginBottom: "10px" }}>
          {error}
        </Typography>
      )}

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Course Description
        </Typography>
        <TextField
          name="coursedesc"
          value={course.coursedesc || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Course description"
          multiline
          rows={3}
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Course Type
        </Typography>
        <TextField
          name="coursetype"
          value={course.coursetype || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Course type"
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          ECTS
        </Typography>
        <TextField
          name="ects"
          value={course.ects || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          type="number"
          placeholder="ECTS"
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Semester
        </Typography>
        <TextField
          name="semester"
          value={course.semester || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          type="number"
          placeholder="Semester"
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Start Date
        </Typography>
        <TextField
          name="startDate"
          value={course.startDate || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          type="date"
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          End Date
        </Typography>
        <TextField
          name="endDate"
          value={course.endDate || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          type="date"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          onClick={() => navigate(location.state?.from || "/courses/showCourses")}
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
          onClick={handleAddCourse}
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

export default AddCourse;
