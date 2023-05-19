import Footer from "@/components/footer";
import Logo from "@/components/logo";
import NavBar from "@/components/navbar";
import { Container } from "reactstrap";

export default function Contact() {
  return (
    <Container>
      <header>
        <Logo />

        <NavBar />
      </header>

      <main>
        <Footer />
      </main>
    </Container>
  );
}
