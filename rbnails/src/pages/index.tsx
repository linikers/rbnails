import Image from "next/image";
import Head from "next/head";
import { Inter } from "next/font/google";

import transition from "../../public/slin.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  CardGroup,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
} from "reactstrap";
import { useState } from "react";
import NavBar from "@/components/navbar";
import Services from "@/components/services";
import Prices from "@/components/prices";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavBar = () => setCollapsed(!collapsed);

  return (
    <>
      <Container>
        <header className="custom-header">
          <figure className="logo">
            <p className="">Rafa Bach </p>
            <span className="">Nail</span>
          </figure>

          <NavBar />
        </header>
        <main>
          <Services />

          <section className=" text-center">
            <div style={{ margin: "0.4rem" }}>
              <Image
                src={transition}
                alt="valores"
                layout="responsive"
                width={1920}
                height={1080}
              />
            </div>
            <h2 className="prices">Valores</h2>

            <Prices />
          </section>
          <Image
            src={transition}
            alt="valores"
            layout="responsive"
            width={1920}
            height={1080}
          />
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
          <div className="embed-responsive embed-responsive-16by9 embed-responsive-sm">
            <iframe
              className="map embed-responsive-item"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.2459168437204!2d-51.91916232531438!3d-23.415482178900287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ecd0dde246975b%3A0x152e8c2f67730937!2sRua%20Trinidad%2C%2067%20-%20Vila%20Morangueira%2C%20Maring%C3%A1%20-%20PR%2C%2087040-020!5e0!3m2!1spt-BR!2sbr!4v1682360269414!5m2!1spt-BR!2sbr"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
          <div>
            <h3>Sobre Nós</h3>
            <p>
              Bem-vindo ao nosso oásis de beleza, onde a arte da manicure é
              elevada a um novo nível. Nossas manicures são verdadeiras mestres
              da técnica, combinando habilidade e criatividade para criar
              verdadeiras obras de arte em suas unhas.
            </p>
          </div>
        </footer>
      </Container>
    </>
  );
}
