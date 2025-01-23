import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Fab,Snackbar,Alert,Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,

} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ProfessorClasses = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

  const [snackbar, setSnackbar] = useState({ open: false, severity: "", message: "" }); 
  const [deleteDialog, setDeleteDialog] = useState({ open: false, classId: null }); // State for delete confirmation dialog

  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.selectedIndex !== undefined) {
      setSelectedCourseIndex(location.state.selectedIndex);
    }
  }, [location.state]);

  
  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const [assignmentRes, courseRes] = await Promise.all([
          axios.get(
            `http://localhost:8080/api/professors/${user.id}/assignments`
          ),
          axios.get("http://localhost:8080/api/courses"),
        ]);

        setAssignments(assignmentRes.data);
        setCourses(courseRes.data);

        // Filter courses based on assignments
        const assignedCourses = courseRes.data.filter((course) =>
          assignmentRes.data.some(
            (assignment) => assignment.course_id === course.id
          )
        );

        setFilteredCourses(assignedCourses);
      } catch (err) {
        console.error("Error fetching professor data:", err);
      }
    };

    fetchProfessorData();
  }, [user]);

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/classes");
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchAllClasses();
  }, []);

  const filteredCoursesForSearch = filteredCourses.filter((course) =>
    course.title.toLowerCase().includes(courseSearchQuery.toLowerCase())
  );

  const classesByCourse = classes.reduce((acc, cl) => {
    if (!acc[cl.course_id]) acc[cl.course_id] = [];
    acc[cl.course_id].push(cl);
    return acc;
  }, {});

  const handleCourseChange = (event, newIndex) => {
    setSelectedCourseIndex(newIndex);
  };

  const openDeleteDialog = (classId) => {
    setDeleteDialog({ open: true, classId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, classId: null });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/classes/${deleteDialog.classId}`);
      setClasses((prevClasses) =>
        prevClasses.filter((cl) => cl.id !== deleteDialog.classId)
      );
      setSnackbar({
        open: true,
        severity: "success",
        message: "Class deleted successfully!",
      });
    } catch (err) {
      console.error("Error deleting class:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to delete the class. Please try again.",
      });
    } finally {
      closeDeleteDialog();
    }
  };

//   const handleDelete = async (classId) => {
//     try {
//       await axios.delete(`http://localhost:8080/api/classes/${classId}`);
//       setClasses((prevClasses) =>
//         prevClasses.filter((cl) => cl.id !== classId)
//       );
//       setSnackbar({
//         open: true,
//         severity: "success",
//         message: "Class deleted added successfully!",
//       });
//       setTimeout(() => {
        
//       }, 1000);
//     } catch (err) {
//       console.error("Error deleting class:", err);
//     }
//   };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: "title", headerName: "Class Title", flex: 1 },
    { field: "coursetype", headerName: "Course Type", flex: 1 },
    {
      field: "records",
      headerName: "Records",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            navigate(`/classes/${params.row.id}/records`, {
                state: {
                  selectedIndex: selectedCourseIndex, 
                },
              })
              
          }
        >
          View Records
        </Button>
      ),
    },
    {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1,
              width: "100%",
              height: "100%",
            }}
          >
            {/* <button
              className="button delete"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </button> */}
            <button
            className="button delete"
          onClick={() => openDeleteDialog(params.row.id)}
          
        >
          Delete
        </button>
          </Box>
        ),
    }
  ];

  return (
    <Box>
           <Snackbar
        open={snackbar.open}
        autoHideDuration={3000} // Automatically close after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position of the Snackbar
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this class? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

        <Box sx={{ display: "flex", minHeight: "100vh", gap: 2, padding: 2 }}>
      {/* Sidebar with Courses */}
      <Box
        sx={{
          width: "250px",
          borderRight: 1,
          borderColor: "divider",
          paddingRight: 2,
        }}
      >
        <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 2,
    }}
  >
        <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
          My Courses
        </Typography>
        </Box>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={courseSearchQuery}
          onChange={(e) => setCourseSearchQuery(e.target.value)}
        />
        <Tabs
          orientation="vertical"
          value={selectedCourseIndex}
          onChange={handleCourseChange}
          sx={{ width: "100%" }}
        >
          {filteredCoursesForSearch.map((course, index) => (
            <Tab key={course.id} label={course.title} />
          ))}
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        {filteredCoursesForSearch[selectedCourseIndex] ? (
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
              "{filteredCoursesForSearch[selectedCourseIndex].title}"
            </Typography>

            {classesByCourse[
              filteredCoursesForSearch[selectedCourseIndex].id
            ] &&
            classesByCourse[filteredCoursesForSearch[selectedCourseIndex].id]
              .length > 0 ? (
              <Box sx={{ maxHeight: 500, overflow: "auto" }}>
                <DataGrid
                  rows={
                    classesByCourse[
                      filteredCoursesForSearch[selectedCourseIndex].id
                    ]
                  }
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  disableSelectionOnClick
                  getRowId={(row) => row.id}
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f4f4f4",
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ textAlign: "left", marginTop: 4 }}>
                <Typography variant="body1">
                  No classes available for "
                  <b>{filteredCoursesForSearch[selectedCourseIndex].title}</b>".
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  onClick={() =>
                    navigate("/classes/addForm", {
                      state: {
                        title: filteredCourses[selectedCourseIndex].title,
                        course_id: filteredCourses[selectedCourseIndex].id,
                        selectedIndex: selectedCourseIndex, // Persist selected index
                      },
                    })
                  }
                >
                  Add New Class
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body1">
            {courseSearchQuery
              ? "No matching courses found. Please refine your search."
              : "Select a course to view classes."}
          </Typography>
        )}
      </Box>
      {filteredCourses[selectedCourseIndex] && (
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() =>
            navigate("/classes/addForm", {
              state: {
                title: filteredCourses[selectedCourseIndex].title,
                course_id: filteredCourses[selectedCourseIndex].id,
                selectedIndex: selectedCourseIndex, // Persist selected index
              },
            })
          }
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
    </Box>
  );
};

export default ProfessorClasses;
