import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";

export const UpdateRecord = () => {
  const [record, setRecord] = useState({
    title: "",
    course_date: "",
    class_id: null,
  });
  const [className, setClassName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const recordId = location.pathname.split("/")[3]; //get ID by splitting URL path

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/records/${recordId}`
        );
        const selectedRecord = response.data[0];
        setRecord(selectedRecord);
      } catch (err) {
        console.log("Error fetching record data:", err);
      }
    };

    fetchRecordData();
  }, [recordId]);

  useEffect(() => {
    const fetchClassTitle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/classes/${record.class_id}`
        );
        setClassName(response.data[0]?.title || ""); // Set title or default to an empty string
      } catch (err) {
        console.log("Error fetching class data:", err);
      }
    };

    if (record.class_id) {
      fetchClassTitle();
    }
  }, [record.class_id]); // Trigger when record.class_id changes

  const handleChange = (event) => {
    setRecord((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      await axios.put(`http://localhost:8080/api/records/${recordId}`, record);
      navigate(-1);
    } catch (err) {
      console.log("Error updating record:", err);
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
        Update Record
      </Typography>

      {/* Class Field */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}
        >
          Class
        </Typography>
        <TextField
          value={className || ""}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: "#f4f4f4",
            color: "#666",
          }}
        />
      </Box>

      {/* Title Field */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}
        >
          Title
        </Typography>
        <TextField
          name="title"
          value={record.title || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Title"
        />
      </Box>

      {/* Course Date Field */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}
        >
          Course Date
        </Typography>
        <TextField
          name="course_date"
          value={record.course_date || ""}
          onChange={handleChange}
          type="date"
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true, // Ensures proper label positioning for pre-filled dates
          }}
        />
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginTop: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "#e0e0e0",
            color: "#333",
            "&:hover": { backgroundColor: "#d0d0d0" },
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateRecord}
          sx={{ backgroundColor: "#007bff", color: "#fff" }}
        >
          Update
        </Button>
      </Box>
    </Box>
  );

};
