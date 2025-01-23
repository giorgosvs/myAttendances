import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
  Chip,
} from "@mui/material";

export const UpdateProfessor = () => {
  const [professor, setProfessor] = useState({
    name: "",
    surname: "",
    ranking: "",
    department_id: null,
  });

  const [deps, setDeps] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [rankingState, setRankingState] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const professorId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/professors/${professorId}`
        );

        if (response.data) {
          setProfessor(response.data[0]);
          setRankingState(response.data[0].ranking);
        } else {
          console.log("No professor data found for the given ID.");
        }
      } catch (err) {
        console.log("Error fetching professor data:", err);
      }
    };

    fetchStaffData();
  }, [professorId]);

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseCourses = await axios.get(
          "http://localhost:8080/api/courses"
        );

        const responseAssignedCourses = await axios.get(
          `http://localhost:8080/api/professors/${professorId}/courses`
        );

        setCourses(responseCourses.data);
        setAssignedCourses(responseAssignedCourses.data);
      } catch (err) {
        console.log("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [professorId]);

  const fetchAssignments = async (professorId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/professors/${professorId}/assignments`
      );
      return data; // Return the assignments array
    } catch (err) {
      console.error("Error fetching assignments:", err);
      toast.error("Failed to fetch assignments.");
      return [];
    }
  };
  

  const unassignedCourses = courses.filter(
    (course) => !assignedCourses.includes(course.id)
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfessor((prevProfessor) => ({
      ...prevProfessor,
      [name]: value,
    }));

    if (name === "ranking") {
      setRankingState(value);
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

  const handleUnassignCourse = async (courseId) => {
    try {
      // Fetch assignments for the professor
      const assignments = await fetchAssignments(professorId);
      console.log(assignments)
      // Find the assignment ID for the specific course
      const assignmentToDelete = assignments.find(
        (assignment) => assignment.course_id === courseId
      );
      console.log("Assignment to delete : ",assignmentToDelete)
  
      if (!assignmentToDelete) {
        toast.error("Assignment not found.");
        return;
      }
  
      // Delete the assignment using its ID
      await axios.delete(
        `http://localhost:8080/api/assignments/${assignmentToDelete.id}`
      );
  
      // Update state
      setAssignedCourses((prev) => prev.filter((id) => id !== courseId));
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
      toast.success("Course unassigned successfully!");
    } catch (err) {
      console.error("Error unassigning course:", err);
      toast.error("Failed to unassign course.");
    }
  };
  
  const handleUpdateProfessor = async (e) => {
    e.preventDefault();
    try {
      if (rankingState === "Secretariat") {
        await axios.delete(
          `http://localhost:8080/api/assignments/professor/${professorId}`
        );
      }

      await axios.put(
        `http://localhost:8080/api/professors/${professorId}`,
        professor
      );

      if (rankingState !== "Secretariat") {
        const assignmentPromises = selectedCourses.map((courseId) =>
          axios.post("http://localhost:8080/api/assignments", {
            professor_id: professorId,
            course_id: courseId,
            assigned_year: new Date().getFullYear(),
          })
        );
        await Promise.all(assignmentPromises);
      }

      toast.success("Staff member updated successfully!");
      setTimeout(() => navigate("/entities/showEntities"), 200);
    } catch (err) {
      console.error("Error updating professor or assigning courses:", err);
    }
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
        Update Staff Member
      </Typography>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
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

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
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

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
          Assigned Courses
        </Typography>
        {assignedCourses.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              backgroundColor: "#f4f4f4",
              padding: 2,
              borderRadius: 2,
              border: "1px solid #ddd",
            }}
          >
            {assignedCourses.map((assignedCourseId) => {
              const assignedCourse = courses.find(
                (course) => course.id === assignedCourseId
              );
              return assignedCourse ? (
                <Chip
                  key={assignedCourse.id}
                  label={assignedCourse.title}
                  onClick={() => handleUnassignCourse(assignedCourse.id)}
                  sx={{
                    backgroundColor: "#e0e0e0",
                    color: "#000",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#d0d0d0" },
                  }}
                />
              ) : null;
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "#666" }}>
            No assigned courses.
          </Typography>
        )}
      </Box>

      {/* Available Courses Section */}
      {rankingState !== "Secretariat" && (
        <Box>
          <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
            Available Courses
          </Typography>
          {unassignedCourses.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                padding: 2,
                borderRadius: 2,
                border: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
              }}
            >
              {unassignedCourses
                .filter(
                  (course) => course.department_id === professor.department_id
                )
                .map((course) => (
                  <FormControlLabel
                    key={course.id}
                    control={
                      <Checkbox
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCourseSelect(course.id)}
                      />
                    }
                    label={course.title}
                    sx={{
                      marginBottom: 1,
                    }}
                  />
                ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "#666" }}>
              No available courses to assign.
            </Typography>
          )}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          onClick={() => navigate(-1)}
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
          onClick={handleUpdateProfessor}
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
