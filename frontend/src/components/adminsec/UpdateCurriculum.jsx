import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const UpdateCurriculum = ({ user }) => {
  const [curriculum, setCurriculum] = useState({
    title: "",
    department_id: user.userRole === "Secretariat" ? user.department_id : "",
    curdesc: "",
    curtype: "",
    courses: [], // Add courses here
  });

  const navigate = useNavigate();
  const location = useLocation();
  const curriculumId = location.pathname.split("/")[3]; // Get ID by splitting URL path

  const [deps, setDeps] = useState([]);

  // Fetch curriculum data including courses
  useEffect(() => {
    const fetchCurriculumData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/curriculums/${curriculumId}`
        );
        const selectedCurriculum = response.data[0];
        setCurriculum(selectedCurriculum); // TODO .courses[ ] Set the state with the fetched curriculum data
      } catch (error) {
        console.error("Error fetching curriculum data:", error);
      }
    };

    fetchCurriculumData();
  }, [curriculumId]);

  useEffect(() => {
    const fetchAllDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/departments");
        setDeps(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllDepartments();
  }, []);

  const handleChange = (event) => {
    setCurriculum((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdateCurriculum = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/curriculums/${curriculumId}`,
        curriculum
      );
      toast.success("Curriculum updated successfully!");
      setTimeout(() => navigate("/curriculums/showCurriculums"), 500);
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
        Update Curriculum
      </Typography>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Title
        </Typography>
        <TextField
          name="title"
          value={curriculum.title || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
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
              value={curriculum.department_id || ""}
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

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Description
        </Typography>
        <TextField
          name="curdesc"
          value={curriculum.curdesc || ""}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          multiline
          rows={3}
        />
      </Box>

      <Box>
        <Typography variant="body1" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
          Type
        </Typography>
        <FormControl fullWidth>
          <Select
            name="curtype"
            value={curriculum.curtype || ""}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Type
            </MenuItem>
            <MenuItem value="Pregraduate">Pregraduate</MenuItem>
            <MenuItem value="Postgraduate">Postgraduate</MenuItem>
          </Select>
        </FormControl>
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
          to="/curriculums/showCurriculums"
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
          onClick={handleUpdateCurriculum}
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

export default UpdateCurriculum;
