import axios, { AxiosResponse } from "axios";
import { config } from "./config";

export interface ISolBalance {
  address: string;
  solBalance: number;
}

export const apiClient = axios.create({
  baseURL: config.baseURL,
});

export const getMarketCapTokens = () => apiClient.get("/topMarketCapTokens");
export const getTps = () => apiClient.get("/tps");
export const getSolBalanceTop10 = (): Promise<AxiosResponse<ISolBalance[]>> =>
  apiClient.get("/solBallanceTop10");
