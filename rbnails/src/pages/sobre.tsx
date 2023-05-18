import NavBar from "@/components/navbar";
import { Container } from "reactstrap";

export default function sobre() {
  return (
    <>
      <Container>
        <NavBar />

        <div>
          <h3>Sobre Nós</h3>
          <p>
            Bem-vindo ao nosso oásis de beleza, onde a arte da manicure é
            elevada a um novo nível. Nossas manicures são verdadeiras mestres da
            técnica, combinando habilidade e criatividade para criar verdadeiras
            obras de arte em suas unhas.
          </p>
        </div>
      </Container>
    </>
  );
}
