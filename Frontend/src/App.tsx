import { AppShell, Container, MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import globalStyles from "./styles/globalStyles";

import { useState } from "react";
import AppHeader from "./components/AppHeader";
import styled from "@emotion/styled";
import HomePage from "./components/pages/HomePage";
import TPSpage from "./components/pages/TPSPage";
import HighGrowthAccountsPage from "./components/pages/HighGrowthAccountsPage";
import MarketCapPage from "./components/pages/MarketCapPage";

const StyledAppShell = styled(AppShell)`
  & .mantine-AppShell-main {
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding-left: 1.6rem;
    padding-right: 1.6rem;
  }
`;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  width: 100%;  
  margin-top: 60px; // to account for header

  @media (max-width: 576px) {
    gap: 20px;
  }
`;

function App() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  const handleColorSchemeChange = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  return (
    <MantineProvider theme={{ colorScheme, globalStyles }}>
      <Router>
        <StyledAppShell
          padding="md"
          header={<AppHeader onColorSchemeChange={handleColorSchemeChange} />}
        >
          <StyledContainer>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/high-growth-accounts"
                element={<HighGrowthAccountsPage />}
              />
              <Route path="/tps" element={<TPSpage />} />
              <Route path="/market-cap" element={<MarketCapPage />} />
            </Routes>
          </StyledContainer>
        </StyledAppShell>
      </Router>
    </MantineProvider>
  );
}

export default App;

// todo = make it so the cards stack on small screens
// todo = make a pie chart animation
// todo = make a line graph animation
// todo = build out the pie chart
// todo = build out the
