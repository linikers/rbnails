import Image from "next/image";
import { Inter } from "next/font/google";
import transition from "../../public/slin.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "reactstrap";
import NavBar from "@/components/navbar";
import Services from "@/components/services";
import Prices from "@/components/prices";
import Logo from "@/components/logo";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Container>
      <header className="custom-header">
        <Logo />

        <NavBar />
      </header>
      <main>
        <Services />

        <section className=" text-center">
          <div style={{ margin: "0.4rem" }}>
            <Image
              src={transition}
              alt="esmalte"
              layout="responsive"
              width={1920}
              height={1080}
            />
          </div>
          <h2 className="prices">Valores</h2>

          <Prices />
        </section>
        <div style={{ margin: "0.4rem" }}>
          <Image
            src={transition}
            alt="esmalte"
            layout="responsive"
            width={1920}
            height={1080}
          />
        </div>
      </main>

      <Footer />
    </Container>
  );
}
