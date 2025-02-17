import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
} from "@mui/material";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export const ProfessorMenu = ({ user, toggleUserRole,handleLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed"
    color=""
    // sx={{
    //   backgroundColor: "#90caf9", // Light blue color
    //   color: "black", // Adjust text color for contrast
    // }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo / Title */}
        
        <Button color="inherit" component={Link} to="/">
        <AssignmentTurnedInIcon></AssignmentTurnedInIcon>
          <Typography variant="h6" component="div" sx={{margin:2}}>
            myAttendances Panel
          </Typography>
        </Button>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button color="inherit" component={Link} to="/home">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/myCourses">
            My Courses
          </Button>
          <Button color="inherit" component={Link} to="/classes/showClasses">
          Classes & Records
          </Button>
          <Button color="inherit" component={Link} to="/myStudents">
            Students
          </Button>
         
          {(user.userRole === "Admin" || user.userRole === "Secretariat") && (
            <Button
              color="inherit"
              component={Link}
              to="/curriculums/showCurriculums"
            >
              Curriculums
            </Button>
          )}
          {user.userRole === "Admin" && <Button
            color="inherit"
            component={Link}
            to="/departments/showDepartments"
          >
            Departments
          </Button>}
         
        
          {/* User Role Selector */}
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="user-role-select-label">Switch Role</InputLabel>
            <Select
              labelId="user-role-select-label"
              id="user-role-select"
              value={user.userRole}
              onChange={toggleUserRole}
              input={<OutlinedInput label="Switch Role" />}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Secretariat">Secretariat</MenuItem>
              <MenuItem value="Professor">Professor</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
            </Select>
          </FormControl>
          {user && (
          <Box>
            <Typography sx={{ display: "inline", marginRight: 2 }}>
              Welcome, {user.name}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}

        </Box>
      </Toolbar>
    </AppBar>
  );
};
