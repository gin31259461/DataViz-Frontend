import { useSplitLineStyle } from '@/hooks/useStyles';
import { tokens } from '@/utils/theme';
import { styled, useTheme } from '@mui/material';
import Link from 'next/link';

interface MenuProps {
  className: string;
  items: string[];
  itemLinks: string[];
  onClose: () => void;
}

export default function Menu({ className, onClose, items, itemLinks }: MenuProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MyMenu
      className={className}
      style={{
        backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : '#fcfcfc',
        borderBottom: `${useSplitLineStyle()}`,
      }}
      onClick={onClose}
    >
      <MenuItem>
        <ul>
          {items.map((item, i) => {
            return <LIItem key={i} title={item} href={itemLinks[i]}></LIItem>;
          })}
        </ul>
      </MenuItem>
    </MyMenu>
  );
}

interface LIItemProps {
  title: string;
  href?: string;
}

const LIItem: React.FC<LIItemProps> = ({ title, href }) => {
  return (
    <li>
      <Link
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
        href={href ?? '/'}
      >
        <h4>{title}</h4>
      </Link>
    </li>
  );
};

const MyMenu = styled('div')({
  position: 'absolute',
  width: '100%',
  opacity: 0,
  zIndex: 5,
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
  transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
});

const MenuItem = styled('div')({
  display: 'block',
  margin: 0,
  listStyleType: 'none',
  paddingTop: '10px',

  ul: {
    padding: 0,
  },

  'li a': {
    height: '50px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  '& li:hover': {
    opacity: 0.5,
  },
});
