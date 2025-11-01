"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  Link,
  useTheme,
  Paper,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const theme = useTheme();

  const handleLogin = async () => {
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/redirect",
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.mode === "light" ? "#f8f9fa" : "#121212",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 3,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Log in to continue
        </Typography>

        <Stack spacing={3} mt={3}>
          {/* Email Field */}
          <FormControl fullWidth>
            <FormLabel>Email</FormLabel>
            <TextField
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </FormControl>

          {/* Password Field */}
          <FormControl fullWidth>
            <FormLabel>Password</FormLabel>
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </FormControl>

          <Button
            onClick={handleLogin}
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 1 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Continue"}
          </Button>

          <Divider>or continue with</Divider>

          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<FcGoogle />}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              fullWidth
            >
              Google
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaGithub />}
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              fullWidth
            >
              GitHub
            </Button>
          </Stack>

          <Typography variant="body2" mt={3}>
            <Link
              component="button"
              underline="hover"
              onClick={() => router.push("/forgot-password")}
            >
              Can't log in?
            </Link>{" "}
            •{" "}
            <Link
              component="button"
              underline="hover"
              onClick={() => router.push("/signup")}
            >
              Create an account
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
