import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Autocomplete,
  TextField,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [existingAttendances, setExistingAttendances] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]); // Multiple selection
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [record_id, setRecord_Id] = useState(null);
  const [class_Id, setClass_Id] = useState(null);

  useEffect(() => {
    // Extract `record_id` from URL
    const pathSegments = window.location.pathname.split("/");
    const idFromPath =
      pathSegments[pathSegments.indexOf("addForm") + 1]; // Get the segment before "addForm"
      
    setRecord_Id(idFromPath);
  }, [location,record_id]);



  useEffect(() => {
    if (!record_id) return; // Wait until record_id is set

    const fetchData = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch the record to get the class_id
        const recordRes = await axios.get(
          `http://localhost:8080/api/records/${record_id}`
        );
        const classId = recordRes.data[0]?.class_id; // Safely extract class_id
        if (!classId) {
          throw new Error("Class ID not found for the provided record.");
        }
        setClass_Id(classId);

        // Step 2: Fetch students enrolled in the class
        const enrollmentsRes = await axios.get(
          "http://localhost:8080/api/enrollments"
        );
        const enrolled = enrollmentsRes.data.filter(
          (enrollment) => enrollment.class_id === classId
        );

        // Step 3: Fetch existing attendance data for the record
        const attendanceRes = await axios.get(
          `http://localhost:8080/api/records/${record_id}/attendances`
        );
        const attendanceIds = attendanceRes.data.map((att) => att.student_id);

        // Step 4: Fetch all students
        const studentsRes = await axios.get("http://localhost:8080/api/students/");
        const allStudents = studentsRes.data;

        // Step 5: Filter available students
        const available = enrolled.filter(
          (student) => !attendanceIds.includes(student.student_id)
        );

        // Update state
        setEnrolledStudents(enrolled);
        setExistingAttendances(attendanceIds);
        setAvailableStudents(available);
        setStudents(allStudents);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [record_id]);

  // Helper function to get full name
  const getStudentName = (studentId) => {
    const student = students.find((s) => s.studentid === studentId);
    return student ? `${student.name} ${student.surname}` : "Unknown Student";
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      setError("Please select at least one student.");
      return;
    }

    try {
      const attendancePromises = selectedStudents.map((student) =>
        axios.post("http://localhost:8080/api/attendances", {
          record_id: parseInt(record_id, 10),
          student_id: student.student_id,
          present: 1, // Assume all are present; modify logic if needed
        })
      );

      await Promise.all(attendancePromises);

      navigate(-1); // Go back to the previous page after successful submission
    } catch (err) {
      console.error("Error adding attendance:", err);
      setError("Failed to add attendance. Please try again.");
    }
  };

  const handleAddStudent = (student) => {
    if (!selectedStudents.find((s) => s.student_id === student.student_id)) {
      setSelectedStudents((prev) => [...prev, student]);
      setAvailableStudents((prev) =>
        prev.filter((s) => s.student_id !== student.student_id)
      );
    }
  };

  const handleRemoveStudent = (studentId) => {
    const removedStudent = selectedStudents.find(
      (s) => s.student_id === studentId
    );
    if (removedStudent) {
      setSelectedStudents((prev) =>
        prev.filter((s) => s.student_id !== studentId)
      );
      setAvailableStudents((prev) => [...prev, removedStudent]);
    }
  };

  const handleAddRemaining = async () => {
    try {
      const absentStudents = availableStudents.map((student) => ({
        record_id: parseInt(record_id, 10),
        student_id: student.student_id,
        present: 0, // Mark as absent
        verified: true, // Mark as verified
      }));

      

      // Add absent students as verified
      await Promise.all(
        absentStudents.map((student) =>
          axios.post("http://localhost:8080/api/attendances", student)
        )
      );

      // Update state and navigate back
      setError("");
      setAvailableStudents([]);
      navigate(-1);
    } catch (err) {
      console.error("Error adding absent students:", err);
      setError("Failed to mark absent students. Please try again.");
    }
  };

  if (loading) {
    return <Typography>Loading data...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 2, maxWidth: 600, margin: "0 auto" }}>
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontWeight: "bold",
          color: "rgba(0, 0, 0, 0.87)", // Light black
          textAlign: "left",
          marginBottom: 4,
        }}
      >
        Add Attendance
      </Typography>

      {/* Autocomplete for Student Selection */}
      <Autocomplete
        options={availableStudents}
        getOptionLabel={(student) =>
          `${student.student_id} - ${getStudentName(student.student_id)}`
        }
        noOptionsText="No students enrolled" 
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Student"
            variant="outlined"
            fullWidth
          />
        )}
        onChange={(event, newValue) => {
          if (newValue) handleAddStudent(newValue);
        }}
        isOptionEqualToValue={(option, value) =>
          option.student_id === value.student_id
        }
      />

      {/* Selected Students */}
      {selectedStudents.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ marginTop: 3 }}>
          {selectedStudents.map((student) => (
            <Chip
              key={student.student_id}
              label={getStudentName(student.student_id)}
              onDelete={() => handleRemoveStudent(student.student_id)}
              color="primary"
            />
          ))}
        </Stack>
      )}

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ marginBottom: 3 }}>
          {error}
        </Typography>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={selectedStudents.length === 0}
        >
          Submit
        </Button>
        <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddRemaining}
        >
          Close Session
        </Button>
        </Box>
        
      </Box>
    </Box>
  );
};

export default AddAttendance;
