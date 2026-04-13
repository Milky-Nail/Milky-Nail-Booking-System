import { Request, Response } from "express";
import { QuoteRequestService } from "src/services/quote.service";

const QuoteRequestHandler = {
  async getQuoteRquest(req: Request, res: Response) {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    try {
      const quoteRequset = await QuoteRequestService.getQuoteRequest({
        page,
        limit,
      });
      return res.status(200).json(quoteRequset);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "資料獲取失敗";
      return res.status(400).json({ error: errorMessage });
    }
  },
  async updateQuoteRequest(req: Request, res: Response) {
    try {
      const { id, staffReply, price } = req.body;
      const updatedData = await QuoteRequestService.updatequoteRequest(
        id,
        staffReply,
        price
      );
      return res.status(200).json(updatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "資料獲取失敗";
      return res.status(400).json({ error: errorMessage });
    }
  },
};

export { QuoteRequestHandler };
