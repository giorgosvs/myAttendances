import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Fab
} from "@mui/material";

import AddIcon from "@mui/icons-material/AddTwoTone";

export const Records = () => {
  const [records, setRecords] = useState([]);
  const [classname, setClassname] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const classId = location.pathname.split("/")[2]; // Get ID from URL

  // Fetch records by class ID
  useEffect(() => {
    const fetchRecordsByClassId = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/classes/${classId}/records`
        );
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecordsByClassId();
  }, [classId]);

  // Fetch class title
  useEffect(() => {
    const fetchClassTitle = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/classes/${classId}`
        );
        setClassname(res.data[0]?.title || "Unknown Class");
      } catch (err) {
        console.error(err);
      }
    };
    fetchClassTitle();
  }, [classId]);

  // Handle delete record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/records/${id}`);
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== id)
      );
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  // Define DataGrid columns
  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "course_date", headerName: "Course Date", flex: 1 },
    { field: "class_id", headerName: "Class ID", flex: 1 },
    {
      field: "attendances",
      headerName: "Attendances",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // Vertically center the button
            justifyContent: "flex-start", // Align to the left
            width: "100%",
            height: "100%",
          }}
        >
          <button
            className="viewButton"
            onClick={() =>
              navigate(`/records/${params.row.id}/attendances`, {
                state: {
                  title: params.row.title, 
                  class_id: params.row.class_id,
                },
              })
            }
          >
            View Attendances
          </button>
        </Box>
      ),
    },
    ,
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // Vertically center content
            justifyContent: "flex-start", // Align to the left
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
          <Link to={`/records/updateRecord/${params.row.id}`}>
            <button className="button update">Update</button>
          </Link>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      {/* Title */}
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontWeight: "bold",
          color: "rgba(0, 0, 0, 0.87)", // Light black
          textAlign: "left",
        }}
      >
        Class Record Details
      </Typography>

      <Typography variant="h6" gutterBottom marginBottom={5}>
        Records for "{classname}"
      </Typography>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />} // Use any icon you like, e.g., from Material Icons
          sx={{
            padding: "10px 20px",
            backgroundColor: "#1976d2", // Replace with your preferred color
            color: "#fff",
            fontWeight: "bold",
            marginBottom:2
          }}
          onClick={() => {
            navigate("/classes/showClasses", {
              state: { selectedIndex: location.state?.selectedIndex }, // Pass selectedIndex back
            });
          }}
        
        >
          Back to Classes
        </Button>

      
      </Box>

      {/* DataGrid */}
      {records.length > 0 ? (
         <Box sx={{ maxHeight: 500, overflow: "auto" }}> {/* Wrap DataGrid in a Box */}
        <DataGrid
          rows={records}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowId={(row) => row.id} // Use "id" as the unique identifier
          
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
        <Typography>No available records for this class.</Typography>
      )}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate(`/records/addRecordForm/${classId}`)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
