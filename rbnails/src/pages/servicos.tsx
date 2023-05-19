import Logo from "@/components/logo";
import NavBar from "@/components/navbar";
import Prices from "@/components/prices";
import { Container } from "reactstrap";

export default function Services() {
  return (
    <Container>
      <header className="custom-header">
        <Logo />

        <NavBar />
      </header>

      <main>
        <h2 className="prices">Serviços disponíveis</h2>

        <Prices />
      </main>
    </Container>
  );
}
