import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Button, Box, Fab, TextField } from "@mui/material";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";

const ProfessorCourses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignents] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProfessorAssignments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/professors/${user.id}/assignments`
        );
        setAssignents(res.data);
      } catch (err) {
        console.error(
          `Error fetching assignments for professror: ${user.id}`,
          err
        );
      }
    };
    
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/courses");
        
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    
    fetchAllCourses();
    fetchProfessorAssignments();
  }, [user]);

  useEffect(() => {
    const assignedCourses = courses.filter((course) =>
      assignments.some((assignment) => assignment.course_id === course.id)
    );
    setFilteredCourses(assignedCourses);
  }, [courses, assignments]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
        // Reset to the original assigned courses when search is cleared
        setFilteredCourses(
          courses.filter((course) =>
            assignments.some((assignment) => assignment.course_id === course.id)
          )
        );
      } else {
    setFilteredCourses((prev) => prev.filter((course) => {
        return (
          course.title.toString().toLowerCase().includes(query) ||
          course.department_id.toString().toLowerCase().includes(query) ||
          course.coursedesc.toString().toLowerCase().includes(query) ||
          course.coursetype.toString().toLowerCase().includes(query)
        );
      })
    );}
  };

  const columns = [
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "coursedesc", headerName: "Description", flex: 2 },
    { field: "coursetype", headerName: "Type", flex: 1 },
    { field: "ects", headerName: "ECTS", type: "number", flex: 1 },
    { field: "semester", headerName: "Semester", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 1 },
    { field: "endDate", headerName: "End Date", flex: 1 }
  ];


  return (
    <Box sx={{width:"100%"}}>
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "50px",
          marginTop: "20px",
        }}
      >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: 2 }}
      >
        My Courses
      </Typography>
      <TextField
        label="Search Courses"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{
            maxWidth: "400px",
          }}
      /></Box>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredCourses}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f4f4f4", // Light gray background for headers
              color: "black", // Dark text color
              fontWeight: "bold", // Bold font for headers
              fontSize: "1.1rem",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProfessorCourses;
