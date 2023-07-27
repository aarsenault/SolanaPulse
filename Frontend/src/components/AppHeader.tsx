import {
  Text,
  Header,
  ActionIcon,
  useMantineTheme,
  MantineTheme,
  TextProps,
} from "@mantine/core";
import styled from "@emotion/styled";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import SolarFlareLogo from "../assets/SolarFlareLogo";

interface HeaderProps {
  onColorSchemeChange: () => void;
}

const StyledContainer = styled.div<{ theme?: MantineTheme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 20px;
  background-color: ${({ theme }) =>
    theme.colorScheme === "dark" ? theme.colors.gray[6] : "#ff7f50"};
`;

const ThemedTitle = styled(Text)<TextProps & { theme?: MantineTheme }>`
  color: ${({ theme }) =>
    theme.colorScheme === "light" ? theme.colors.gray[9] : theme.white};
`;

const LogoAndTitle = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 6px;
`;

const ThemedIconBox = styled.div<{ theme?: MantineTheme }>`
  display: inline-flex;
  padding: 0px;
  border-radius: 5px;
  border: 2px solid
    ${({ theme }) =>
      theme.colorScheme === "light"
        ? theme.colors.gray[3]
        : theme.colors.gray[5]};
`;

const AppHeader: React.FC<HeaderProps> = ({ onColorSchemeChange }) => {
  const theme = useMantineTheme();

  return (
    <Header height="sm">
      <StyledContainer>
        <LogoAndTitle>
          <LogoContainer>
            <SolarFlareLogo
              fill={
                theme.colorScheme === "light"
                  ? theme.colors.gray[9]
                  : theme.colors.gray[0]
              }
            />
          </LogoContainer>
          <ThemedTitle weight={500} size="xl">
            SolanaPulse
          </ThemedTitle>
        </LogoAndTitle>
        <ThemedIconBox>
          <ActionIcon
            aria-label="Toggle color scheme"
            variant={theme.colorScheme === "dark" ? "light" : "dark"}
            onClick={onColorSchemeChange}
          >
            {theme.colorScheme === "dark" ? <SunIcon /> : <MoonIcon />}
          </ActionIcon>
        </ThemedIconBox>
      </StyledContainer>
    </Header>
  );
};

export default AppHeader;
