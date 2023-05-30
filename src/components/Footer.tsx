import { useSplitLineStyle } from "@/hooks/useStyles";
import GitHub from "@mui/icons-material/GitHub";
import Twitter from "@mui/icons-material/Twitter";
import { Container, Grid, Link, Typography, useTheme } from "@mui/material";

export default function Footer() {
  const theme = useTheme();

  return (
    <footer
      style={{
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6, 0),
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ borderTop: useSplitLineStyle(), paddingTop: "2vh" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" component="p">
              WKE (Web Knowledge Extraction) Lab. WKE focuses on developing Web
              information systems (WIS) for various domain requirements. By
              integrating systems and modules about web/text mining methods
              developed in WKE, WIS can be enhanced to advanced intelligent
              information systems.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <ul>
              <li>
                <Link color="textSecondary" href="#">
                  Documentation
                </Link>
              </li>
              <li>
                <Link color="textSecondary" href="#">
                  Support
                </Link>
              </li>
              <li>
                <Link color="textSecondary" href="#">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Link
              href="https://github.com/gin31259461"
              color="inherit"
              target="_blank"
            >
              <GitHub sx={{ marginRight: theme.spacing(1) }} />
              GitHub
            </Link>
            <br />
            <Link href="https://twitter.com" color="inherit" target="_blank">
              <Twitter sx={{ marginRight: theme.spacing(1) }} />
              Twitter
            </Link>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          marginTop="2vh"
        >
          {"© "}
          {new Date().getFullYear()}
          {" WKE. All rights reserved."}
        </Typography>
      </Container>
    </footer>
  );
}
