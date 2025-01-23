import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Typography, TextField, Button } from "@mui/material";

export const UpdateDepartment = () => {
  const [department, setDepartment] = useState({
    title: "",
    custom_id: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const departmentId = location.pathname.split("/")[3]; //get ID by splitting URL path

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/departments/${departmentId}`
        );
        const selectedDepartment = response.data.find(
          (department) => department.id === parseInt(departmentId)
        );
        setDepartment(selectedDepartment);
      } catch (err) {
        console.log("Error fetching department data:", err);
      }
    };

    fetchDepartmentData();
  }, [departmentId]);

  const handleChange = (event) => {
    setDepartment((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      await axios.put(
        `http://localhost:8080/api/departments/${departmentId}`,
        department
      );
      toast.success("Department updated successfully!");
      setTimeout(() => navigate(-1), 500);
    } catch (err) {
      console.log("Error updating department:", err);
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
        Update Department
      </Typography>
  
      {/* Custom ID (Read-Only) */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold" }}
        >
          Department ID
        </Typography>
        <TextField
          name="custom_id"
          value={department.custom_id || ""}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true, // Make this field read-only
          }}
          sx={{
            backgroundColor: "#f4f4f4",
            color: "#666",
          }}
        />
      </Box>
  
      {/* Title (Editable) */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold" }}
        >
          Title
        </Typography>
        <TextField
          name="title" // Set this to "title" to align with your `handleChange` method
          value={department.title || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Title"
        />
      </Box>
  
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
          onClick={handleUpdateDepartment}
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
