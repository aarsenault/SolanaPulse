import React, { useState } from "react";
import { Paper, Text, Flex, useMantineTheme } from "@mantine/core";
import { BarChartAnimationProps } from "./animations/BarChartAnimation";

interface InfoCardProps {
  title: string;
  subTitle: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  AnimationComponent: React.ComponentType<BarChartAnimationProps>; // Make this more general
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subTitle,
  AnimationComponent,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const theme = useMantineTheme();

  const textColor = theme.colorScheme === "dark" ? "white" : "dark";

  return (
    <Paper
      p="md"
      shadow={isHovered ? "md" : "xs"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ minHeight: "300px", transition: "0.3s box-shadow" }}
      onClick={onClick}
    >
      <div style={{ minHeight: "80px" }}>
        <Text weight={700} size="xl">
          {title}
        </Text>
        <Text color={textColor} size="sm" style={{ marginBottom: 20 }}>
          {subTitle}
        </Text>
      </div>
      <Flex align="center" justify="center" style={{ flexGrow: 1 }}>
        <AnimationComponent isHovered={isHovered} />
      </Flex>
    </Paper>
  );
};

export default InfoCard;
