import { fetchMarket } from "./market.service";
import { StockInput, ComputedStock } from "../types/stock";

export async function getLiveStocksDetails(stocks: StockInput[]): Promise<ComputedStock[]> {
  // Use Promise.all for parallel fetching 
  console.log("Fetching live details for stocks:", stocks);
  return Promise.all(
    stocks.map(async (stock) => {
      const result = await fetchMarket(stock.symbol);

      return result
    })
  );
}