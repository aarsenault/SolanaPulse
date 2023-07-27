import React, { useState, useEffect, Key } from "react";
import { MantineTheme } from "@mantine/core";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export interface BarChartAnimationProps {
  isHovered: boolean;
}

const ChartContainer = styled.div<{ theme?: MantineTheme }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 100px;
  width: 100px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[5]};
  border-left: 2px solid ${({ theme }) => theme.colors.gray[5]};
`;

const barAnimation = (finalHeight: string) => keyframes`
  0% {
    height: 0;
  }
  100% {
    height: ${finalHeight};
  }
`;

const Bar = styled.div<{ color: string; finalHeight: string }>`
  width: 20px;
  height: 0; // start with a height of 0
  background-color: ${({ color }) => color};
  animation: ${({ finalHeight }) => barAnimation(finalHeight)} 0.5s ease-in-out
    forwards;
`;

const BarChartAnimation: React.FC<BarChartAnimationProps> = ({ isHovered }) => {
  const [key, setKey] = useState<Key>(Math.random());

  useEffect(() => {
    if (isHovered) {
      // Force component re-render by changing key
      setKey(Math.random());
    }
  }, [isHovered]);

  return (
    <ChartContainer key={key}>
      <Bar
        color="#ff7f50"
        finalHeight="45px"
        style={{ animationDelay: "0s" }}
      />
      <Bar
        color="#ffb347"
        finalHeight="60px"
        style={{ animationDelay: "0.25s" }}
      />
      <Bar
        color="#ffd700"
        finalHeight="85px"
        style={{ animationDelay: "0.5s" }}
      />
      <Bar
        color="#ffff66"
        finalHeight="100px"
        style={{ animationDelay: "1s" }}
      />
    </ChartContainer>
  );
};

export default BarChartAnimation;
