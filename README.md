
# Portfolio Dashboard Backend

Node.js + TypeScript API for fetching live stock details with Redis caching.

## Features

- Express API with CORS enabled
- Yahoo Finance market data via `yahoo-finance2`
- Redis cache to reduce upstream calls
- Simple single endpoint for portfolio stock lookups

## Requirements

- Node.js 18+ (recommended)
- Redis (local or hosted)

## Setup

1. Install dependencies:

	 ```bash
	 npm install
	 ```

2. Create a `.env` file in the project root:

	 ```env
	 REDIS_URL=redis://localhost:6379
	 ```

3. Start the dev server:

	 ```bash
	 npm run dev
	 ```

The server listens on `http://localhost:5000`.

## API

### POST /api/portfolio

Fetch live details for a list of stock symbols.

**Request body**

```json
{
	"stocks": [
		{ "symbol": "AAPL" },
		{ "symbol": "MSFT" }
	]
}
```

**Response**

```json
[
	{
		"symbol": "AAPL",
		"name": "Apple Inc.",
		"exchange": "NMS",
		"cmp": 215.54,
		"peRatio": 32.1,
		"earnings": "₹6.73"
	}
]
```

Notes:

- The request only requires `symbol`. Extra fields are ignored.
- Cached responses live for 60 seconds.
- On upstream validation issues, a partial response may be returned with limited fields.

## Scripts

- `npm run dev` - Start the API with tsx in watch mode

## Project Structure

```
src/
	app.ts              Express app setup
	server.ts           Server entrypoint
	cache/redis.ts      Redis client
	routes/             API routes
	services/           Market/portfolio services
	types/              Shared types
```

## Troubleshooting

- If Redis is unavailable, ensure `REDIS_URL` is set and Redis is running.
- If you see empty/partial data for a symbol, validate the ticker on Yahoo Finance.

