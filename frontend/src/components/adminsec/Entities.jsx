import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Fab,
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import AttendanceDialog from "./AttendanceDialog";

export const Entities = ({ user }) => {
  const [selectedEntity, setSelectedEntity] = useState(
    localStorage.getItem("selectedEntity") || ""
  );
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
const [filteredStaff, setFilteredStaff] = useState([]);
  const [deps, setDeps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        if (selectedEntity === "students") {
          const res = await axios.get("http://localhost:8080/api/students");
          const allStudents =
            user.userRole === "Secretariat"
              ? res.data.filter(
                  (student) => student.department_id === user.department_id
                )
              : res.data;
          setStudents(allStudents);
          setFilteredStudents(allStudents); // Initialize filtered data
        }
  
        if (selectedEntity === "staff") {
          const res = await axios.get("http://localhost:8080/api/professors");
          const allStaff =
            user.userRole === "Secretariat"
              ? res.data.filter(
                  (professor) => professor.department_id === user.department_id
                )
              : res.data;
          setStaff(allStaff);
          setFilteredStaff(allStaff); // Initialize filtered data
        }
  
        const depsRes = await axios.get(
          "http://localhost:8080/api/departments"
        );
        setDeps(depsRes.data);

        const attendancesRes = await axios.get("http://localhost:8080/api/attendances");
        setAttendances(attendancesRes.data);

        const enrollmentsRes = await axios.get("http://localhost:8080/api/enrollments");
        setEnrollments(enrollmentsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchEntities();
  }, [selectedEntity, user]);
  
  const handleEntitySwitch = (entity) => {
    setSelectedEntity(entity);
    localStorage.setItem("selectedEntity", entity);
  };

  const handleDelete = async (id, entity) => {
    try {
      const endpoint =
        entity === "students"
          ? `http://localhost:8080/api/students/${id}`
          : `http://localhost:8080/api/professors/${id}`;
      await axios.delete(endpoint);
      toast.success(
        entity === "students"
          ? "Student deleted successfully!"
          : "Staff member deleted successfully!"
      );

      if (entity === "students") {
        setStudents((prev) =>
          prev.filter((student) => student.studentid !== id)
        );
      } else {
        setStaff((prev) => prev.filter((professor) => professor.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const handleAdd = () => {
  //   const path =
  //     selectedEntity === "students"
  //       ? "/entities/addStudentForm"
  //       : "/entities/addProfessorForm";
  //   navigate(path);
  // };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  
    if (selectedEntity === "students") {
      setFilteredStudents(
        students.filter((student) => {
          return (
            student.studentid.toLowerCase().includes(query) ||
            student.name.toLowerCase().includes(query) ||
            student.surname.toLowerCase().includes(query) ||
            student.department_id.toLowerCase().includes(query)
          );
        })
      );
    } else if (selectedEntity === "staff") {
      setFilteredStaff(
        staff.filter((professor) => {
          return (
            professor.id.toString().toLowerCase().includes(query) ||
            professor.name.toLowerCase().includes(query) ||
            professor.surname.toLowerCase().includes(query) ||
            professor.ranking.toLowerCase().includes(query) ||
            professor.department_id.toLowerCase().includes(query)
          );
        })
      );
    }
  };
  
  const mapDepartmentName = (id) => {
    const department = deps.find((dep) => dep.custom_id === id);
    return department ? department.title : "Unknown";
  };

  const studentColumns = [
    { field: "studentid", headerName: "Student ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "surname", headerName: "Surname", flex: 1 },
    {
      field: "department_id",
      headerName: "Department",
      flex: 1,
      renderCell: (params) => (
        <span>{mapDepartmentName(params.row.department_id)}</span>
      ),
    },
    {
      field: "attendances",
      headerName: "Attendances",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
           variant="outlined"
          size="small"
          onClick={() => handleOpenDialog(params.row)}
        >
          View Stats
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <button
            className="button delete"
            onClick={() => handleDelete(params.row.studentid, "students")}
          >
            Delete
          </button>
          <button className="button update">
            <Link to={`/entities/updateStudent/${params.row.studentid}`}>
              Update
            </Link>
          </button>
        </div>
      ),
    },
  ];

  const staffColumns = [
    { field: "id", headerName: "Professor ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "surname", headerName: "Surname", flex: 1 },
    { field: "ranking", headerName: "Ranking", flex: 1 },
    {
      field: "department_id",
      headerName: "Department",
      flex: 1,
      renderCell: (params) => (
        <span>{mapDepartmentName(params.row.department_id)}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <button
            className="button delete"
            onClick={() => handleDelete(params.row.id, "staff")}
          >
            Delete
          </button>
          <button className="button update">
            <Link to={`/entities/updateProfessor/${params.row.id}`}>
              Update
            </Link>
          </button>
        </div>
      ),
    },
  ];
  const handleOpenDialog = (student) => {
    setSelectedStudent(student);
    setOpenAttendanceDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAttendanceDialog(false);
    setSelectedStudent(null);
  };

  return (
    <div>
      <Box sx={{ marginBottom: 5 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "black",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          Entities
        </Typography>

        {/* Selection Box */}
        <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  }}
>
  <FormControl sx={{ flex: 1, marginRight: 2 }} variant="outlined">
    <InputLabel id="entity-select-label" >Choose an entity</InputLabel>
    <Select
      labelId="entity-select-label"
      id="entity-select"
      value={selectedEntity}
      onChange={(e) => handleEntitySwitch(e.target.value)}
      label="Choose an entity"
      sx={{maxWidth:300}}
    >
      <MenuItem value="" disabled>
        Choose an entity
      </MenuItem>
      <MenuItem value="students">Students</MenuItem>
      <MenuItem value="staff">Staff</MenuItem>
    </Select>
  </FormControl>
  <TextField
    label="Search"
    variant="outlined"
    value={searchQuery}
    onChange={handleSearch}
    sx={{
      maxWidth: "400px",
      flex: 1,
    }}
  />
</Box>

      </Box>

      {selectedEntity === "students" ? (
  filteredStudents.length > 0 ? (
    <Box sx={{ maxHeight: 500, overflow: "auto" }}>
    <DataGrid
      rows={filteredStudents}
      columns={studentColumns}
      pageSize={10}
      rowsPerPageOptions={[5, 10, 20]}
      disableSelectionOnClick
      getRowId={(row) => row.studentid}
      sx={{
        "& .MuiDataGrid-columnHeaders": {
          background400Color: "#f4f4f4",
          color: "black",
          fontWeight: "bold",
          fontSize: "1.1rem",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: "bold",
        },
      }}
    />
    <AttendanceDialog
  open={openAttendanceDialog}
  onClose={handleCloseDialog}
  student={selectedStudent}
/>

    </Box>
    
  ) : (
    <Box sx={{ textAlign: "left", marginTop: 2 }}>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          color: "rgba(0, 0, 0, 0.87)",
        }}
      >
        No students found. Please refine your search.
      </Typography>
      <Button
        component={Link}
        to="/entities/addStudentForm"
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
      >
        Add New Student
      </Button>
    </Box>
  )
) : selectedEntity === "staff" ? (
  filteredStaff.length > 0 ? (
    <Box sx={{ maxHeight: 500, overflow: "auto" }}>
    <DataGrid
      rows={filteredStaff}
      columns={staffColumns}
      pageSize={10}
      rowsPerPageOptions={[5, 10, 20]}
      disableSelectionOnClick
      getRowId={(row) => row.id}
      
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
  ) : (
    <Box sx={{ textAlign: "left", marginTop: 2 }}>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          color: "rgba(0, 0, 0, 0.87)",
        }}
      >
        No staff found. Please refine your search.
      </Typography>
      <Button
        component={Link}
        to="/entities/addProfessorForm"
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
      >
        Add Staff Member
      </Button>
    </Box>
  )
) : null}


      {selectedEntity && (
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() =>
            selectedEntity === "students"
              ? navigate("/entities/addStudentForm")
              : navigate("/entities/addProfessorForm")
          }
        >
          <AddIcon />
        </Fab>
      )}
    </div>
  );
};
