import { FC } from "react";
import { Title, Container } from "@mantine/core";

const Hero: FC = () => (
  <Container size="xl" style={{ marginTop: "-20px" }}>
    <Title order={1} style={{ marginBottom: "5px" }}>
      Illuminate Your Blockchain Journey
    </Title>
    <Title order={2} style={{ marginBottom: "10px" }}>
      Dive into Real-Time Solana Blockchain Data SolanaPulse
    </Title>
  </Container>
);

export default Hero;
