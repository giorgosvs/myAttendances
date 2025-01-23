import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Snackbar,
  Alert,
  Fab,
  TextField,
} from "@mui/material";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import {useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

const StudentClasses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [classes, setClasses] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(
    location.state?.selectedIndex || 0
  );

  // Fetch enrolled courses for the student
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/enrollments");
        const enrolledCourses = res.data.filter(
          (enrollment) => enrollment.student_id === user.studentid
        );

        // Fetch course details
        const coursesRes = await axios.get("http://localhost:8080/api/courses");
        const studentCourses = coursesRes.data.filter((course) =>
          enrolledCourses.some((enrollment) => enrollment.course_id === course.id)
        );

        setCourses(studentCourses);
        setFilteredCourses(studentCourses);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };

    fetchEnrolledCourses();
  }, [user.studentid]);

  // Fetch classes for a selected course
  useEffect(() => {
    if (filteredCourses[selectedCourseIndex]) {
      const fetchClasses = async () => {
        try {
          const res = await axios.get("http://localhost:8080/api/classes");
          const courseClasses = res.data.filter(
            (classItem) => classItem.course_id === filteredCourses[selectedCourseIndex].id
          );

          setClasses(courseClasses);
        } catch (err) {
          console.error("Error fetching classes:", err);
        }
      };

      fetchClasses();
    }
  }, [filteredCourses, selectedCourseIndex]);

  const handleCourseChange = (event, newIndex) => {
    setSelectedCourseIndex(newIndex);
  };


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", gap: 2, padding: 2 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Sidebar with Courses */}
      <Box
        sx={{
          width: "300px",
          borderRight: 1,
          borderColor: "divider",
          paddingRight: 2,
        }}
      >
        <Typography  variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        <AutoStoriesIcon sx={{marginRight :2}}/>My Courses
        </Typography>
        <TextField
          label="Search Courses"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={searchQuery}
          onChange={handleSearch}
        />
        <Tabs
          orientation="vertical"
          value={selectedCourseIndex}
          onChange={handleCourseChange}
          sx={{ width: "100%" }}
        >
          {filteredCourses.map((course, index) => (
            <Tab key={course.id} label={course.title} />
          ))}
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        {filteredCourses[selectedCourseIndex] ? (
          <>
           <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "rgba(0, 0, 0, 0.87)",
                textAlign: "left",
              }}
            >
              Classes for
            </Typography>
            <Typography variant="h5" gutterBottom marginBottom={5}>
              "{filteredCourses[selectedCourseIndex].title}"
            </Typography>
            {classes.length > 0 ? (
              <Box sx={{ maxHeight: 500, overflow: "auto" }}>
                
                {classes.map((classItem) => (
                  <Box
                    key={classItem.id}
                    sx={{
                      padding: 2,
                      marginBottom: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6">{classItem.title}</Typography>
                      <Typography variant="body2">
                        {classItem.coursetype}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate(`/classes/${classItem.id}/records`, {
                            state: {
                              selectedIndex: selectedCourseIndex, 
                            },
                          })
                          
                      }
                    >
                      Lectures
                    </Button>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No classes available for this course.</Typography>
            )}
          </>
        ) : (
          <Typography>Select a course to view its classes.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default StudentClasses;
