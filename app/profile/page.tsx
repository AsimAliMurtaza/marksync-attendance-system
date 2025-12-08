"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";

type ProfileData = {
  name: string;
  email: string;
  gender?: string;
  role?: string;
};

export default function ProfilePage(): JSX.Element {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<ProfileData>({
    name: "",
    email: "",
    gender: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // ---------------- Load Profile ----------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();

        if (!data.success) throw new Error(data.error);

        setProfile(data.data);
        setForm(data.data);
      } catch {
        setSnackbar({
          open: true,
          message: "Failed to load profile",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ---------------- Input Handler ----------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- Save Handler ----------------
  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true);

      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });

      setProfile(form);
    } catch (err) {
      setSnackbar({
        open: true,
        message: (err as Error).message || "Update failed",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!profile)
    return (
      <Typography textAlign="center" color="error">
        Profile not found
      </Typography>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        px: 3,
        py: 6,
      }}
    >
      <Button
        variant="outlined"
        sx={{ mb: 4 }}
        onClick={() => window.history.back()}
      >
        Back
      </Button>
      <Paper
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" mb={1}>
          Profile
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Manage your personal information
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <TextField
          fullWidth
          name="name"
          label="Full Name"
          value={form.name}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          name="email"
          label="Email"
          value={form.email}
          disabled
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          name="gender"
          label="Gender"
          value={form.gender}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          name="role"
          label="Role"
          value={form.role}
          disabled
          sx={{ mb: 4 }}
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
