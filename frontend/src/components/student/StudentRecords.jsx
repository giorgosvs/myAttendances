import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid } from "@mui/x-data-grid";

const StudentRecords = ({ user }) => {
  const [records, setRecords] = useState([]);
  const [classname, setClassname] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [hasAttendance, setHasAttendance] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Track if attendance is verified
  const navigate = useNavigate();
  const location = useLocation();

  const classId = window.location.pathname.split("/")[2]; // Extract classId from URL

  // Fetch records by class ID
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/classes/${classId}/records`
        );
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecords();
  }, [classId]);

  // Fetch class title
  useEffect(() => {
    const fetchClassTitle = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/classes/${classId}`
        );
        setClassname(res.data[0]?.title || "Unknown Class");
      } catch (err) {
        console.error(err);
      }
    };
    fetchClassTitle();
  }, [classId]);

  // Check if the student has already attended the record
  const checkAttendance = async (recordId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/records/${recordId}/attendances`
      );
      const existingAttendance = res.data.find(
        (attendance) => attendance.student_id === user.studentid
      );

      if (existingAttendance) {
        setHasAttendance(true);
        setIsVerified(!!existingAttendance.verified); // Check if attendance is verified
      } else {
        setHasAttendance(false);
        setIsVerified(false);
      }
    } catch (err) {
      console.error("Error checking attendance:", err);
    }
  };

  const handleMarkAttendance = async (recordId) => {
    try {
      await axios.post("http://localhost:8080/api/attendances", {
        record_id: recordId,
        student_id: user.studentid,
        present: 1, // Mark as present
      });
      setSnackbar({
        open: true,
        message: "Attendance marked successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error marking attendance:", err);
      setSnackbar({
        open: true,
        message: "Failed to mark attendance.",
        severity: "error",
      });
    }
    setAttendanceDialogOpen(false);
  };

  const handleOpenAttendanceDialog = (record) => {
    setSelectedRecord(record);
    checkAttendance(record.id); // Check if the student has already attended
    setAttendanceDialogOpen(true);
  };

  const handleCloseAttendanceDialog = () => {
    setAttendanceDialogOpen(false);
    setSelectedRecord(null);
    setHasAttendance(false);
    setIsVerified(false);
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "course_date", headerName: "Course Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleOpenAttendanceDialog(params.row)}
          disabled={isVerified} // Disable button if attendance is verified
        >
          Mark Attendance
        </Button>
      ),
    },
  ];

  const handleCloseSnackbar = () =>
    setSnackbar({ open: false, message: "", severity: "" });

  return (
    <Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ padding: 2 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: "bold",
            color: "rgba(0, 0, 0, 0.87)", // Light black
            textAlign: "left",
          }}
        >
          Class Record Details
        </Typography>

        <Typography variant="h6" gutterBottom marginBottom={5}>
          Records for "{classname}"
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            sx={{
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: "bold",
              marginBottom: 2,
            }}
            onClick={() => {
              navigate("/home", {
                state: { selectedIndex: location.state?.selectedIndex }, // Pass state back
              });
            }}
          >
            Back to Classes
          </Button>
        </Box>

        {records.length > 0 ? (
          <Box sx={{ maxHeight: 500, overflow: "auto" }}>
            <DataGrid
              rows={records}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              getRowId={(row) => row.id}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        ) : (
          <Typography>No available records for this class.</Typography>
        )}

        {/* Attendance Dialog */}
        <Dialog
          open={attendanceDialogOpen}
          onClose={handleCloseAttendanceDialog}
        >
          <DialogTitle>
            {hasAttendance
              ? isVerified
                ? "Attendance Verified"
                : "Already Marked Attendance"
              : `Mark Attendance for "${selectedRecord?.title}"`}
          </DialogTitle>
          <DialogContent>
            {hasAttendance ? (
              isVerified ? (
                <Typography>
                  Your attendance has already been verified for this record on{" "}
                  {selectedRecord?.course_date}. No changes are allowed.
                </Typography>
              ) : (
                <Typography>
                  You have already marked your attendance for this record on{" "}
                  {selectedRecord?.course_date}.
                </Typography>
              )
            ) : (
              <Typography>
                Are you sure you want to mark yourself as present for this
                record on {selectedRecord?.course_date}?
              </Typography>
            )}
          </DialogContent>
          {!hasAttendance && !isVerified && (
            <DialogActions>
              <Button onClick={handleCloseAttendanceDialog} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={() => handleMarkAttendance(selectedRecord?.id)}
                color="primary"
              >
                Confirm
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default StudentRecords;
