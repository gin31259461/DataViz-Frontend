import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';

interface ShowDataDialogProps {
  open: boolean;
  onClose: () => void;
  title: string | null | undefined;
  description: string | null | undefined;
  dataInfo: string | null | undefined;
  children: React.ReactNode;
}

export default function ShowDataDialog({
  open,
  onClose,
  title,
  description,
  dataInfo,
  children,
}: ShowDataDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography>{title}</Typography>
        <Typography
          sx={{
            paddingTop: 3,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {description}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ overflowX: 'auto' }}>
        <Typography>{dataInfo}</Typography>
        {children}
      </DialogContent>
      <DialogActions>
        <IconButton onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
