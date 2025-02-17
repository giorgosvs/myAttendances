import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", padding: 5 }}>
      <LockIcon sx={{ fontSize: 60, color: "red" }} />
      <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: 2 }}>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/home")}>
        Go to Home
      </Button>
    </Box>
  );
};

export default Unauthorized;
