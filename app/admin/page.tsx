"use client";

import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
} from "@mui/material";
import ClassManagement from "@/components/admin/ClassManagement";
import AttendanceReports from "@/components/admin/AttendanceReports";

export default function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9fafc",
        p: 4,
      }}
    >
      <Typography variant="h4" fontWeight={600} mb={3}>
        Admin Dashboard
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, val) => setTabIndex(val)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Manage Classes" />
          <Tab label="Attendance Reports" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabIndex === 0 && <ClassManagement />}
          {tabIndex === 1 && <AttendanceReports />}
        </Box>
      </Paper>
    </Box>
  );
}
