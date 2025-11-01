"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Button,
  Divider,
} from "@mui/material";

interface ClassData {
  _id: string;
  name: string;
  code: string;
  schedule?: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string;
  };
  timing?: string;
  status?: "On Time" | "Cancelled" | "Rescheduled";
  location?: {
    latitude: number;
    longitude: number;
  };
  allowedRadius?: number;
}

interface ApiResponse {
  success: boolean;
  data: ClassData[];
  error?: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

// Utility: time format
const formatTime = (time: string): string => {
  if (!time) return "TBA";
  try {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes || "00"} ${ampm}`;
  } catch {
    return "TBA";
  }
};

// Utility: schedule format
const formatSchedule = (classItem: ClassData): string => {
  if (classItem.timing) return classItem.timing;
  if (classItem.schedule && classItem.schedule.dayOfWeek) {
    const day = classItem.schedule.dayOfWeek.substring(0, 3);
    return `${day} ${formatTime(classItem.schedule.startTime)} - ${formatTime(
      classItem.schedule.endTime
    )}`;
  }
  return "Schedule not available";
};

export default function Home() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });
  const router = useRouter();

  // Fetch from API
  const fetchClassesFromAPI = async (): Promise<ClassData[]> => {
    try {
      const res = await fetch("/api/classes");
      const result: ApiResponse = await res.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchClassesFromAPI();
        setClasses(data);
        if (data.length === 0) {
          setSnackbar({
            open: true,
            message: "No classes found.",
            severity: "info",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to load classes. Please check your API.",
          severity: "error",
        });
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleClassClick = (id: string) => router.push(`/classes/${id}`);

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const getStatusChip = (status: ClassData["status"]) => {
    if (!status) return null;
    const color =
      status === "On Time"
        ? "success"
        : status === "Cancelled"
        ? "error"
        : "warning";
    return (
      <Chip label={status} color={color} sx={{ mt: 1, fontWeight: 500 }} />
    );
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          textAlign: "center",
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          BSCS Fall 2025 Classes
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          {loading
            ? "Loading..."
            : `${classes.length} class${
                classes.length !== 1 ? "es" : ""
              } found`}
        </Typography>
      </Paper>

      {/* Loading */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* Class Grid */}
          <Grid container spacing={3}>
            {classes.map((classItem) => (
              <Grid item xs={12} sm={6} md={4} key={classItem._id}>
                <Card
                  onClick={() => handleClassClick(classItem._id)}
                  elevation={4}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    },
                    background: "white",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      fontWeight={600}
                      gutterBottom
                      color="primary"
                    >
                      {classItem.name}
                    </Typography>

                    <Typography
                      sx={{ mb: 1 }}
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Code: {classItem.code}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="body2" color="text.secondary">
                      Timing: {formatSchedule(classItem)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Room: {classItem.schedule?.room || "TBA"}
                    </Typography>

                    {/* {classItem.location && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Radius: {classItem.allowedRadius || 30}m
                      </Typography>
                    )} */}

                    {getStatusChip(classItem.status)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Empty State */}
          {classes.length === 0 && (
            <Paper
              sx={{
                mt: 6,
                textAlign: "center",
                p: 5,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No Classes Available
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                It looks like there are no classes in your database.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
