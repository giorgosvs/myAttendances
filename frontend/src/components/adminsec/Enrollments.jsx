import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { TextField, Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

const HiddenInput = styled("input")({
  display: "none",
});

export const Enrollments = ({ user }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  useEffect(() => {
    const fetchEnrollmentsWithDepartment = async () => {
      try {
        const enrollmentsResponse = await axios.get(
          "http://localhost:8080/api/enrollments/"
        );
        const enrollmentsData = enrollmentsResponse.data;

        const departmentPromises = enrollmentsData.map(async (enrollment) => {
          try {
            const courseResponse = await axios.get(
              `http://localhost:8080/api/courses/${enrollment.course_id}`
            );
            const courseData = courseResponse.data[0];
            return {
              ...enrollment,
              department_id: courseData?.department_id || "Unknown",
            };
          } catch (err) {
            console.error(`Error fetching course for ID ${enrollment.course_id}:`, err);
            return { ...enrollment, department_id: "Unknown" };
          }
        });

        const enrichedEnrollments = await Promise.all(departmentPromises);
        setEnrollments(enrichedEnrollments);

        if (user.userRole === "Secretariat") {
          const filtered = enrichedEnrollments.filter(
            (enrollment) => enrollment.department_id === user.department_id
          );
          setFilteredEnrollments(filtered);
        } else {
          setFilteredEnrollments(enrichedEnrollments);
        }
      } catch (err) {
        console.error("Error fetching enrollments or courses:", err);
      }
    };

    fetchEnrollmentsWithDepartment();
  }, [user]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredEnrollments(
      enrollments.filter((enrollment) => {
        return (
          enrollment.student_id.toString().toLowerCase().includes(query) ||
          enrollment.course_id.toString().toLowerCase().includes(query) ||
          enrollment.class_id.toString().toLowerCase().includes(query) ||
          enrollment.enrolled_year.toString().includes(query)
        );
      })
    );
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/enrollments/${id}`);
      setEnrollments((prevEnrollments) =>
        prevEnrollments.filter((enrollment) => enrollment.id !== id)
      );
      toast.success("Enrollment deleted successfully!");
      setTimeout( () => window.location.reload(),200);
    } catch (err) {
      console.error("Error deleting enrollment:", err);
      toast.error("Failed to delete enrollment.");
    }
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvData = e.target.result;
        const enrollments = parseCsv(csvData);
        await axios.post("http://localhost:8080/api/enrollments/bulk", { enrollments });
        toast.success("Enrollments added successfully!");
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        if (error.response?.data?.duplicates) {
          const duplicates = error.response.data.duplicates.map(
            (dup) => `${dup.student_id} in course ${dup.course_id}, class ${dup.class_id}`
          );
          toast.error(`Failed to upload: Duplicate enrollments: ${duplicates.join("; ")}`);
        } else {
          toast.error(`Failed to upload CSV: ${error.message}`);
        }
      }
    };

    reader.onerror = () => {
      toast.error("Error reading the file. Please try again.");
    };

    reader.readAsText(csvFile);
  };

  const handleUndo = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/enrollments/undoLastBulk"
      );
      const undoneRecords = response.data.undoneRecords || [];
      toast.success(`Successfully undone ${undoneRecords.length} enrollments.`);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to undo the last operation."
      );
    }
  };

  const parseCsv = (csvData) => {
    const lines = csvData.split("\n").filter((line) => line.trim());
    if (lines.length === 0) {
      throw new Error("The uploaded CSV file is empty.");
    }

    const headers = lines[0].split(",").map((header) => header.trim());
    const requiredHeaders = ["student_id", "course_id", "class_id", "enrolled_year"];
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
    }

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());
      return {
        student_id: values[headers.indexOf("student_id")],
        course_id: values[headers.indexOf("course_id")],
        class_id: values[headers.indexOf("class_id")],
        enrolled_year: values[headers.indexOf("enrolled_year")],
      };
    });
  };

  const columns = [
    { field: "student_id", headerName: "Student ID", flex: 1 },
    { field: "course_id", headerName: "Course ID", flex: 1 },
    { field: "class_id", headerName: "Class ID", flex: 1 },
    { field: "enrolled_year", headerName: "Year", flex: 1 },
    {
      field: "department_id",
      headerName: "Department",
      flex: 1,
      renderCell: (params) => <span>{params.row.department_id}</span>,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Enrollment Manager
      </Typography>
      <TextField
        label="Search Enrollments"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{
          maxWidth: "400px", // Limit the width of the search bar
          width: "100%", // Make it responsive
          marginBottom: 3
        }}
      />
      <DataGrid
        rows={filteredEnrollments}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        
        disableSelectionOnClick
        getRowId={(row) => row.id}
        sx={{
          height:500,
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
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload CSV File with Enrollments:
        </Typography>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload CSV
          <HiddenInput type="file" accept=".csv" onChange={handleFileChange} />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCsvUpload}
          sx={{ marginLeft: 2 }}
        >
          Submit Upload
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleUndo}
          sx={{ marginLeft: 2 }}
        >
          Undo Last Operation
        </Button>
      </Box>
    </Box>
  );
};
