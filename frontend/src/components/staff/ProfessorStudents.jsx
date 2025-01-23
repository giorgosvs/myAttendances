import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import AttendanceDialog from "../adminsec/AttendanceDialog";

const ProfessorStudents = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null); // For dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch the course IDs assigned to the professor
        const courseRes = await axios.get(
          `http://localhost:8080/api/professors/${user.id}/courses`
        );
        const assignedCourseIds = courseRes.data; // Array of course IDs
  
        // Fetch all enrollments and filter by courses assigned to the professor
        const enrollmentsRes = await axios.get(
          "http://localhost:8080/api/enrollments"
        );
        const filteredEnrollments = enrollmentsRes.data.filter((enrollment) =>
          assignedCourseIds.includes(enrollment.course_id)
        );
  
        // Fetch all classes to map class titles
        const classesRes = await axios.get("http://localhost:8080/api/classes");
        const classMap = {};
        classesRes.data.forEach((cls) => {
          classMap[cls.id] = cls.title; // Map class ID to title
        });
  
        // Extract unique student IDs
        const studentIds = [
          ...new Set(filteredEnrollments.map((e) => e.student_id)),
        ];
  
        // Fetch student data and map enrollments to students
        const studentsRes = await axios.get("http://localhost:8080/api/students");
        const professorStudents = studentsRes.data.filter((student) =>
          studentIds.includes(student.studentid)
        );
  
        // Add enrollment details, including class title, for each student
        const detailedStudents = professorStudents.map((student) => ({
          ...student,
          enrollments: filteredEnrollments.map((enrollment) => ({
            ...enrollment,
            class_title: classMap[enrollment.class_id] || "Unknown", // Add class title
          })),
        }));
  
        setStudents(detailedStudents);
        setFilteredStudents(detailedStudents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchStudents();
  }, [user.id]);
  

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    setFilteredStudents(
      students.filter(
        (student) =>
          student.studentid.toLowerCase().includes(query) ||
          student.name.toLowerCase().includes(query) ||
          student.surname.toLowerCase().includes(query)
      )
    );
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const handleViewStats = (student) => {
    setSelectedStudent(student);
    setAttendanceDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleCloseAttendanceDialog = () => {
    setAttendanceDialogOpen(false);
    setSelectedStudent(null);
  };


  const studentColumns = [
    { field: "studentid", headerName: "Student ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "surname", headerName: "Surname", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => handleRowClick(params.row)}
            size="small"
          >
            View Details
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleViewStats(params.row)}
            size="small"
          >
            View Stats
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
        <Box sx={{marginBottom : "50px"}}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", marginBottom: 2 }}
      >
        My Students
      </Typography>
      <TextField
        label="Search Students"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{
            maxWidth: "400px",
          }}
      />
      </Box>
      <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={filteredStudents}
        columns={studentColumns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.studentid}
        sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f4f4f4", // Light gray background for headers
              color: "black", // Dark text color
              fontWeight: "bold", // Bold font for headers
              fontSize: "1.1rem",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
          }}
      />
       </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{marginBottom : 2}}>
          <b>Enrollment Details for "{selectedStudent?.name} {selectedStudent?.surname}" - { selectedStudent?.studentid}</b>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent >
          {selectedStudent && selectedStudent.enrollments.length > 0 ? (
            <Table>
  <TableHead
    sx={{
      "& th": {
        backgroundColor: "#f4f4f4", // Light gray background
        color: "black", // Black text color
        fontWeight: "bold", // Bold font
        fontSize: "1.1rem", // Font size matching DataGrid headers
        textAlign: "center", // Center-align text
      },
    }}
  >
    <TableRow>
      <TableCell>Course ID</TableCell>
      <TableCell>Class ID</TableCell>
      <TableCell>Class Title</TableCell>
      <TableCell>Enrolled Year</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {selectedStudent.enrollments.map((enrollment, index) => (
      <TableRow key={index}>
        <TableCell>{enrollment.course_id}</TableCell>
        <TableCell>{enrollment.class_id}</TableCell>
        <TableCell>{enrollment.class_title}</TableCell>
        <TableCell>{enrollment.enrolled_year}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

          ) : (
            <Typography>No enrollment details available for this student.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Attendance Stats Dialog */}
      <AttendanceDialog
        open={attendanceDialogOpen}
        onClose={handleCloseAttendanceDialog}
        student={selectedStudent}
      />
    </Box>
  );
};

export default ProfessorStudents;
