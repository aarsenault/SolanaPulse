import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getMarketCapTokens } from "../../services/api";
import { ApexOptions } from "apexcharts";

interface MarketCapData {
  address: string;
  marketCap: number;
  name: string;
  symbol: string;
}

interface FormatterOpts {
  seriesIndex: number;
}

const MarketCapPage: React.FC = () => {
  const [data, setData] = useState<MarketCapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMarketCapTokens();
        const sortedData = response.data.sort(
          (a: MarketCapData, b: MarketCapData) => b.marketCap - a.marketCap
        );
        // Take the top 15 to not crowd the pie chart
        const top15Data = sortedData.slice(0, 15);
        // Take the rest, and group them together as a single slice
        const restData = sortedData.slice(15);

        // Compute the market cap of the rest
        let restMarketCap = 0;
        restData.forEach((item: MarketCapData) => {
          restMarketCap += item.marketCap;
        });

        // Add the "All other" category
        top15Data.push({
          address: "All other",
          marketCap: restMarketCap,
          name: "All other",
          symbol: "ALL",
        });

        setData(top15Data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Market Cap of Top Tokens",
      align: "center",
    },
    // Show both symbol and address in the labels
    labels: data.map((item) => `${item.symbol} (${item.address})`),
    series: data.map((item) => item.marketCap),
    tooltip: {
      y: {
        formatter: (value: number, { seriesIndex }: FormatterOpts) => {
          // Show the symbol in the tooltip
          return `${data[seriesIndex].symbol}: $${value.toFixed(2)}`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={options.series}
        type="pie"
        width="100%"
      />
    </div>
  );
};

export default MarketCapPage;
