import React, { useState,useEffect } from "react";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// Import components
import Courses from "./components/adminsec/Courses.jsx";
import AddCourse from "./components/adminsec/AddCourse.jsx";
import UpdateCourse from "./components/adminsec/UpdateCourse.jsx";
import { Menu } from "./components/utility/Menu.jsx";
import { Curriculums } from "./components/adminsec/Curriculums.jsx";
import { AddCurriculum } from "./components/adminsec/AddCurriculum.jsx";
import UpdateCurriculum from "./components/adminsec/UpdateCurriculum.jsx";
import { Entities } from "./components/adminsec/Entities.jsx";
import { AddStudent } from "./components/adminsec/AddStudent.jsx";
import { AddProffesor } from "./components/adminsec/AddProffesor.jsx";
import { UpdateStudent } from "./components/adminsec/UpdateStudent.jsx";
import { UpdateProfessor } from "./components/adminsec/UpdateProfessor.jsx";
import { Classes } from "./components/adminsec/Classes.jsx";
import { AddClass } from "./components/adminsec/AddClass.jsx";
import { UpdateClass } from "./components/adminsec/UpdateClass.jsx";
import { Records } from "./components/adminsec/Records.jsx";
import Attendance, { Attendances } from "./components/adminsec/Attendances.jsx";
import { UpdateRecord } from "./components/adminsec/UpdateRecord.jsx";
import { AddRecord } from "./components/adminsec/AddRecord.jsx";
import AddAttendance from './components/adminsec/AddAttendance.jsx'
import { Departments } from "./components/adminsec/Departments.jsx";
import { AddDepartment } from "./components/adminsec/AddDepartment.jsx";
import { UpdateDepartment } from "./components/adminsec/UpdateDepartment.jsx";
import { Enrollments } from "./components/adminsec/Enrollments.jsx";
import { StudentMenu } from "./components/utility/StudentMenu.jsx";
import { ProfessorMenu } from "./components/utility/ProfessorMenu.jsx";
import ProfessorCourses from "./components/staff/ProfessorCourses.jsx";
import ProfessorClasses from "./components/staff/ProfessorClasses.jsx";
import ProfessorAddClass from "./components/staff/ProfessorAddClass.jsx";
import ProffessorRecords from "./components/staff/ProffessorRecords.jsx";
import ProfessorStudents from "./components/staff/ProfessorStudents.jsx";
import StudentClasses from "./components/student/StudentClasses.jsx";
import StudentRecords from "./components/student/StudentRecords.jsx";
import Home from "./components/utility/Home.jsx";
import Login from "./components/utility/Login.jsx";


// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#424242", // Dark gray for accents
    },
    secondary: {
      main: "#76c7c0", // Soft teal to complement dark gray
    },
    background: {
      default: "#f4f4f4", // Light gray background
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    button: {
      textTransform: "none", // Keep buttons lowercase for readability
    },
  },
  text: {
    primary: "#ffffff", // White for high contrast
    secondary: "#b0b0b0", // Softer gray for secondary text
  },
});


const USERS = {
  Admin: {
    Admin: {
    name: "Admin",
    surname: "Admin",
    userRole: "Admin",
    department_id: null,
  },
  Secretariat: {
    id: 11,
    name: "Despoina",
    surname: "Mavropoulou",
    userRole: "Secretariat",
    department_id: "IT",
  },
  Professor: {
    id: 1,
    name: "Alice",
    surname: "Williams",
    userRole: "Professor",
    department_id: "IT",
  },
  Student: {
    studentid: "IT2003",
    name: "Emily",
    surname: "Johnson",
    userRole: "Student",
    department_id: "IT",
  },  name: "Admin",
    surname: "Admin",
    userRole: "Admin",
    department_id: null,
  },
  Secretariat: {
    id: 11,
    name: "Despoina",
    surname: "Mavropoulou",
    userRole: "Secretariat",
    department_id: "IT",
  },
  Professor: {
    id: 1,
    name: "Alice",
    surname: "Williams",
    userRole: "Professor",
    department_id: "IT",
  },
  Student: {
    studentid: "IT2003",
    name: "Emily",
    surname: "Johnson",
    userRole: "Student",
    department_id: "IT",
  },
};

