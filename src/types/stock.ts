export type StockInput = {
  symbol: string
  purchasePrice: number
  quantity: number
  sector: string
  name?: string
  exchange?: string
}

export type ComputedStock = StockInput & {
  cmp: number
  peRatio: number | null
  earnings: number | null

  investment: number
  presentValue: number
  gainLoss: number
  returnPercent: number
  portfolioPercent: number
}

export type SectorData = {
  sector: string
  stocks: ComputedStock[]

  totalInvestment: number
  totalValue: number
  sectorGain: number
  sectorReturn: number
}
