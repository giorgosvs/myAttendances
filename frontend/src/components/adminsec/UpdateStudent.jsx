import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

export const UpdateStudent = ({user}) => {
  const [student, setStudent] = useState({
    studentid: "",
    name: "",
    surname: "",
    department_id: "",
  });

  const [deps,setDeps] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const studentId = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/students/${studentId}`
        );
        if (response.data) {
          setStudent(response.data[0]);
        } else {
          console.log("No student data found for the given ID.");
        }
      } catch (err) {
        console.log("Error fetching student data:", err);
      }
    };

    fetchStudentData();
  },[studentId]);

  useEffect(() => {
    const fetchAllDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/departments");
        setDeps(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchAllDepartments();
  },[])
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
        await axios.put("http://localhost:8080/api/students/" + studentId, student)
      toast.success(`Student ${student.studentid} updated successfully!`);
      setTimeout(()=>navigate("/entities/showEntities"), 200)
    }catch(err) {
      toast.error(err);
        console.log(err);
    }
  }

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
        Update Student
      </Typography>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
          Student ID
        </Typography>
        <TextField
          name="studentid"
          value={student.studentid}
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

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
          Name
        </Typography>
        <TextField
          name="name"
          value={student.name || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Name"
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
          Surname
        </Typography>
        <TextField
          name="surname"
          value={student.surname || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          placeholder="Surname"
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold", color: "#000" }}>
          Department
        </Typography>
        {user.userRole === "Secretariat" ? (
          <TextField
            value={
              deps.find((dep) => dep.custom_id === user.department_id)?.title ||
              "Your Department"
            }
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
        ) : (
          <FormControl fullWidth>
            <Select
              name="department_id"
              value={student.department_id || ""}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select a Department
              </MenuItem>
              {deps.map((dep) => (
                <MenuItem key={dep.id} value={dep.custom_id}>
                  {dep.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
          component={Link}
          to="/entities/showEntities"
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
          onClick={handleUpdateStudent}
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
