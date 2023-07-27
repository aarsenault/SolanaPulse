import { render, waitFor, screen } from "@testing-library/react";
import MarketCapPage from "../MarketCapPage";
import { ApexOptions } from "apexcharts";
import { getMarketCapTokens } from "../../../services/api";

// Need to mock this as Jest doesn't understand VITE's import.meta.env
// Ideally move this into a jest initializer file so it doesn't need to be included in each test.
jest.mock("../../../services/config", () => ({
  config: {
    baseURL: "http://localhost:3000",
  },
}));

jest.mock("../../../services/api");

// to avoid console.error output in test run for error case
console.error = jest.fn();

// Mock out ApexCharts as we don't want to test that Library
jest.mock("react-apexcharts", () => ({
  __esModule: true,
  default: ({
    options,
    series,
  }: {
    options: ApexOptions;
    series: number[];
  }) => {
    return (
      <div
        data-testid="chart"
        data-options={JSON.stringify(options)}
        data-series={JSON.stringify(series)}
      />
    );
  },
}));

const mockData = [
  { address: "1", marketCap: 100, name: "token1", symbol: "TK1" },
  { address: "2", marketCap: 200, name: "token2", symbol: "TK2" },
];

afterEach(() => {
  jest.clearAllMocks();
});

test("renders loading state initially", () => {
  render(<MarketCapPage />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("passes the correct data to ApexChart successful API call", async () => {
  (getMarketCapTokens as jest.Mock).mockResolvedValueOnce({
    data: mockData,
  });
  render(<MarketCapPage />);

  await waitFor(() => screen.getByTestId("chart"));

  const chart = screen.getByTestId("chart");

  if (chart.dataset.options) {
    const options: ApexOptions = JSON.parse(chart.dataset.options);

    if (options.labels && options.series) {
      expect(options.labels.length).toBe(mockData.length + 1); // + 1 for 'All other' data point
      expect(options.series.length).toBe(mockData.length + 1);
    } else {
      fail("Labels or Series in options are not defined");
    }
  } else {
    fail("Options dataset is not defined");
  }
});

test("handles API call failure", async () => {
  (getMarketCapTokens as jest.Mock).mockRejectedValueOnce(
    new Error("API Error")
  );

  render(<MarketCapPage />);

  await waitFor(() => expect(console.error).toHaveBeenCalled());
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
