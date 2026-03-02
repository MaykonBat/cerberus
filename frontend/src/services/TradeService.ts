import {Trade} from "commons";
import axios from "./BaseService";
import ConfigService from "./ConfigService";

const BACKEND_URL = `${ConfigService.BACKEND_URL}/trades`;

export async function getClosedTrades(dateFrom: Date, dateTo: Date = new Date()): Promise<Trade[]> {
  const response = await axios.get(`${BACKEND_URL}/closed/?dateFrom=${+ dateFrom}&dateTo=${+ dateTo}`);
  return response.data as Trade[];
}