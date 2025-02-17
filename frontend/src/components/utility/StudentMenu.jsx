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
import BuildIcon from '@mui/icons-material/Build';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';


export const StudentMenu = ({ user, toggleUserRole, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" color="">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo / Title */}
        
        <Button color="inherit" component={Link} to="/portfolio">
      
        <AssignmentTurnedInIcon></AssignmentTurnedInIcon>
        <Typography variant="h6" component="div" sx={{margin:2}}>
            myAttendances
          </Typography>
        </Button>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        
        <Button color="inherit" component={Link} to="/portfolio">Portfolio</Button>
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
