"use client";

import { useProjectStore } from "@/hooks/useProjectStore";
import { tokens } from "@/utils/theme";
import {
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  useTheme,
} from "@mui/material";
import { useState } from "react";

interface StepperComponentProps {
  steps: string[];
  components: React.ReactNode[];
}

const StepperComponent: React.FC<StepperComponentProps> = ({
  steps,
  components,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const features = useProjectStore((state) => state.features);
  const selectedPathID = useProjectStore((state) => state.selectedPathID);

  const backButtonDisabled = () => {
    if (activeStep !== 0) return false;
    return true;
  };

  const nextButtonDisabled = () => {
    if (activeStep == 0 && selectedDataOID) return false;
    if (activeStep == 1 && target && features) return false;
    if (activeStep == 2 && selectedPathID) return false;
    if (activeStep == 3) return false;
    if (activeStep == 4) return false;
    return true;
  };

  const stepStyle = {
    "& .Mui-active": {
      "& .MuiStepIcon-root": {
        color: colors.blueAccent[500],
      },
    },
    "& .Mui-completed": {
      "& .MuiStepIcon-root": {
        color: colors.greenAccent[500],
      },
    },
    "& .Mui-disabled": {
      "& .MuiStepIcon-root": {
        color: theme.palette.action.disabled,
      },
    },
  };

  return (
    <Grid
      container
      sx={{
        height: "calc(100vh - 80px)",
      }}
    >
      <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          sx={{ ...stepStyle, paddingTop: 2, width: "100%" }}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexGrow: 1,
          height: "calc(85vh - 80px)",
          padding: 2,
        }}
      >
        {components[activeStep]}
      </Grid>
      <Grid container>
        <Button
          disabled={backButtonDisabled()}
          color="info"
          sx={{ fontSize: 15, left: 20 }}
          onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : prev))}
        >
          Back
        </Button>
        <Button
          disabled={nextButtonDisabled()}
          color="info"
          sx={{ position: "absolute", fontSize: 15, right: 20 }}
          onClick={() =>
            setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
          }
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

export default StepperComponent;
