import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
import { faker } from '@faker-js/faker';
import { useState, useRef, useEffect } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../utils/formatTime';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import UserContext from '../../contexts/user-context';

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  // {
  //   id: faker.datatype.uuid(),
  //   title: 'Raúl Sanches',
  //   description: 'samba raiz',
  //   avatar: '/static/mock-images/avatars/avatar_16.jpg',
  //   type: 'friend_interactive',
  //   createdAt: set(new Date(), { hours: 10, minutes: 30 }),
  //   isUnRead: true,
  // },
  // {
  //   id: faker.datatype.uuid(),
  //   title: 'Rafaella Barroso',
  //   description: 'Acostumada a conhecer novas pessoas',
  //   avatar: '/static/mock-images/avatars/avatar_2.jpg',
  //   type: 'friend_interactive',
  //   createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
  //   isUnRead: true,
  // },
  // {
  //   id: faker.datatype.uuid(),
  //   title: 'Paula Campos',
  //   description: 'Amante da natureza',
  //   avatar: '/static/mock-images/avatars/avatar_14.jpg',
  //   type: 'friend_interactivee',
  //   createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
  //   isUnRead: false,
  // },  
];

export default function NotificationsConexoes({conexoesEmAberto}) {
  const anchorRef = useRef(null);

  console.log(conexoesEmAberto);

  useEffect(() => {
    setNotifications(conexoesEmAberto); 
  }, [conexoesEmAberto]);

  const [notifications, setNotifications] = useState();

  //const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
  const totalUnRead = notifications ? notifications.length : 0;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notificações</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Você tem {totalUnRead} conexões em Aberto.
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Novas Conexões
              </ListSubheader>
            }
          >
            {notifications.slice(0, 2).map((notification) => (
              console.log('aaaaaaaaa',notification),
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>

        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}<br/>
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        *&nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  );

  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
