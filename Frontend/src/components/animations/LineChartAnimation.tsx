import React from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

interface LineProps {
  isHovered: boolean;
}

const circleAnimation = keyframes`
  0% { left: calc(0% - 20px); }
  100% { left: calc(100% - 20px); }
`;

const LineChartContainer = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
`;

const Line = styled.div<LineProps>`
  position: relative;
  width: 200px;
  height: 10px;
  /* background: linear-gradient(270deg, #ff7f50, #ffb347, #ffd700, #ffff66); */
  background: #ff7f50;
  border-radius: 5px;
  ::before {
    content: "";
    position: absolute;
    top: -15px;
    left: calc(50% - 20px);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(270deg, #ff7f50, #ffb347, #ffd700, #ffff66);
  }

  ${({ isHovered }) =>
    isHovered &&
    css`
      ::before {
        animation: ${circleAnimation} 1s linear infinite;
      }
    `}
`;

interface LineChartAnimationProps {
  isHovered: boolean;
}

const LineChartAnimation: React.FC<LineChartAnimationProps> = ({
  isHovered,
}) => {
  return (
    <LineChartContainer>
      <Line isHovered={isHovered} />
    </LineChartContainer>
  );
};

export default LineChartAnimation;
