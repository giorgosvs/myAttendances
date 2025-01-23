import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Typography, Button, TextField,Fab, Box } from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchAllDepartments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/departments/${id}`);
      setDepartments((prevDeps) =>
        prevDeps.filter((department) => department.id !== id)
      );
      toast.success("Department deleted successfully!");
      setTimeout(500);
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  const columns = [
    { field: "custom_id", headerName: "Department ID", flex: 1 },
    { field: "title", headerName: "Department Title", flex: 1 },
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
            <Link to={`/departments/updateDepartment/${params.row.id}`}>
              Update
            </Link>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="departments" style={{ height: 600, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
              textAlign: "center",
            }}
          >
            {departments.length > 0 ? "All Departments" : "Add Departments"}
          </Typography>

          
        </Box>

        {departments.length > 0 && (
           <Box sx={{ maxHeight: 500, overflow: "auto" }}> 
          <DataGrid
            rows={departments}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#black", // Light gray background for headers
                color: "black", // Dark text color
                fontWeight: "bold", // Bold font for headers
                fontSize: "1.1rem",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold", // Extra specificity for title text
              },
            }}
          ></DataGrid>
          </Box>
        )}
        <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/departments/addForm")}
      >
        <AddIcon />
      </Fab>
      </div>
    </>
  );
};
