import Image from "next/image";
import Head from "next/head";
import { Inter } from "next/font/google";
import nailart from "../../public/weicon1.png";
import manicure from "../../public/weicon2.png";
import pedicure from "../../public/weicon3.png";
import nailgel from "../../public/weicon4.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Button,
  CardGroup,
  Card,
  CardImg,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  CardHeader,
} from "reactstrap";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavBar = () => setCollapsed(!collapsed);

  return (
    <Container>
      <header className="custom-header">
        <figure className="logo">
          <p className="">Rafa Bach </p>
          <span className="">Nail</span>
        </figure>

        <nav>
          <Navbar className="custom-bar" light>
            <NavbarBrand href="/" className="">
              Design
            </NavbarBrand>
            <NavbarToggler onClick={toggleNavBar} className="me-2" />
            <Collapse isOpen={!collapsed} navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink href="/sobre">Sobre</NavLink>
                </NavItem>

                <NavItem>
                  <NavLink href="/precos">Preços</NavLink>
                </NavItem>

                <NavItem>
                  <NavLink href="/contato">Contato</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </nav>
      </header>
      <main>
        <CardGroup className="box-work">
          <Card className="mx-auto custom-card" body>
            <div className="text-center">
              <Image src={nailart} alt="Nail Art" />
            </div>
            <CardBody className="text-center">
              <CardTitle tag="h5">Nail Art</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Unhas Decoradas
              </CardSubtitle>
              {/* <CardText>lindas decorações em suas unhas</CardText> */}
            </CardBody>
          </Card>

          <Card className="mx-auto custom-card" body>
            <div className="text-center">
              <Image src={manicure} alt="manicure" />
            </div>
            <CardBody className="text-center">
              <CardTitle tag="h5">Manicure</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Unhas Decoradas
              </CardSubtitle>
              {/* <CardText>lindas decorações em suas unhas</CardText> */}
            </CardBody>
          </Card>

          <Card className="mx-auto custom-card" body>
            <div className="text-center">
              <Image src={pedicure} alt="pedicure" />
            </div>
            <CardBody className="text-center">
              <CardTitle tag="h5">Nail Art</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Unhas Decoradas
              </CardSubtitle>
              {/* <CardText>lindas decorações em suas unhas</CardText> */}
            </CardBody>
          </Card>

          <Card className="mx-auto custom-card" body>
            <div className="text-center">
              <Image src={nailgel} alt="Unhas em gel" />
            </div>
            <CardBody className="text-center">
              <CardTitle tag="h5">Nail Art</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Unhas Decoradas
              </CardSubtitle>
              {/* <CardText>lindas decorações em suas unhas</CardText> */}
            </CardBody>
          </Card>
        </CardGroup>

        <section className=" text-center">
          <h2 className="prices">Preços</h2>
          <CardGroup>
            <Card
              className="my-2"
              color="danger"
              outline
              style={{ width: "18rem" }}
            >
              <CardHeader>R$40</CardHeader>
              <CardBody>
                <CardTitle>Manicure</CardTitle>
                <CardText>esmaltação simples</CardText>
              </CardBody>
            </Card>

            <Card
              className="my-2"
              color="secondary"
              outline
              style={{ width: "18rem" }}
            >
              <CardHeader>R$60</CardHeader>
              <CardBody>
                <CardTitle>Pedicure</CardTitle>
                <CardText>esmaltação simples</CardText>
              </CardBody>
            </Card>

            <Card
              className="my-2"
              color="secondary"
              outline
              style={{ width: "18rem" }}
            >
              <CardHeader>R$70</CardHeader>
              <CardBody>
                <CardTitle>Unhas em Gel</CardTitle>
                <CardText>Esmaltação em gel </CardText>
              </CardBody>
            </Card>
          </CardGroup>
        </section>
      </main>

      <footer className="box-footer">
        <section className="box-contact">
          <div>
            <i className="fa-brands fa-whatsapp fa-2xl"></i>
            <a
              className="link"
              href="https://wa.me/554497280806?text=Quero%20marcar%20em%20um%20horario"
              target="_blank"
            >
              (44) 9728-0806
            </a>
          </div>
          <div>
            <i className="fa-brands fa-instagram fa-2xl"></i>
            <a
              className="link"
              href="https://www.instagram.com/rafabach_unhas/"
              target="_blank"
            >
              @rafabach_unhas
            </a>
          </div>
        </section>
        <iframe
          className="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.2459168437204!2d-51.91916232531438!3d-23.415482178900287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ecd0dde246975b%3A0x152e8c2f67730937!2sRua%20Trinidad%2C%2067%20-%20Vila%20Morangueira%2C%20Maring%C3%A1%20-%20PR%2C%2087040-020!5e0!3m2!1spt-BR!2sbr!4v1682360269414!5m2!1spt-BR!2sbr"
          width="600"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </footer>
    </Container>
  );
}
