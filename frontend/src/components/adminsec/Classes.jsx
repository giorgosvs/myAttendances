import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const Classes = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const location = useLocation();
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(
    location.state?.selectedIndex || 0
  );

  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/courses");
        const filteredCourses =
          user.userRole === "Secretariat"
            ? res.data.filter(
                (course) => course.department_id === user.department_id
              )
            : res.data;

        setCourses(filteredCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchAllCourses();
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

  useEffect(() => {
    if (location.state?.selectedIndex !== undefined) {
      setSelectedCourseIndex(location.state.selectedIndex);
    }
  }, [location.state?.selectedIndex]);
  

  const handleDelete = async (classId) => {
    try {
      await axios.delete(`http://localhost:8080/api/classes/${classId}`);
      setClasses((prevClasses) =>
        prevClasses.filter((cl) => cl.id !== classId)
      );
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  const filteredCourses = courses.filter((course) =>
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

  const columns = [
    { field: "title", headerName: "Class Title", flex: 1 },
    { field: "coursetype", headerName: "Course Type", flex: 1 },
    {
      field: "records",
      headerName: "Records",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            height: "100%",
          }}
        >
            <Button  variant="outlined"
          size="small"
            onClick={() =>
              navigate(`/classes/${params.row.id}/records`, {
                state: {
                  title: filteredCourses[selectedCourseIndex].title,
                  course_id: filteredCourses[selectedCourseIndex].id,
                  selectedIndex: selectedCourseIndex, // Preserve selected course index
                },
              })
            }>View Records</Button>
        </Box>
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
          <button
            className="button delete"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </button>
          <button
            className="button update"
            onClick={() =>
              navigate(`/classes/updateClass/${params.row.id}`, {
                state: {
                  title: filteredCourses[selectedCourseIndex].title,
                  course_id: filteredCourses[selectedCourseIndex].id,
                  selectedIndex: selectedCourseIndex, // Preserve selected course index
                },
              })
            }
          >
            Update
          </button>
        </Box>
      ),
      
    },
  ];

  return (
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
    <Typography variant="h6"sx={{fontWeight: "bold"}} gutterBottom>
      Courses
    </Typography>
    <Button
      variant="text"
      color="primary"
      component={Link}
      to="/courses/addForm"
      state={{ from: "/classes/showClasses" }}
      sx={{ minWidth: 0, padding: 0, marginBottom: "6px" }}
    >
      <AddTwoToneIcon />
    </Button>
  </Box>

  <TextField
    label="Search"
    variant="outlined"
    fullWidth
    sx={{ marginBottom: 2 }}
    onChange={(e) => setCourseSearchQuery(e.target.value)}
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
      <Box sx={{ flex: 1 }} marginTop={5}>
        {filteredCourses[selectedCourseIndex] ? (
          <div>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "rgba(0, 0, 0, 0.87)",
                textAlign: "left",
              }}
            >
              Classes
            </Typography>
            <Typography variant="h5" gutterBottom marginBottom={5}>
              "{filteredCourses[selectedCourseIndex].title}"
            </Typography>

            {classesByCourse[filteredCourses[selectedCourseIndex].id] &&
            classesByCourse[filteredCourses[selectedCourseIndex].id].length >
              0 ? (
                <Box sx={{ maxHeight: 500, overflow: "auto" }}> {/* Wrap DataGrid in a Box */}
              <DataGrid
                rows={classesByCourse[filteredCourses[selectedCourseIndex].id]}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#black",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
                getRowId={(row) => row.id}
              />
              </Box>
            ) : (
              <Box sx={{ textAlign: "left", marginTop: 4 }}>
              <Typography variant="body1">
                No classes available for{" "}
                <b>"{filteredCourses[selectedCourseIndex].title}"</b>.
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
          </div>
        ) : (
          <Typography variant="body1">
            {courseSearchQuery
              ? "No matching courses found. Please refine your search."
              : "Select a course to view classes."}
          </Typography>
        )}
      </Box>

      {/* Floating Action Button */}
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
  );
};
