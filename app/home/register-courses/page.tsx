"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";

interface ClassItem {
  _id: string;
  name: string;
  code: string;
}

export default function RegisterCoursesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();

        if (Array.isArray(data)) {
          setClasses(data);
        } else {
          console.error("Invalid API response:", data);
          setClasses([]);
        }
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleEnroll = async () => {
    if (!selected) return;
    setLoading(true);

    const res = await fetch("/api/classes/enroll", {
      method: "POST",
      body: JSON.stringify({ classId: selected })
    });

    const data = await res.json();
    setLoading(false);

    alert(data.message || data.error);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Card elevation={4}>
        <CardContent>

          <Typography variant="h5" sx={{ mb: 3 }}>
            Register for a Course
          </Typography>

          {loadingClasses ? (
            <CircularProgress />
          ) : (
            <FormControl fullWidth>
              <InputLabel>Select a course</InputLabel>

              <Select
                value={selected}
                label="Select a course"
                onChange={(e) => setSelected(e.target.value)}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.name} ({cls.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={!selected || loading}
            onClick={handleEnroll}
          >
            {loading ? <CircularProgress size={22} /> : "Enroll"}
          </Button>

        </CardContent>
      </Card>
    </Box>
  );
}
