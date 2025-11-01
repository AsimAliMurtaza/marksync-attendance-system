"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  useTheme,
  Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: theme.palette.mode === "light" ? "#f9fafb" : "#121212",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          borderRadius: 4,
          backgroundColor:
            theme.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.08)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack alignItems="center" spacing={3}>
            <SchoolIcon
              sx={{
                fontSize: 60,
                color: theme.palette.primary.main,
              }}
            />
            <Typography variant="h4" fontWeight={700}>
              BSCS Attendance App
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              maxWidth="sm"
              sx={{ mt: 1 }}
            >
              Say goodbye to manual attendance! 📋 This app lets BSCS students
              mark their attendance easily — with time and location verification
              for fairness and accuracy.
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<CheckCircleOutlineIcon />}
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
              © {new Date().getFullYear()} BSCS Attendance System – Made by CR
              😎
            </Typography>
          </Stack>
        </motion.div>
      </Paper>
    </Container>
  );
}
