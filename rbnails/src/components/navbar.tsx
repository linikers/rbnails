import { CalendarMonth, ContactPage, EventAvailable, Face2Sharp, Home, HomeFilled, HomeMini, HomeMiniOutlined, HomeWork, Info, Login, PriceChange, Timelapse, TimeToLeave, WorkHistory } from "@mui/icons-material";
import { useState } from "react";

import {
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarToggler,
} from "reactstrap";
// import { FaCalendarAlt, FaUsers, FaHome, FaConciergeBell, FaClock, FaSignInAlt } from "react-icons/fa";

export default function NavBar() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavBar = () => setCollapsed(!collapsed);

  return (
    // <nav>
      <Navbar className="custom-bar" light expand="md">
        <NavbarBrand
          href="https://wa.me/554497280806?text=Quero%20marcar%20em%20um%20horario"
          target="_blank"
          className="fw-bold d-flex align-items-center gap-2 brand-link"
        >
          <EventAvailable />
          <span>Agende-já</span>
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavBar} className="border-0" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="ms-auto align-items-center" navbar>
          <NavItem>
              <NavLink href="/" className="nav-item-link">
                <Home className="me-2" />
                Início
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/sobre" className="nav-item-link">
                <Info className="me-2" />
                Sobre
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/servicos" className="nav-item-link">
                <PriceChange className="me-2" />
                Preços
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/contato" className="nav-item-link">
                <ContactPage className="me-2" />
                Contato
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/auth/login" className="nav-item-link">
                <Login className="me-2" />
                Login
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/clientes" passHref className="nav-item-link">
                <Face2Sharp className="me-2" />
                Clientes
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/gerenciarHorarios" passHref className="nav-item-link">
                <Timelapse className="me-2" />
                Horários
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/servicos" passHref className="nav-item-link">
                <WorkHistory className="me-2" />
                Serviços
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/agenda" passHref className="nav-item-link">
                <CalendarMonth className="me-2" />
                Agenda
              </NavLink>
            </NavItem>

          </Nav>
        </Collapse>
      </Navbar>
    // </nav>
  )
}
