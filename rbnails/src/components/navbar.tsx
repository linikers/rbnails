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
        <NavbarBrand href="/">Agende-já</NavbarBrand>
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
          </Nav>
        </Collapse>
      </Navbar>
    </nav>
  );
}
