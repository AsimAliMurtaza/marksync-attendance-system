"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper, Button } from "@mui/material";
import ClassManagement from "@/components/admin/ClassManagement";
import AttendanceReports from "@/components/admin/AttendanceReports";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();

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
      <Button
        variant="contained"
        onClick={() => {
          router.push("/profile");
        }}
        color="primary"
        sx={{ mb: 2 }}
      >
        Profile
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          signOut({ callbackUrl: "/login" });
        }}
        color="primary"
        sx={{ mb: 2 }}
      >
        Logout
      </Button>

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
