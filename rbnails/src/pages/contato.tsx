import Footer from "@/components/footer";
import Logo from "@/components/logo";
import NavBar from "@/components/navbar";
import { Container } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Contact() {
  return (
    <Container>
      <header className="custom-header">
        <Logo />

        <NavBar />
      </header>

      <main>
        <h2 className="title__orange">Fale conosco</h2>
        <Footer />
      </main>
    </Container>
  );
}
