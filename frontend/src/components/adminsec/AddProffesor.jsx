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
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

export const AddProffesor = ({ user }) => {
  const [professor, setProfessor] = useState({
    name: "",
    surname: "",
    ranking: "",
    department_id: user.userRole === "Secretariat" ? user.department_id : "",
  });

  const [deps, setDeps] = useState([]);

  const [courses, setCourses] = useState([]); // All courses
  const [filteredCourses, setFilteredCourses] = useState([]); // Courses filtered by department
  const [selectedCourses, setSelectedCourses] = useState([]); // Courses selected by the user
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    //grep all courses
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/courses");
        setCourses(response.data); // store courses in state
      } catch (err) {
        console.log(err);
      }
    };

    fetchCourses();
  }, []);

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
  const navigate = useNavigate();
  const d = new Date();
  let year = d.getFullYear();

  useEffect(() => {
    // Filter courses based on selected department
    if (professor.department_id) {
      const filtered = courses.filter(
        (course) => course.department_id === professor.department_id
      );
      setFilteredCourses(filtered);
      setSelectedCourses([]); // Clear previous selections
    }
  }, [professor.department_id, courses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfessor((prev) => ({ ...prev, [name]: value }));

    if (name === "ranking") {
      // Clear selected courses if ranking changes
      setSelectedCourses([]);
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourses((prevSelected) => {
      if (prevSelected.includes(courseId)) {
        return prevSelected.filter((id) => id !== courseId);
      } else {
        return [...prevSelected, courseId];
      }
    });
  };

  const handleAddProffesor = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/professors",
        professor
      );
      const newProffessorId = response.data[0].id;
      if (!newProffessorId) {
        throw new Error("Failed to create professor.");
      }
      // console.log(selectedCourses);
      const addAssignment = selectedCourses.map((courseId) =>
        axios.post(`http://localhost:8080/api/assignments`, {
          professor_id: newProffessorId,
          course_id: courseId,
          assigned_year: year,
        })
      );

      //all insert operations complete
      await Promise.all(addAssignment);

      toast.success("Staff member added successfully!");
      setTimeout(() => navigate("/entities/showEntities"),500)
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
        Add Staff Member
      </Typography>

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
          value={professor.name || ""}
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
          value={professor.surname || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Surname"
        />
      </Box>

      {/* Ranking */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold" }}
        >
          Ranking
        </Typography>
        <FormControl fullWidth>
          <Select
            name="ranking"
            value={professor.ranking || ""}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Ranking
            </MenuItem>
            <MenuItem value="Professor">Professor</MenuItem>
            <MenuItem value="Assistant Professor">Assistant Professor</MenuItem>
            <MenuItem value="Lecturer">Lecturer</MenuItem>
            <MenuItem value="Secretariat">Secretariat</MenuItem>
          </Select>
        </FormControl>
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
              deps.find((dep) => dep.custom_id === professor.department_id)
                ?.title || "Your Department"
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
              value={professor.department_id || ""}
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

      {/* Courses */}
      {filteredCourses.length > 0 && professor.ranking !== "Secretariat" && (
        <Box>
          <Typography
            variant="body1"
            sx={{ marginBottom: "8px", fontWeight: "bold" }}
          >
            Assign to Courses
          </Typography>
          {filteredCourses.map((course) => (
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
          ))}
        </Box>
      )}

      {/* Fallback message for courses */}
      {filteredCourses.length === 0 && professor.ranking !== "Secretariat" && (
        <Typography variant="body2">
          No courses available to assign, or please select a different ranking.
        </Typography>
      )}

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
          onClick={handleAddProffesor}
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
