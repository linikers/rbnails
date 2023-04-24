import Image from "next/image";
import { Inter } from "next/font/google";
import nailart from "../../public/weicon1.png";
import manicure from "../../public/weicon2.png";
import pedicure from "../../public/weicon3.png";
import nailgel from "../../public/weicon4.png";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>
      <header>
        <figure>
          <p>RB Nails Design</p>
        </figure>
        <nav>
          <ul>
            <li>Home</li>
            <li>Sobre</li>
            <li>Preços</li>
            <li>Contato</li>
          </ul>
        </nav>
      </header>
      <main>
        <section>
          <div>
            <Image src={nailart} alt="Nail Art" />
            <h3>Nail Art</h3>
            <p>Unhas Decoradas</p>
          </div>

          <div>
            <Image src={manicure} alt="Manicure" />
            <h3>Manicure</h3>
            <p>Unhas Decoradas</p>
          </div>

          <div>
            <Image src={pedicure} alt="Pedicure" />
            <h3>Pedicure</h3>
            <p>Unhas Decoradas</p>
          </div>

          <div>
            <Image src={nailgel} alt="Unhas em gel" />
            <h3>Unhas em Gel</h3>
            <p>Unhas em Gel</p>
          </div>
        </section>
      </main>
      <section>
        <div>
          <i className="fa-brands fa-whatsapp fa-2xl"></i>
          <a href="https://wa.me/554497280806?text=Quero%20marcar%20em%20um%20horario">
            (44) 9728-0806
          </a>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.2459168437204!2d-51.91916232531438!3d-23.415482178900287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ecd0dde246975b%3A0x152e8c2f67730937!2sRua%20Trinidad%2C%2067%20-%20Vila%20Morangueira%2C%20Maring%C3%A1%20-%20PR%2C%2087040-020!5e0!3m2!1spt-BR!2sbr!4v1682360269414!5m2!1spt-BR!2sbr"
          width="600"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </section>
      <footer></footer>
    </>
  );
}
