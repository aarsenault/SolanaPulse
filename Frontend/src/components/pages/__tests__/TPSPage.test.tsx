import { render, waitFor, screen, act } from "@testing-library/react";
import { ApexOptions } from "apexcharts";

import TPSPage from "../TPSPage";
import { getTps } from "../../../services/api";
import { TPSData } from "../TPSPage";

// Need to mock this as Jest doesn't understand VITE's import.meta.env
// Ideally move this into a jest initializer file so it doesn't need to be included in each test.

// to avoid console.error output in test run for error case
console.error = jest.fn();

interface SeriesData {
  name: string;
  data: {
    y: number;
  }[];
}

jest.mock("../../../services/config", () => ({
  config: {
    baseURL: "http://localhost:3000",
  },
}));

jest.mock("../../../services/api");

jest.mock("react-apexcharts", () => ({
  __esModule: true,
  default: ({
    options,
    series,
  }: {
    options: ApexOptions;
    series: object[];
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

const mockData: TPSData = {
  tps: 10,
  trueTps: 20,
};

afterEach(() => {
  jest.clearAllMocks();
});

test("renders loading state initially", () => {
  render(<TPSPage />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("passes the correct TPS data after successful API call", async () => {
  (getTps as jest.Mock).mockResolvedValueOnce({ data: mockData });

  await act(async () => {
    render(<TPSPage />);
    // Delay to simulate fetching data
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  const chart = screen.getByTestId("chart");

  if (chart.dataset.series) {
    const series: SeriesData[] = JSON.parse(chart.dataset.series);
    expect(series.length).toBe(2);
    series.forEach((s: SeriesData) => {
      expect(s.data[0].y).toBe(
        s.name === "TPS" ? mockData.tps : mockData.trueTps
      );
    });
  } else {
    fail("Series dataset is not defined");
  }
});

test("handles API call failure", async () => {
  (getTps as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

  render(<TPSPage />);

  await waitFor(() => expect(console.error).toHaveBeenCalled());

  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
