import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

export const AddDepartment = () => {
  const [department, setDepartment] = useState({
    custom_id: "",
    title: ""
  });
  const navigate = useNavigate();

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      console.log(department);
      await axios.post("http://localhost:8080/api/departments", department);
      toast.success("Department added successfully!");
      setTimeout( () => navigate('/departments/showDepartments'),500);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    setDepartment((prev) => ({ ...prev, [event.target.name]: event.target.value }));
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
        Add New Department
      </Typography>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Department ID
        </Typography>
        <TextField
          name="custom_id"
          value={department.custom_id || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Department ID"
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Title
        </Typography>
        <TextField
          name="title"
          value={department.title || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Title"
        />
      </Box>

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
          onClick={handleAddDepartment}
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#007bff", color: "#fff" }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );

};
