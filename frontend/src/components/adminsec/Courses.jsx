import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Fab,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all courses
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchAllCourses();
  }, []);

  // Filter courses based on user role
  useEffect(() => {
    if (user.userRole === "Secretariat") {
      const filtered = courses.filter((course) => {
        return course.department_id === user.department_id;
      });
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [courses, user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/courses/${id}`);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
      toast.success("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCourses(
      courses.filter((course) => {
        return (
          course.title.toString().toLowerCase().includes(query) ||
          course.department_id.toString().toLowerCase().includes(query) ||
          course.coursedesc.toString().toLowerCase().includes(query) ||
          course.coursetype.toString().toLowerCase().includes(query)
        );
      })
    );
  };

  const columns = [
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "coursedesc", headerName: "Description", flex: 2 },
    { field: "coursetype", headerName: "Type", flex: 1 },
    { field: "ects", headerName: "ECTS", type: "number", flex: 1 },
    { field: "semester", headerName: "Semester", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 1 },
    { field: "endDate", headerName: "End Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <button
            className="button delete"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </button>
          <button className="button update">
            <Link to={`/courses/updateCourse/${params.row.id}`}>Update</Link>
          </button>
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
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
          component="div"
          sx={{
            fontWeight: "bold",
            color: "rgba(0, 0, 0, 0.87)", // Light black
            marginBottom: 2,
          }}
        >
          Courses
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
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 400, // Ensures consistent height
        }}
      >
        {filteredCourses.length > 0 ? (
          <Box sx={{ maxHeight: 500, overflow: "auto" }}> {/* Wrap DataGrid in a Box */}
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
        ) : (
          <Box sx={{ textAlign: "left", marginTop: 2 }}>
            <Typography
              variant="body1"
              gutterBottom
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
              }}
            >
              No courses found. Please refine your search.
            </Typography>
            <Button
              component={Link}
              to="/courses/addForm"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Add New Course
            </Button>
          </Box>
        )}
      </Box>

      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/courses/addForm")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Courses;
