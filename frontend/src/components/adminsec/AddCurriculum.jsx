import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";


export const AddCurriculum = ({ user }) => {
  const [curriculum, setCurriculum] = useState({
    title: "",
    department_id: user.userRole === "Secretariat" ? user.department_id : "",
    curdesc: "",
    curtype: "",
    active: false,
  });

  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [deps, setDeps] = useState([]);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/courses");
        setCourses(response.data);
        // Automatically filter courses for the secretary
        if (user.userRole === "Secretariat") {
          const filtered = response.data.filter(
            (course) => course.department_id === user.department_id
          );
          setFilteredCourses(filtered);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCourses();
  }, [user.userRole, user.department_id]);

  // Fetch all departments
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

  // Handle changes in the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurriculum((prev) => ({ ...prev, [name]: value }));

    // Filter courses when department changes
    if (name === "department_id") {
      const filtered = courses.filter((course) => course.department_id === value);
      setFilteredCourses(filtered);
      setSelectedCourses([]); // Clear selected courses when department changes
    }
  };

  // Handle course selection
  const handleCourseSelect = (courseId) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(courseId)
        ? prevSelected.filter((id) => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  // Submit the new curriculum and associate selected courses
  const handleAddCurriculum = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/curriculums", curriculum);
      const newCurriculumId = response.data[0]?.id;

      if (!newCurriculumId) {
        throw new Error("Failed to create curriculum.");
      }

      const addCourseToCurriculumPromises = selectedCourses.map((courseId) =>
        axios.post(`http://localhost:8080/api/curriculum_course`, {
          curriculum_id: newCurriculumId,
          course_id: courseId,
        })
      );

      await Promise.all(addCourseToCurriculumPromises);
      toast.success("Curriculum added successfully!");
      setTimeout( () => navigate("/curriculums/showCurriculums"),500);
    } catch (err) {
      console.error("Error adding curriculum:", err);
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
        Add New Curriculum
      </Typography>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Title
        </Typography>
        <TextField
          name="title"
          value={curriculum.title || ""}
          onChange={handleChange}
          variant="outlined"
          placeholder="Title"
          fullWidth
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
              value={curriculum.department_id || ""}
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
          Curriculum Description
        </Typography>
        <TextField
          name="curdesc"
          value={curriculum.curdesc || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          multiline
          placeholder="Description..."
          rows={3}
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Curriculum Type
        </Typography>
        <FormControl fullWidth>
          <Select
            name="curtype"
            value={curriculum.curtype || ""}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Curriculum Type
            </MenuItem>
            <MenuItem value="Pregraduate">Pregraduate</MenuItem>
            <MenuItem value="Postgraduate">Postgraduate</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Active
        </Typography>
        <FormControl fullWidth>
          <Select
            name="active"
            value={curriculum.active || ""}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Active Status
            </MenuItem>
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box>
  <Typography variant="h6" sx={{ marginBottom: "12px", fontWeight: "bold" }}>
    Select Courses for Curriculum
    {filteredCourses.length> 0 && (<FormControlLabel
      control={
        <Checkbox
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedCourses(filteredCourses.map((course) => course.id)); // Select all courses
            } else {
              setSelectedCourses([]); // Deselect all courses
            }
          }}
          checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
        />
      }
      sx={{marginLeft: 2}}
    />)}
  </Typography>
 
  {filteredCourses.length > 0 ? (
    filteredCourses.map((course) => (
      <FormControlLabel
        key={course.id}
        control={
          <Checkbox
            value={course.id}
            onChange={() => handleCourseSelect(course.id)}
            checked={selectedCourses.includes(course.id)}
          />
        }
        label={course.title}
      />
    ))
  ) : (
    <Typography>No courses available for the selected department.</Typography>
  )}
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
          to="/curriculums/showCurriculums"
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
          onClick={handleAddCurriculum}
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
