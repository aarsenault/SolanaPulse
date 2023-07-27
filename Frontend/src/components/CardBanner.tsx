import { Grid } from "@mantine/core";
import BarChartAnimation from "./animations/BarChartAnimation";
import { FC } from "react";
import PieChartAnimation from "./animations/PieChartAnimation";
import LineChartAnimation from "./animations/LineChartAnimation";
import { useNavigate } from "react-router-dom";
import InfoCard from "./InfoCard";

const CardBanner: FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <Grid gutter="md" style={{ marginTop: "20px" }}>
      <Grid.Col span={12} md={4}>
        <InfoCard
          title="High Growth Accounts"
          subTitle="Track individual wallets"
          AnimationComponent={BarChartAnimation}
          onClick={() => handleCardClick("/high-growth-accounts")}
        />
      </Grid.Col>
      <Grid.Col span={12} md={4}>
        <InfoCard
          title="Transactions Per Second"
          subTitle="View live data on TPS metrics"
          AnimationComponent={LineChartAnimation}
          onClick={() => handleCardClick("/tps")}
        />
      </Grid.Col>
      <Grid.Col span={12} md={4}>
        <InfoCard
          title="MarketCap"
          subTitle="View a breakdown of Solana's vibrant ecosystem"
          AnimationComponent={PieChartAnimation}
          onClick={() => handleCardClick("/market-cap")}
        />
      </Grid.Col>
    </Grid>
  );
};

export default CardBanner;
