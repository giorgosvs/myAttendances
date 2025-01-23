import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, Card, CardContent, Divider } from "@mui/material";


export const UpdateAttendance = ({ selectedAttendance, onClose, matchedStudent }) => {
  const [attendance, setAttendance] = useState(selectedAttendance);

  const handleToggleStatus = async () => {
    try {
      const updatedAttendance = {
        ...attendance,
        present: !attendance.present,
      };

      await axios.put(
        `http://localhost:8080/api/attendances/${attendance.id}`,
        updatedAttendance
      );

      setAttendance(updatedAttendance);

      onClose();
    } catch (error) {
      console.error("Error updating attendance status:", error);
    }
  };

  if (!attendance) return <p>Loading...</p>;

  return (
    <Card sx={{ maxWidth: 400, margin: "0 auto", padding: 3 }}>
    <CardContent>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Update Attendance
      </Typography>
      <Divider sx={{ marginY: 2 }} />
      <Typography variant="body1" gutterBottom>
        <strong>Student ID:</strong> {attendance.student_id}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Full Name:</strong> {matchedStudent.name} {matchedStudent.surname}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Current Status:</strong>{" "}
        {attendance.present ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Present</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Absent</span>
        )}
      </Typography>
      <Divider sx={{ marginY: 2 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          marginTop: 2,
        }}
      >
        <Button
          variant="contained"
          color={attendance.present ? "error" : "success"}
          onClick={handleToggleStatus}
          fullWidth
        >
          {attendance.present ? "Mark Absent" : "Mark Present"}
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose} fullWidth>
          Cancel
        </Button>
      </Box>
    </CardContent>
  </Card>
  );
};
