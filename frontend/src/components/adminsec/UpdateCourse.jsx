import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
} from "@mui/material";

const UpdateCourse = ({ user }) => {
  const [course, setCourse] = useState({
    title: "",
    department_id: user.userRole === "Secretariat" ? user.department_id : "",
    coursedesc: "",
    coursetype: "",
    ects: null,
    semester: null,
    startDate: "",
    endDate: "",
  });

  const [deps, setDeps] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const courseId = location.pathname.split("/")[3]; //get ID by splitting URL path

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/courses/${courseId}`
        );
        const selectedCourse = response.data.find(
          (c) => c.id === parseInt(courseId)
        ); //filter
        setCourse(selectedCourse); // Set the state with the fetched course data
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [courseId]);

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

  const handleChange = (event) => {
    setCourse((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault(); //do not refresh page on click 'add'
    try {
      await axios.put("http://localhost:8080/api/courses/" + courseId, course);
      toast.success("Course updated successfully!")
      setTimeout(() => navigate("/courses/showCourses"), 500);
    } catch (err) {
      console.log(err);
    }
  };

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
        Update Course
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
          placeholder="Enter course title"
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
                Select a Department
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
          placeholder="Enter course description"
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
          placeholder="Enter course type"
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
          placeholder="Enter ECTS"
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
          placeholder="Enter semester"
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
          InputLabelProps={{
            shrink: true, // Ensure the label doesn't overlap with the date input
          }}
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
          InputLabelProps={{
            shrink: true, // Ensure the label doesn't overlap with the date input
          }}
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
          component={Link}
          to="/courses/showCourses"
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
          onClick={handleUpdateCourse}
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#007bff", color: "#fff" }}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateCourse;
