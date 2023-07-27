import React, { useState, useEffect, Key } from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

export interface PieChartAnimationProps {
  isHovered: boolean;
}

const PieChartContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background-color: #ffb347;
`;

const Slice = styled.div<{
  color: string;
  start: number;
  finalEnd: number;
  isHovered: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
  background: ${({ color }) => color};
  transform: rotate(${({ start }) => start}turn);
  ${({ isHovered, start, finalEnd }) =>
    isHovered &&
    css`
      animation: ${keyframes`
        0% {
          transform: rotate(${start}turn);
        }
        100% {
          transform: rotate(${finalEnd}turn);
        }
      `} 1s linear forwards;
    `}
`;

const slices = [
  { color: "#ff7f50", start: 0.1, finalEnd: 1 },
  { color: "#ffb347", start: 0.3, finalEnd: 0.6 },
  { color: "#ffd700", start: 0.6, finalEnd: 0.3 },
  { color: "#ffff66", start: 0.9, finalEnd: 0.1 },
];

const PieChartAnimation: React.FC<PieChartAnimationProps> = ({ isHovered }) => {
  const [key, setKey] = useState<Key>(Math.random());

  useEffect(() => {
    if (isHovered) {
      setKey(Math.random());
    }
  }, [isHovered]);

  return (
    <PieChartContainer key={key}>
      {slices.map(({ color, start, finalEnd }, index) => (
        <Slice
          key={index}
          color={color}
          start={start}
          finalEnd={finalEnd}
          isHovered={isHovered}
        />
      ))}
    </PieChartContainer>
  );
};

export default PieChartAnimation;
