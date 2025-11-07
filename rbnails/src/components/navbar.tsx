import { 
  Home, 
  Info, 
  Login, 
  Timelapse, 
  Dashboard, 
  Face2Sharp, 
  WorkHistory,
  ContactPage, 
  PriceChange, 
  RequestPage, 
  CalendarMonth, 
  EventAvailable, 
  Menu as MenuIcon, 
} from "@mui/icons-material";
import { 
  Box, 
  Menu, 
  AppBar, 
  Button, 
  Toolbar, 
  MenuItem, 
  Container, 
  IconButton, 
  Typography, 
  ListItemIcon, 
} from "@mui/material";
import { useState, MouseEvent } from "react";
import NextLink from 'next/link';

export default function NavBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  // Itens principais que ficarão sempre visíveis no desktop
  const primaryNavItems = [
    { text: 'Início', href: '/', icon: <Home fontSize="small" /> },
    { text: 'Sobre', href: '/sobre', icon: <Info fontSize="small" /> },
    { text: 'Preços', href: '/servicos', icon: <PriceChange fontSize="small" /> },
    { text: 'Contato', href: '/contato', icon: <ContactPage fontSize="small" /> },
    { text: 'Login', href: '/auth/login', icon: <Login fontSize="small" /> },
  ];

  // Itens secundários que irão para o menu "Mais"
  const secondaryNavItems = [
    { text: 'Clientes', href: '/clientes', icon: <Face2Sharp fontSize="small" /> },
    { text: 'Horários', href: '/gerenciarHorarios', icon: <Timelapse fontSize="small" /> },
    { text: 'Agenda', href: '/agenda', icon: <CalendarMonth fontSize="small" /> },
    { text: 'Dashboard', href: '/dashboard', icon: <Dashboard fontSize="small" /> },
    { text: 'Relatórios', href: '/relatorios', icon: <RequestPage fontSize="small" /> },
  ];

  // Todos os itens para o menu mobile
  const navItems = [...primaryNavItems, ...secondaryNavItems];

  const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  }

  const handleOpenMoreMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} className="custom-bar">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={NextLink}
            href='https://wa.me/554497280806?text=Quero%20marcar%20em%20um%20horario'
            target="_blank"
            rel="noopener noreferrer"
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
          {/* Menu Mobile (ícone sanduíche) */}
          <Box sx={{
            flexGrow: 1,
            justifyContent: 'flex-end' ,
            display: { xs: 'flex', md: 'none' },
          }}>
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
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
              PaperProps={{
                className: 'custom-bar',
                elevation: 0,
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.text}
                  component={NextLink}
                  href={item.href}
                  onClick={handleCloseNavMenu}
                  sx={{ color: 'inherit' }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <Typography textAlign="center">{item.text}</Typography>
                </MenuItem>
              ))
              }
            </Menu>
          </Box>
          {/* Menu Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
            {primaryNavItems.map((item) => (
              <Button
                key={item.text}
                component={NextLink}
                href={item.href}
                startIcon={item.icon}
                sx={{ color: 'inherit', textTransform: 'none', fontSize: '0.9rem' }}
              >
                {item.text}
              </Button>
            ))}
            {/* Botão e Menu "Mais" */}
            <Button
              onClick={handleOpenMoreMenu}
              sx={{ color: 'inherit', textTransform: 'none', fontSize: '0.9rem' }}
            >
              Mais
            </Button>
            <Menu
              anchorEl={anchorElMore}
              open={Boolean(anchorElMore)}
              onClose={handleCloseMoreMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                className: 'custom-bar',
                elevation: 0,
              }}
            >
              {secondaryNavItems.map((item) => (
                <MenuItem
                  key={item.text}
                  component={NextLink}
                  href={item.href}
                  onClick={handleCloseMoreMenu}
                  sx={{ color: 'inherit' }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <Typography textAlign="center">{item.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar> 
      </Container>
    </AppBar>
      
    )
}
