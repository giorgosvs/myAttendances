import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Button, Box, Fab, TextField } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { MessageModal } from "../utility/MessageModal";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";

export const Curriculums = ({ user }) => {
  const [curriculums, setCurriculums] = useState([]);
  const [filteredCurriculums, setFilteredCurriculums] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [curriculumCourses, setCurriculumCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Fetch curriculums and departments
  useEffect(() => {
    const fetchAllCurriculums = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/curriculums");
        setCurriculums(res.data);
      } catch (err) {
        console.error("Error fetching curriculums:", err);
      }
    };

    const fetchAllDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/departments");
        const departmentMap = {};
        res.data.forEach((dep) => {
          departmentMap[dep.custom_id] = dep.title;
        });
        setFilteredDepartments(departmentMap);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    fetchAllCurriculums();
    fetchAllDepartments();
  }, []);

  // Filter curriculums based on the user's role
  useEffect(() => {
    if (user.userRole === "Secretariat") {
      const filtered = curriculums.filter(
        (curriculum) => curriculum.department_id === user.department_id
      );
      setFilteredCurriculums(filtered);
    } else {
      setFilteredCurriculums(curriculums);
    }
  }, [curriculums, user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/curriculums/${id}`);
      setCurriculums((prev) =>
        prev.filter((curriculum) => curriculum.id !== id)
      );
      toast.success("Curriculum deleted successfully!");
      setTimeout(500);
    } catch (err) {
      console.error("Error deleting curriculum:", err);
    }
  };

  const handleViewCourses = async (curriculumId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/curriculums/${curriculumId}/courses`
      );
      const courseIds = res.data;

      const courseDetailsPromises = courseIds.map((id) =>
        axios.get(`http://localhost:8080/api/courses/${id}`)
      );
      const courseDetailsResponses = await Promise.all(courseDetailsPromises);
      const courses = courseDetailsResponses.map((res) => res.data);

      setCurriculumCourses(courses.flat());
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleActiveStatus = async (curriculum) => {
    const updatedStatus = !curriculum.active;
    try {
      // Update active status
      await axios.put(
        `http://localhost:8080/api/curriculums/${curriculum.id}`,
        { ...curriculum, active: updatedStatus }
      );

      // Update the local state to reflect changes
      setCurriculums((prev) =>
        prev.map((cur) =>
          cur.id === curriculum.id ? { ...cur, active: updatedStatus } : cur
        )
      );

      // Show success notification
      const statusMessage = updatedStatus ? "activated" : "deactivated";
      toast.success(`Curriculum has been successfully ${statusMessage}.`);
    } catch (err) {
      // Handle errors gracefully
      console.error("Error updating status:", err);
      toast.error("Failed to update the curriculum status. Please try again.");
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCurriculums(
      curriculums.filter((curriculum) => {
        return (
          curriculum.title.toString().toLowerCase().includes(query) ||
          curriculum.department_id.toString().toLowerCase().includes(query) ||
          curriculum.curdesc.toString().toLowerCase().includes(query) ||
          curriculum.curtype.toString().toLowerCase().includes(query)
        );
      })
    );
  };

  const columns = [
    { field: "title", headerName: "Curriculum Title", flex: 1 },
    {
      field: "department_id",
      headerName: "Department",
      flex: 1,
      renderCell: (params) => {
        if (!params.row || !params.row.department_id) {
          return "Unknown"; // Fallback if department_id is missing
        }
        const departmentName = filteredDepartments[params.row.department_id];
        return departmentName || "Unknown"; // Fallback for unmatched department
      },
    },
    { field: "curdesc", headerName: "Description", flex: 2 },
    { field: "curtype", headerName: "Type", flex: 1 },
    {
      field: "courses",
      headerName: "Courses",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
           variant="outlined"
          size="small"
          onClick={() => handleViewCourses(params.row.id)}
        >
          View Courses
        </Button>
      ),
    },
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
            <Link to={`/curriculums/updateCurriculum/${params.row.id}`}>
              Update
            </Link>
          </button>
          <button
            className={`button ${params.row.active ? "active" : "inactive"}`}
            onClick={() => handleActiveStatus(params.row)}
          >
            {params.row.active ? "Active" : "Inactive"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="curriculums" style={{ height: 600, width: "100%", padding:2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "left",
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
            textAlign: "left",
            marginBottom: 2, // Add spacing below the title
          }}
        >
          Curriculums
        </Typography>

        <TextField
          label="Search Curriculums"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          sx={{
            maxWidth: "400px", // Limit the width of the search bar
            width: "100%", // Make it responsive
          }}
        />
      </Box>

      {filteredCurriculums.length > 0 ? (
         <Box sx={{ maxHeight: 500, overflow: "auto" }}>
        <DataGrid
          rows={filteredCurriculums}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          
          getRowId={(row) => row.id}
          sx={{
             // Set the maximum height for the DataGrid
            overflow: "auto", // Ensure scrollbars appear if content exceeds maxHeight
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f4f4f4", // Light gray background for headers
              color: "black", // Dark text color
              fontWeight: "bold", // Bold font for headers
              fontSize: "1.1rem",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold", // Extra specificity for title text
            },
          }}
        />
        </Box>
      ) : (
        <Box sx={{ textAlign: "left", marginTop: 4 }}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              color: "rgba(0, 0, 0, 0.87)", // Light black
            }}
          >
            No curriculums found. Please refine your search.
          </Typography>
          <Button
            component={Link}
            to="/curriculums/addForm"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Add New Curriculum
          </Button>
        </Box>
      )}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/curriculums/addForm")}
      >
        <AddIcon />
      </Fab>
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Courses for Selected Curriculum"
      >
        {curriculumCourses.length > 0 ? (
          <ul>
            {curriculumCourses.map((course) => (
              <li key={course.id}>{course.title}</li>
            ))}
          </ul>
        ) : (
          <p>No courses available for this curriculum.</p>
        )}
      </MessageModal>
    </div>
  );
};
