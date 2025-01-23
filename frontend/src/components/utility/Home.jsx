import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const Home = ({ user }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          padding: 3,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#424242",
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            Welcome, {user.name}!
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "medium",
              color: "#616161",
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            {user.userRole === "Admin"
              ? "You're logged in as the Administrator."
              : user.userRole === "Secretariat"
              ? "You're logged in as a Secretariat Member."
              : user.userRole === "Professor"
              ? "You're logged in as a Professor."
              : "You're logged in as a Student."}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#757575",
              textAlign: "center",
              fontSize: "1.2rem",
            }}
          >
            Welcome to the Attendance Management Application! Here, you can
            manage your courses, records, and attendance seamlessly.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
