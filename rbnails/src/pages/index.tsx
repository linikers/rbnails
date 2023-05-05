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
              Agende já
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
        <CardGroup className="box-work" style={{ margin: "1rem" }}>
          <Card
            className="mx-auto custom-card"
            style={{
              margin: "0.4rem",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 0.4rem 1.5rem rgba(0, 0, 0, 0.2)",
            }}
            body
          >
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

          <Card
            className="mx-auto custom-card"
            style={{
              margin: "0.4rem",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 0.4rem 1.5rem rgba(0, 0, 0, 0.2)",
            }}
            body
          >
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

          <Card
            className="mx-auto custom-card"
            style={{
              margin: "0.4rem",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 0.4rem 1.5rem rgba(0, 0, 0, 0.2)",
            }}
            body
          >
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

          <Card
            className="mx-auto custom-card"
            style={{
              margin: "0.4rem",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 0.4rem 1.5rem rgba(0, 0, 0, 0.2)",
            }}
            body
          >
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
          <i className="fa-solid fa-square-dollar"></i>
          <h2 className="prices">Valores</h2>
          <CardGroup>
            <Card
              className="my-2"
              outline
              style={{
                width: "18rem",
                backgroundColor: "var(--custom-pink-0)",
                borderRadius: "8px",
                margin: "0.2rem",
                border: "none",
                boxShadow: "0 0.4rem 1.5rem rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardHeader
                style={{
                  color: "var(--custom-gold)",
                  border: "0.2rem solid var(--custom-pink-1)",
                  borderRadius: "8px",
                  fontFamily: "Noto Sans",
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  textShadow: "0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.25)",
                }}
              >
                R$40
              </CardHeader>
              <CardBody
                style={{
                  color: "var(--custom-pink-2)",
                  fontFamily: "Noto Sans",
                }}
              >
                <CardTitle>Manicure</CardTitle>
                <CardText>Esmaltação simples</CardText>
              </CardBody>
            </Card>

            <Card
              className="my-2"
              outline
              style={{
                width: "18rem",
                backgroundColor: "var(--custom-pink-0)",
                borderRadius: "8px",
                margin: "0.2rem",
                border: "none",
                boxShadow: "0 0.4rem 1.5rem rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardHeader
                style={{
                  color: "var(--custom-gold)",
                  border: "0.2rem solid var(--custom-pink-1)",
                  borderRadius: "8px",
                  fontFamily: "Noto Sans",
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  textShadow: "0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.25)",
                }}
              >
                R$60
              </CardHeader>
              <CardBody
                style={{
                  color: "var(--custom-pink-2)",
                  fontFamily: "Noto Sans",
                }}
              >
                <CardTitle>Pedicure</CardTitle>
                <CardText>esmaltação simples</CardText>
              </CardBody>
            </Card>

            <Card
              className="my-2"
              outline
              style={{
                width: "18rem",
                backgroundColor: "var(--custom-pink-0)",
                borderRadius: "8px",
                margin: "0.2rem",
                border: "none",
                boxShadow: "0 0.4rem 1.5rem rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardHeader
                style={{
                  color: "var(--custom-gold)",
                  border: "0.2rem solid var(--custom-pink-1)",
                  borderRadius: "8px",
                  fontFamily: "Noto Sans",
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  textShadow: "0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.25)",
                }}
              >
                R$70
              </CardHeader>
              <CardBody
                style={{
                  color: "var(--custom-pink-2)",
                  fontFamily: "Noto Sans",
                }}
              >
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
            <i className="fa-regular fa-location-dot fa-2xs"></i>
            <a
              className="link"
              href="https://www.google.com/maps/place/Rua+Trinidad,+67+-+Vila+Morangueira,+Maring%C3%A1+-+PR,+87040-020/@-23.4154822,-51.9191623,17z/data=!3m1!4b1!4m6!3m5!1s0x94ecd0dde246975b:0x152e8c2f67730937!8m2!3d-23.4154822!4d-51.9165874!16s%2Fg%2F11c2dg4q03"
            >
              Rua Trinidad, 67
            </a>
          </div>
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
        <div>
          <h3>Sobre Nós</h3>
          <p>
            Bem-vindo ao nosso oásis de beleza, onde a arte da manicure é
            elevada a um novo nível. Nossas manicures são verdadeiras mestres da
            técnica, combinando habilidade e criatividade para criar verdadeiras
            obras de arte em suas unhas.
          </p>
        </div>
      </footer>
    </Container>
  );
}
