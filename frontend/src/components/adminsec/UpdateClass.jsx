import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";


export const UpdateClass = () => {
  const [cl, setCl] = useState({
    title: "",
    course_id: null,
    coursetype: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const classId = location.pathname.split("/")[3]; // Get class ID

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/classes/${classId}`
        );
        const selectedClass = response.data.find(
          (cl) => cl.id === parseInt(classId)
        );
        setCl(selectedClass);
      } catch (err) {
        console.log("Error fetching class data:", err);
      }
    };

    fetchClassData();
  }, [classId]);

  const handleChange = (event) => {
    setCl((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/classes/${classId}`, cl);

      // Navigate back to Classes with preserved state
      navigate("/classes/showClasses", {
        state: {
          selectedIndex: location.state?.selectedIndex || 0, // Use the passed index or fallback to 0
        },
      });
    } catch (err) {
      console.log("Error updating class:", err);
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
        Update Class
      </Typography>

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
          value={cl.title || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Title"
        />
      </Box>

      {/* Course ID Field (Immutable) */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}
        >
          Course ID
        </Typography>
        <TextField
          name="course_id"
          value={cl.course_id || ""}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          fullWidth
          placeholder="Course ID"
          sx={{
            backgroundColor: "#f4f4f4",
            color: "#666",
          }}
        />
      </Box>

      {/* Course Type Dropdown */}
      <Box>
        <Typography
          variant="body1"
          sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}
        >
          Course Type
        </Typography>
        <FormControl fullWidth>
          <Select
            name="coursetype"
            value={cl.coursetype || ""}
            onChange={handleChange}
          >
            <MenuItem value="" disabled>
              Select Course Type
            </MenuItem>
            <MenuItem value="Theory Course">Theory Course</MenuItem>
            <MenuItem value="Lab Course">Lab Course</MenuItem>
          </Select>
        </FormControl>
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
          onClick={() =>
            navigate("/classes/showClasses", {
              state: {
                selectedIndex: location.state?.selectedIndex || 0,
              },
            })
          }
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
          onClick={handleUpdateClass}
          sx={{ backgroundColor: "#007bff", color: "#fff" }}
        >
          Update
        </Button>
      </Box>
    </Box>
  );

};
