import { CalendarMonth, ContactPage, Dashboard, EventAvailable, Face2Sharp, Home, Menu as MenuIcon, RequestPage, Info, Login, PriceChange, Timelapse, TimeToLeave, WorkHistory } from "@mui/icons-material";
import { AppBar, Box, Button, Container, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState, MouseEvent } from "react";
import NextLink from 'next/link';

export default function NavBar() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavBar = () => setCollapsed(!collapsed);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);


  const navItems = [
    { text: 'Início', href: '/', icon: <Home fontSize="small" /> },
    { text: 'Sobre', href: '/sobre', icon: <Info fontSize="small" /> },
    { text: 'Preços', href: '/servicos', icon: <PriceChange fontSize="small" /> },
    { text: 'Contato', href: '/contato', icon: <ContactPage fontSize="small" /> },
    { text: 'Login', href: '/auth/login', icon: <Login fontSize="small" /> },
    { text: 'Clientes', href: '/clientes', icon: <Face2Sharp fontSize="small" /> },
    { text: 'Horários', href: '/gerenciarHorarios', icon: <Timelapse fontSize="small" /> },
    { text: 'Serviços', href: '/servicos', icon: <WorkHistory fontSize="small" /> },
    { text: 'Agenda', href: '/agenda', icon: <CalendarMonth fontSize="small" /> },
    { text: 'Dashboard', href: '/dashboard', icon: <Dashboard fontSize="small" /> },
    { text: 'Relatórios', href: '/relatorios', icon: <RequestPage fontSize="small" /> },
  ];

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavbarMenu = () => {
    setAnchorElNav(null);
  }
  return (
    <AppBar position="static" color="transparent" elevation={0} className="custom-bar">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <NextLink href='https://wa.me/554497280806?text=Quero%20marcar%20em%20um%20horario'>
            <Typography
              variant="h6"
              noWrap
              component="a"
              target="_blank"
              sx={{
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                gap: 1
              }}
            >
              <EventAvailable />
              Agende-já
            </Typography>
          </NextLink>
          {/* Menu mobile icone sanduiche */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 1 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavbarMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {navItems.map((item) => (
                <NextLink key={item.text} href={item.href} passHref>
                  <MenuItem component="a" onClick={handleCloseNavbarMenu}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Typography textAlign="center">{item.text}</Typography>
                  </MenuItem>
                </NextLink>
              ))
              }
            </Menu>
          </Box>
          {/* Menu desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
          {navItems.map((item) => (
            <NextLink key={item.text} href={item.href} passHref>
              <Button
                component="a"
                onClick={handleCloseNavbarMenu}
                startIcon={item.icon}
                sx={{ my: 2, color: 'inherit', display: 'block' }}
              >
                {item.text}
              </Button>
            </NextLink>
          ))}
          </Box>
        </Toolbar> 
      </Container>
    </AppBar>
      
    )
}
