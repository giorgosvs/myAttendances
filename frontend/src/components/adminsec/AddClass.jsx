import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";


export const AddClass = ({ user }) => {
  const location = useLocation(); // Access route state
  const navigate = useNavigate();

  const [cl, setCl] = useState({
    title: location.state?.title || "",
    course_id: location.state?.course_id || "",
    coursetype: "",
  });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/courses");
        const filteredCourses =
          user.userRole === "Secretariat"
            ? response.data.filter(
                (course) => course.department_id === user.department_id
              )
            : response.data;
        setCourses(filteredCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [user]);

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/classes", cl);
      const backPath = location.state?.from || "/classes/showClasses";
      navigate(backPath, { state: { selectedIndex: location.state?.selectedIndex } });
    } catch (err) {
      console.error("Error adding class:", err);
    }
  };

  
  

  const handleChange = (event) => {
    setCl((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
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
        Add New Class
      </Typography>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
          Title
        </Typography>
        <TextField
          name="title"
          value={cl.title}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Title"
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
          Course
        </Typography>
        <FormControl fullWidth>
          <Select
            name="course_id"
            value={cl.course_id}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Course
            </MenuItem>
            {courses.length > 0 ? (
              courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No courses available</MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
          Course Type
        </Typography>
        <FormControl fullWidth>
          <Select
            name="coursetype"
            value={cl.coursetype}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Course Type
            </MenuItem>
            <MenuItem value="Lab Course">Lab Course</MenuItem>
            <MenuItem value="Theory Course">Theory Course</MenuItem>
          </Select>
        </FormControl>
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
          onClick={() =>
            navigate("/classes/showClasses", {
              state: { selectedIndex: location.state?.selectedIndex },
            })
          }
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#e0e0e0",
            color: "#333",
            "&:hover": { backgroundColor: "#d0d0d0" },
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleAddClass}
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
