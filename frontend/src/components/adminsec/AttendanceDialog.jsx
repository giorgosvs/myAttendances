import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const AttendanceDialog = ({ open, onClose, student }) => {
  const [classes, setClasses] = useState([]);
  const [records, setRecords] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          setLoading(true);

          // Fetch all required data
          const [classesRes, recordsRes, enrollmentsRes, attendancesRes] =
            await Promise.all([
              axios.get("http://localhost:8080/api/classes"),
              axios.get("http://localhost:8080/api/records"),
              axios.get("http://localhost:8080/api/enrollments"),
              axios.get("http://localhost:8080/api/attendances"),
            ]);

          setClasses(classesRes.data);
          setRecords(recordsRes.data);
          setEnrollments(enrollmentsRes.data);
          setAttendances(attendancesRes.data);

          // Process attendance data
          const studentEnrollments = enrollmentsRes.data.filter(
            (enrollment) => enrollment.student_id === student.studentid
          );

          if (studentEnrollments.length === 0) {
            setAttendanceSummary([]);
          } else {
            const summary = studentEnrollments.map((enrollment) => {
              const classDetails = classesRes.data.find(
                (cls) => cls.id === enrollment.class_id
              );

              const classRecords = recordsRes.data.filter(
                (record) => record.class_id === enrollment.class_id
              );

              const studentAttendances = classRecords.flatMap((record) =>
                attendancesRes.data.filter(
                  (att) =>
                    att.record_id === record.id &&
                    att.student_id === student.studentid
                )
              );

              const presentCount = studentAttendances.filter(
                (att) => att.present === 1
              ).length;

              const absentCount = studentAttendances.filter(
                (att) => att.present === 0
              ).length;

              return {
                class_id: classDetails?.id || "Unknown",
                class_name: classDetails?.title || "Unknown",
                present: presentCount,
                absent: absentCount,
              };
            });

            setAttendanceSummary(summary);
          }
        } catch (err) {
          console.error("Error fetching attendance data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [open, student]);

  if (!student) return null;

  // Define DataGrid columns
  const columns = [
    { field: "class_id", headerName: "Class ID", flex: 1 },
    { field: "class_name", headerName: "Class Name", flex: 2 },
    { field: "present", headerName: "Total Presences", flex: 1 },
    { field: "absent", headerName: "Total Absences", flex: 1 },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box>
        <DialogTitle>
          <b>Attendance Details for "{student.name} {student.surname}" -  {student.studentid}</b>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography>Loading attendance data...</Typography>
          ) : attendanceSummary.length === 0 ? (
            <Typography>
              Student "{student.studentid}" is not enrolled to any courses at the
              moment.
            </Typography>
          ) : (
            <Box sx={{ marginTop: 2, maxHeight: 400, overflow: "auto" }}>
              <DataGrid
                rows={attendanceSummary}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                getRowId={(row) => row.class_id}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f4f4f4",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AttendanceDialog;
