import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactComponent as LogoMarkyBlack } from "../assets/icons/logo-marky-black.svg";

interface AuthAsideProps {
  title: string;
  highlight: string;
  supportText: string;
  image: React.ReactNode;
}

const AuthAside: React.FC<AuthAsideProps> = ({
  title,
  highlight,
  supportText,
  image,
}) => {
  const theme = useTheme();

  return (
    <Grid
      item
      xs={12}
      md={4}
      sx={{
        display: {
          xs: "none",
          md: "block",
          backgroundColor: theme.palette.primary.main + "1A",
        },
        paddingLeft: { md: `${theme.spacing(15)} !important` },
        paddingRight: { md: `${theme.spacing(15)} !important` },
        paddingTop: { md: `${theme.spacing(12)} !important` },
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        minHeight="100vh"
        sx={{ padding: 2 }}
      >
        <LogoMarkyBlack style={{ marginBottom: theme.spacing(6) }} />
        <Typography variant="h1" sx={{ marginBottom: theme.spacing(4) }}>
          {title}{" "}
          <span style={{ color: theme.palette.primary.main }}>
            {highlight}
          </span>
        </Typography>
        <Typography variant="body2" gutterBottom>
          {supportText}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          sx={{ marginTop: theme.spacing(24) }}
        >
          {image}
        </Box>
      </Box>
    </Grid>
  );
};

export default AuthAside;
