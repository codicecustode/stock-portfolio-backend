import { Router } from "express"
import { getLiveStocksDetails } from "../services/portfolio.service"

const router = Router()

router.post("/", async (req, res) => {
  try {

    const stocks = req.body.stocks
    

    const data = await getLiveStocksDetails(stocks)
    res.json(data)
  } catch {
    res.status(500).json({ message: "Failed to build portfolio" })
  }
})

export default router
