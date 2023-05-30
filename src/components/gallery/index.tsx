import { Grid, useTheme } from "@mui/material";
import GalleryCard from "./GalleryCard";
import imgPath from "./imgPath.json";

export default function Gallery() {
  const theme = useTheme();
  return (
    <Grid container spacing={2} mt={2}>
      {imgPath.map((o, i) => {
        return (
          <Grid key={i} item xs={12} sm={6} md={4}>
            <GalleryCard
              key={i}
              title={o.title}
              src={theme.palette.mode === "light" ? o.light_src : o.dark_src}
              href={o.href}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
