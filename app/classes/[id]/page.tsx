"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Fade,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import {ClassData, ApiResponse, SnackbarState, AttendanceStatusResponse} from "@/types/types";

// Time formatting
const formatTime = (time: string): string => {
  if (!time) return "TBA";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes || "00"} ${ampm}`;
};

function getDeviceInfo(): string {
  const info = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    navigator.platform,
  ].join("|");
  return info;
}

const formatSchedule = (schedule: ClassData["schedule"]): string => {
  if (!schedule?.dayOfWeek) return "Schedule not available";
  const dayAbbreviation = schedule.dayOfWeek.substring(0, 3);
  const startTime = formatTime(schedule.startTime);
  const endTime = formatTime(schedule.endTime);
  return `${dayAbbreviation} ${startTime} - ${endTime}`;
};

const fetchClassDetails = async (id: string): Promise<ClassData> => {
  const response = await fetch(`/api/classes/${id}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const result: ApiResponse = await response.json();
  if (!result.success || !result.data)
    throw new Error(result.error ?? "Unknown error");
  return result.data as ClassData;
};

export default function ClassDetailPage(): JSX.Element {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [markingAttendance, setMarkingAttendance] = useState<boolean>(false);
  const [isPresent, setIsPresent] = useState<boolean | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;

  useEffect(() => {
    const loadClassData = async (): Promise<void> => {
      try {
        const data = await fetchClassDetails(classId);
        setClassData(data);
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to load class details. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (classId) void loadClassData();
  }, [classId]);

  useEffect(() => {
    const checkAttendanceStatus = async (): Promise<void> => {
      try {
        setIsPresent(null);
        const response = await fetch(
          `/api/attendance/status?classId=${classId}`
        );
        const result: AttendanceStatusResponse = await response.json();
        setIsPresent(result.success ? result.data?.isPresent ?? false : false);
      } catch (error) {
        console.error(error);
        setIsPresent(false);
        setSnackbar({
          open: true,
          message: "Failed to check attendance status.",
          severity: "error",
        });
      }
    };
    if (classId) void checkAttendanceStatus();
  }, [classId]);

  const handleBackToDashboard = (): void => {
    router.push("/classes");
  };

  const handleMarkPresent = async (): Promise<void> => {
    if (!classData) return;

    if (!navigator.geolocation) {
      setSnackbar({
        open: true,
        message: "Geolocation is not supported by this browser.",
        severity: "error",
      });
      return;
    }

    setMarkingAttendance(true);

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch("/api/attendance/mark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              class: classData._id,
              userLat: latitude,
              userLon: longitude,
              deviceInfo: getDeviceInfo(),
            }),
          });

          const result: { success: boolean; message?: string; error?: string } =
            await response.json();

          if (result.success) {
            setSnackbar({
              open: true,
              message: result.message ?? "Attendance marked successfully!",
              severity: "success",
            });
            setIsPresent(true);
          } else {
            setSnackbar({
              open: true,
              message: result.error ?? "Failed to mark attendance",
              severity: "error",
            });
          }
        } catch (error) {
          console.error(error);
          setSnackbar({
            open: true,
            message: "Error marking attendance",
            severity: "error",
          });
        } finally {
          setMarkingAttendance(false);
        }
      },
      (error: GeolocationPositionError) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Unable to get location. Check permissions.",
          severity: "error",
        });
        setMarkingAttendance(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ): void => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStatusChip = (status?: ClassData["status"]): JSX.Element | null => {
    if (!status) return null;
    let color: "success" | "error" | "warning" | "default" = "default";
    switch (status) {
      case "On Time":
        color = "success";
        break;
      case "Cancelled":
        color = "error";
        break;
      case "Rescheduled":
        color = "warning";
        break;
    }
    return <Chip label={status} color={color} sx={{ mt: 1 }} />;
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!classData)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5" color="error">
          Class not found
        </Typography>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={handleBackToDashboard}
        >
          Back
        </Button>
      </Box>
    );

  return (
  <Box
    sx={{
      flexGrow: 1,
      px: { xs: 2, sm: 4, md: 8 },
      py: { xs: 3, md: 5 },
      bgcolor: "#f5f7fa",
      minHeight: "100vh",
    }}
  >
    <Paper
      elevation={1}
      sx={{
        p: { xs: 3, sm: 4, md: 6 },
        borderRadius: 2,
        maxWidth: "1200px",   // ✅ wide but not stupid-wide
        mx: "auto",
        bgcolor: "#ffffff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          gap: 2,
        }}
      >
        <IconButton onClick={handleBackToDashboard}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {classData.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {classData.code}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Info Section */}
      <Box sx={{ display: "grid", gap: 2, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ScheduleIcon sx={{ color: "text.secondary" }} />
          <Typography color="text.secondary">
            {formatSchedule(classData.schedule)}
          </Typography>
        </Box>

        {classData.location && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon sx={{ color: "text.secondary" }} />
            <Typography color="text.secondary">
              Mark Attendance within {classData.allowedRadius ?? 30}m | Room:{" "}
              {classData.schedule.room || "TBA"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Status Section */}
      <Box sx={{ mb: 5 }}>
        {getStatusChip(classData.status)}

        <Fade in={isPresent !== null}>
          <Box sx={{ mt: 2 }}>
            {isPresent === null ? (
              <Chip
                icon={<HourglassEmptyIcon />}
                label="Checking attendance..."
                color="info"
              />
            ) : isPresent ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Attendance Marked"
                color="success"
              />
            ) : (
              <Chip
                icon={<CancelIcon />}
                label="Not Marked Yet"
                color="warning"
              />
            )}
          </Box>
        </Fade>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Action Area */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color={isPresent ? "success" : "primary"}
          size="large"
          onClick={handleMarkPresent}
          disabled={markingAttendance || !!isPresent}
          sx={{
            px: 6,
            py: 1.6,
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          {isPresent
            ? "Attendance Marked"
            : markingAttendance
            ? "Marking..."
            : "Mark Present"}
        </Button>
      </Box>
    </Paper>

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