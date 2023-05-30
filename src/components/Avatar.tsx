import { tokens } from "@/utils/theme";
import { useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: number;
}

const getInitials = (name: string) => {
  const names = name.split(" ");
  return names.reduce(
    (result, word) => result + (word[0] ? word[0].toUpperCase() : ""),
    "",
  );
};

export default function CustomAvatar({
  src,
  alt,
  initials,
  size = 30,
}: AvatarProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (src) {
    return (
      <Avatar
        src={src}
        alt={alt}
        sx={{ width: size, height: size, bgcolor: colors.greenAccent[500] }}
      />
    );
  }

  if (initials) {
    return (
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: colors.greenAccent[500],
          textAlign: "center",
        }}
      >
        {getInitials(initials)}
      </Avatar>
    );
  }

  return null;
}
