import { Request, Response } from "express";
import { ServiceService } from "src/services/service.service";

const ServiceHandler = {
  async getServiceList(req: Request, res: Response) {
    try {
      const data = await ServiceService.getServices();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "server error", err });
    }
  },
};

export { ServiceHandler };
