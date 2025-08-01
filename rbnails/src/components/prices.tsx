import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardText,
  CardTitle,
} from "reactstrap";

export default function Prices() {
  return (
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
          Manicure
        </CardHeader>
        <CardBody
          style={{
            color: "var(--custom-pink-2)",
            fontFamily: "Noto Sans",
          }}
        >
          <CardTitle>Esmaltação simples</CardTitle>
          <CardText>R$90</CardText>
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
          Spa dos Pés
        </CardHeader>
        <CardBody
          style={{
            color: "var(--custom-pink-2)",
            fontFamily: "Noto Sans",
          }}
        >
          <CardTitle>Pedicure</CardTitle>
          <CardText>R$80</CardText>
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
          Esmaltação em Gel
        </CardHeader>
        <CardBody
          style={{
            color: "var(--custom-pink-2)",
            fontFamily: "Noto Sans",
          }}
        >
          <CardTitle>Esmaltação em gel</CardTitle>
          <CardText>R$100</CardText>
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
          Combo Gel + Pés
        </CardHeader>
        <CardBody
          style={{
            color: "var(--custom-pink-2)",
            fontFamily: "Noto Sans",
          }}
        >
          <CardTitle> Esmaltação em gel + pedicure tradicional</CardTitle>
          <CardText>R$145</CardText>
        </CardBody>
      </Card>
    </CardGroup>
  );
}
