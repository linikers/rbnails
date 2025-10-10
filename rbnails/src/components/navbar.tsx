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

export default function NavBar() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavBar = () => setCollapsed(!collapsed);

  return (
    <nav>
      <Navbar className="custom-bar" light>
        <NavbarBrand
          href="https://wa.me/554497280806?text=Quero%20marcar%20em%20um%20horario"
          target="_blank"
        >
          Agende-já
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavBar} className="me-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink href="/sobre">Sobre</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/servicos">Preços</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/contato">Contato</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/auth/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/clientes" passHref>Clientes</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/gerenciarHorarios" passHref>Horários</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/servicos" passHref>
                Serviços
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/agenda" passHref>
                Agenda
              </NavLink>
            </NavItem>

          </Nav>
        </Collapse>
      </Navbar>
    </nav>
  )
}
