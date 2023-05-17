import Image from "next/image";
import nailart from "../../public/weicon1.png";
import manicure from "../../public/weicon2.png";
import pedicure from "../../public/weicon3.png";
import nailgel from "../../public/weicon4.png";
import { Card, CardBody, CardGroup, CardSubtitle, CardTitle } from "reactstrap";

export default function Services() {
  return (
    <CardGroup
      className="box-work"
      style={{
        margin: "1rem",
      }}
    >
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
  );
}
