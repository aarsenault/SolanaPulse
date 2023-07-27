import { render, fireEvent } from "@testing-library/react";
import CardBanner from "../CardBanner";
import { MantineProvider } from "@mantine/core";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CardBanner Component", () => {
  it("navigates correctly on card click", () => {
    // TODO - abstract this away to use in all front end tests
    const { getByText } = render(
      <MantineProvider>
        <CardBanner />
      </MantineProvider>
    );

    const highGrowthCard = getByText("High Growth Accounts");
    const tpsCard = getByText("Transactions Per Second");
    const marketCapCard = getByText("MarketCap");

    fireEvent.click(highGrowthCard);
    expect(mockNavigate).toHaveBeenCalledWith("/high-growth-accounts");

    fireEvent.click(tpsCard);
    expect(mockNavigate).toHaveBeenCalledWith("/tps");

    fireEvent.click(marketCapCard);
    expect(mockNavigate).toHaveBeenCalledWith("/market-cap");
  });
});
