import YahooFinance from "yahoo-finance2";
import { redis } from "../cache/redis";

const TTL = 60;
const yahooFinance = new YahooFinance();

export async function fetchMarket(symbol: string) {
  //const fullSymbol = symbol.endsWith('.NS') ? symbol : `${symbol}.NS`; 
  const fullSymbol = symbol.endsWith('.NS') ? symbol : symbol;
  console.log(`Fetching market data for ${fullSymbol}...`);
  
  const cached = await redis.get(fullSymbol);
  if (cached) return JSON.parse(cached);

  try {
   
    const quotes = await yahooFinance.quote(fullSymbol);
    let quote;

    if (quotes && Array.isArray(quotes) && quotes.length > 0) {
      quote = quotes[0];
    } else if (quotes && typeof quotes === 'object') {
      quote = quotes; // Handle if object format
    } else {
      throw new Error('No quote data received');
    }

    console.log(`Fetched market data for ${fullSymbol}:`, quote);
    
    const result = {
      symbol: fullSymbol,
      name: quote.longName ?? quote.shortName ?? fullSymbol,
      exchange: quote.fullExchangeName ?? "NSE",
      cmp: quote.regularMarketPrice ?? 0,
      peRatio: quote.trailingPE ? Number(quote.trailingPE.toFixed(2)) : null,
      earnings: quote.epsTrailingTwelveMonths ? `₹${quote.epsTrailingTwelveMonths}` : "N/A",
    };
    
    await redis.set(fullSymbol, JSON.stringify(result), "EX", TTL);
    return result;
  } catch (error: any) {
    console.error(`Fetch failed for ${fullSymbol}:`, error);
    
    // Handle FailedYahooValidationError by extracting partial result
    if (error.name === 'FailedYahooValidationError' && error.result && Array.isArray(error.result) && error.result.length > 0) {
      const partialQuote = error.result[0];
      return {
        symbol: fullSymbol,
        name: fullSymbol, // Limited data available
        exchange: partialQuote.fullExchangeName ?? "NSE",
        cmp: 0, // Price not in partial result
        peRatio: null,
        earnings: "N/A",
      };
    }
    
    return { symbol: fullSymbol, cmp: 0, peRatio: null, earnings: "N/A" };
  }
}
