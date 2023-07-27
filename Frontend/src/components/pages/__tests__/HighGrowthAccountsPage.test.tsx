import { render, waitFor, screen } from "@testing-library/react";
import { ApexOptions } from "apexcharts";
import HighGrowthAccountsPage from "../HighGrowthAccountsPage";
import { ISolBalance, getSolBalanceTop10 } from "../../../services/api";

// Need to mock this as Jest doesn't understand VITE's import.meta.env
// Ideally move this into a jest initializer file so it doesn't need to be included in each test.
jest.mock("../../../services/config", () => ({
  config: {
    baseURL: "http://localhost:3000",
  },
}));

// Stop mocked error showing in test results
console.error = jest.fn();

jest.mock("../../../services/api");

jest.mock("react-apexcharts", () => ({
  __esModule: true,
  default: ({
    options,
    series,
  }: {
    options: ApexOptions;
    series: { name: string; data: number[] }[];
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

const mockData: ISolBalance[] = [
  { address: "address1", solBalance: 10000000 },
  { address: "address2", solBalance: 20000000 },
];

afterEach(() => {
  jest.clearAllMocks();
});

test("renders loading state initially", () => {
  render(<HighGrowthAccountsPage />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("passes the correct wallet data after successful API call", async () => {
  (getSolBalanceTop10 as jest.Mock).mockResolvedValueOnce({ data: mockData });

  render(<HighGrowthAccountsPage />);

  await waitFor(() => screen.getByTestId("chart"));

  const chart = screen.getByTestId("chart");

  if (chart.dataset.options) {
    const options: ApexOptions = JSON.parse(chart.dataset.options);

    if (options.xaxis && options.xaxis.categories) {
      expect(options.xaxis.categories.length).toBe(mockData.length);
    } else {
      fail("X-Axis or Categories in options are not defined");
    }
  } else {
    fail("Options dataset is not defined");
  }
});

test("handles API call failure", async () => {
  (getSolBalanceTop10 as jest.Mock).mockRejectedValueOnce(
    new Error("API Error")
  );

  render(<HighGrowthAccountsPage />);

  await waitFor(() => expect(console.error).toHaveBeenCalled());

  // Still showing loading because data fetch failed
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
