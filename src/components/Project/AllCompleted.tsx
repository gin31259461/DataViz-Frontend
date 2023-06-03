"use client";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Typography } from "@mui/material";

const AllCompleted = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: 2,
      }}
    >
      <Typography variant="h1">All completed</Typography>
      <DoneAllIcon color="info" sx={{ fontSize: 80 }} />
    </Box>
  );
};

export default AllCompleted;
