import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Typography,
  Box,
  Fab,
  TextField,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddTwoTone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UpdateAttendance } from "./UpdateAttendance";
import { MessageModal } from "../utility/MessageModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Attendances = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [className, setClassName] = useState("");
  //const { record_id } = useParams(); // Get the record_id from the URL
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [matchedStudent, setMatchedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const { title, class_id } = location.state || {};

  const [record_id, setRecord_Id] = useState(null);

  useEffect(() => {
    // Extract `record_id` from URL
    const pathSegments = window.location.pathname.split("/");
    const idFromPath = pathSegments[pathSegments.indexOf("records") + 1];
    setRecord_Id(idFromPath);
  }, [location]);

  // Fetch attendance records
  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/records/${record_id}/attendances`
        );
        setAttendances(res.data);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      }
    };
    fetchAttendances();
  }, [record_id]);

  // Fetch student data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/students/`);
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchClassTitle = async () => {
      if (location.state) {
        {
          try {
            const res = await axios.get(
              `http://localhost:8080/api/classes/${class_id}`
            );
            setClassName(res.data[0].title);
          } catch (err) {
            console.error("Error fetching class:", err);
          }
        }
      }
    };

    fetchClassTitle();
  }, [location.state]);

  const handleDeleteAttendance = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/attendances/${id}`);
      setAttendances((prev) =>
        prev.filter((attendance) => attendance.id !== id)
      );
    } catch (err) {
      console.error("Error deleting attendance:", err);
    }
  };

  const handleEditAttendance = (attendance, matchedStudent) => {
    setMatchedStudent(matchedStudent);
    setSelectedAttendance(attendance); // Set the selected attendance
    setIsModalOpen(true); // Open the modal
  };

  // Filter attendances based on search query
  const filteredAttendances = attendances.filter((attendance) => {
    const student = students.find((s) => s.studentid === attendance.student_id);
    return (
      attendance.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student &&
        (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.surname.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  const handleVerifyAttendance = async (attendanceId, verified) => {
    try {
      await axios.put(`http://localhost:8080/api/records/${record_id}/verify`, {
        verified,
      });

      
  
      setAttendances((prev) =>
        prev.map((attendance) =>
          attendance.id === attendanceId
            ? { ...attendance, verified: Boolean(verified) }
            : attendance
        )
      );

      toast.success(
        `Attendance ${verified ? "verified" : "unverified"} successfully!`
      );
    } catch (err) {
      console.error("Error verifying attendance:", err);
    }
  };
  

  // Define DataGrid columns
  const columns = [
    { field: "student_id", headerName: "Student ID", flex: 1 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        const student = students.find(
          (s) => s.studentid === params.row.student_id
        );
        return student ? student.name : "Unknown";
      },
    },
    {
      field: "surname",
      headerName: "Surname",
      flex: 1,
      renderCell: (params) => {
        const student = students.find(
          (s) => s.studentid === params.row.student_id
        );
        return student ? student.surname : "Unknown";
      },
    },
    {
      field: "present",
      headerName: "Attendance Status",
      flex: 1,
      renderCell: (params) => (params.row.present ? "Present" : "Absent"),
    },
    {
      field: "verified",
      headerName: "Verified",
      flex: 0.5,
      renderCell: (params) => {
        if (
          user.userRole === "Professor" ||
          user.userRole === "Secretariat" ||
          user.userRole === "Admin"
        ) {
          return (
            <Checkbox
              checked={Boolean(params.row.verified)} // Ensure boolean value
              onChange={() =>
                handleVerifyAttendance(params.row.id, !params.row.verified)
              }
              color="primary"
            />
          );
        }
        return <Checkbox checked={Boolean(params.row.verified)} disabled />;
      },
    },
    ,
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <button
            className="button delete"
            onClick={() => handleDeleteAttendance(params.row.id)}
          >
            Delete
          </button>
          <button
            className="button update"
            onClick={() =>
              handleEditAttendance(
                params.row,
                students.find((s) => s.studentid === params.row.student_id)
              )
            }
          >
            Update Attendance
          </button>
        </Box>
      ),
    },
  ];

  return (
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
        Attendance Sheet
      </Typography>
      <Typography marginBottom={5} variant="h6" gutterBottom>
        {(location.state && `"` + className + `"`) || ""}
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        label="Search Attendances"
        fullWidth
        sx={{ marginBottom: 2, maxWidth: 400 }}
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />

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
            marginTop: 2,
            marginBottom: 2,
          }}
          onClick={() => navigate(-1)}
        >
          Back to Records
        </Button>
      </Box>

      {filteredAttendances.length > 0 ? (
        <Box sx={{ maxHeight: 500, overflow: "auto" }}>
          {" "}
          {/* Wrap DataGrid in a Box */}
          <DataGrid
            rows={filteredAttendances}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
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
      ) : (
        <Typography>No attendance records available for this class.</Typography>
      )}

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Attendance Status"
      >
        {selectedAttendance && (
          <UpdateAttendance
            matchedStudent={matchedStudent}
            selectedAttendance={selectedAttendance}
            onClose={() => {
              setIsModalOpen(false);
              window.location.reload();
            }}
          />
        )}
      </MessageModal>
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate(`/attendances/addForm/${record_id}`)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Attendances;
