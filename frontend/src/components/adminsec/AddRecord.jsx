import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { Box, Typography, TextField, Button, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export const AddRecord = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const classId = location.pathname.split("/")[3]; //get ID by splitting URL path

  const [record, setRecord] = useState({
    title: "",
    course_date: "",
    class_id: classId,
  });
  const [classname,setClassname] = useState("");

  
  const handleChange = (event) => {
    setRecord((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    const fetchClassTitle = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/classes/${classId}`)
        setClassname(res.data[0].title);
        
      }catch (err) {
        console.log(err)
      }
    }

    fetchClassTitle();
  },[classId]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/records", record);
      navigate(-1);
    } catch (err) {
      console.log(err);
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
        Add New Record
      </Typography>

      {/* Class Name Field */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}
        >
          Class Name
        </Typography>
        <TextField
          value={classname || ""}
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
            shrink: true, // Ensures the label doesn't overlap when prepopulated
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
          onClick={handleAddRecord}
          sx={{ backgroundColor: "#007bff", color: "#fff" }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );


};