function App() {
  // const [user, setUser] = useState(USERS.Admin);
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
    }

    setLoading(false);
}, []);


  const toggleUserRole = (e) => {
    setUser(USERS[e.target.value]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); 
    
  };

  // if (loggedOut) {
  //   return <Navigate to="/login" replace />;
  // }
  

  const renderMenu = () => {
    if(!user) {return null};
    if (user.userRole === "Professor") {
      return <ProfessorMenu user={user} toggleUserRole={toggleUserRole} handleLogout={handleLogout} />;
    
    } else if (user.userRole === "Student") {
      return <StudentMenu user={user} toggleUserRole={toggleUserRole} handleLogout={handleLogout}/>;
    } else {
      // Default Menu for Admin and Secretariat
      return <Menu user={user} toggleUserRole={toggleUserRole} handleLogout={handleLogout}/>;
    }
  };



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ToastContainer autoClose={2000} hideProgressBar pauseOnHover theme="colored" />
        {loading ? ( 
                <CircularProgress/>
            ) : (
        <>
        {renderMenu()}
        <Box sx={{ marginTop: "100px", padding: 2 }}>
          <Routes>
          {!user ? (
              // If user is not logged in, show login page
              <Route path="*" element={<Login setUser={setUser} />} />
            ) : (
              <>
                <Route path="/home" element={<Home user={user} />} />
            {user.userRole === "Admin" || user.userRole === "Secretariat" ? (
              <>
              <Route path="/home" element={<Home user={user} />} />
                <Route path="/courses/showCourses" element={<Courses user={user} />} />
                <Route path="/courses/addForm" element={<AddCourse user={user} />} />
                <Route path="/courses/updateCourse/:id" element={<UpdateCourse user={user} />} />
                <Route path="/curriculums/showCurriculums" element={<Curriculums user={user} />} />
                <Route path="/curriculums/addForm" element={<AddCurriculum user={user} />} />
                <Route path="/curriculums/updateCurriculum/:id" element={<UpdateCurriculum user={user} />} />
                <Route path="/entities/showEntities" element={<Entities user={user} />} />
                <Route path="/entities/addStudentForm" element={<AddStudent user={user} />} />
                <Route path="/entities/addProfessorForm" element={<AddProffesor user={user} />} />
                <Route path="/entities/updateStudent/:id" element={<UpdateStudent user={user} />} />
                <Route path="/entities/updateProfessor/:id" element={<UpdateProfessor user={user} />} />
                <Route path="/classes/showClasses" element={<Classes user={user} />} />
                <Route path="/classes/addForm" element={<AddClass user={user} />} />
                <Route path="/classes/updateClass/:id" element={<UpdateClass user={user} />} />
                <Route path="/classes/:id/records" element={<Records user={user}/>}></Route>
                <Route path="/departments/showDepartments" element={<Departments />} />
                <Route path="/departments/addForm" element={<AddDepartment />} />
                <Route path="/departments/updateDepartment/:id" element={<UpdateDepartment />} />
                <Route path="/records/addRecordForm/:class_id" element={<AddRecord />} />
                <Route path="/records/updateRecord/:id" element={<UpdateRecord />} />
                <Route path="/records/:record_id/attendances" element={<Attendance user={user} />} />
                <Route path="/attendances/addForm/:record_id" element={<AddAttendance />} />
                <Route path="/enrollments/handleEnrollments" element={<Enrollments user={user} />} />
              </>
            ) : user.userRole === "Professor" ? (
              <>
                              <Route path="/home" element={<Home user={user}/>}/>
                <Route path="/myCourses" element={<ProfessorCourses user={user} />} />
                <Route path="/myStudents" element={<ProfessorStudents user={user} />} />
                
                <Route path="/classes/showClasses" element={<ProfessorClasses user={user} />} />
                <Route path="/classes/addForm" element={<ProfessorAddClass user={user} />} />
                <Route path="/classes/:id/records" element={<ProffessorRecords user={user} />} />
                <Route path="/records/updateRecord/:id" element={<UpdateRecord />} />
                <Route path="/records/addRecordForm/:class_id" element={<AddRecord />} />
                <Route path="/records/:id/attendances" element={<Attendance user={user} />} />
                <Route path="/records/:record_id/attendances" element={<Attendance />} />
                <Route path="/attendances/addForm/:record_id" element={<AddAttendance />} />
                
              </>
            ) : user.userRole === "Student" ? (
              <>
               {/* Redirect the root route ("/") to "/home" for students
    <Route path="/" element={<Navigate to="/home" replace />} />
     */}
    
            {/* Define the /home route */}
                <Route path="/portfolio" element={<StudentClasses user={user} />} />
                <Route path="/classes/:id/records" element={<StudentRecords user={user} />} />
                <Route path="/records/updateRecord/:id" element={<UpdateRecord />} />
                <Route path="/records/addRecordForm/:class_id" element={<AddRecord />} />
                <Route path="/records/:id/attendances" element={<Attendance user={user} />} />
                <Route path="/records/:record_id/attendances" element={<Attendance />} />
                <Route path="/attendances/addForm/:record_id" element={<AddAttendance />} />
              </> 
            ) : (
              <Route path="*" element={<Navigate to="/home" />} />
            )}
            </>
            )}
          </Routes>
        </Box>
        </>
        )}
      </BrowserRouter>
      
    </ThemeProvider>
  );
}

export default App;
