import { Router } from "express";
import "@medusajs/medusa/dist/types/global";
import admin from "@medusajs/medusa/dist/api/middlewares/authenticate";
import { EntityManager } from "typeorm";
import jwt from "jsonwebtoken";
import { CustomerService } from "@medusajs/medusa";
import bodyParser from "body-parser";
import cors from "cors";
import { projectConfig } from "../../medusa-config";

const corsOptions = {
  origin: projectConfig.admin_cors.split(","),
  credentials: true,
};

export default () => {
  const router = Router();

  const jsonParser = bodyParser.json();

  router.options("/admin/email-auth", cors(corsOptions));
  router.post("/admin/email-auth", jsonParser, admin(), async (req, res) => {
    console.log((req as any).session);
    const { email } = req.body;
    const customerService: CustomerService =
      req.scope.resolve("customerService");
    const manager: EntityManager = req.scope.resolve("manager");

    let result;

    try {
      result = await manager.transaction(async (transactionManager) => {
        return await customerService
          .withTransaction(transactionManager)
          .retrieveByEmail(email);
      });
    } catch {
      res.sendStatus(401);
      return;
    }

    const {
      projectConfig: { jwt_secret },
    } = req.scope.resolve("configModule");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).session.jwt = jwt.sign(
      { customer_id: result.id },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      jwt_secret!,
      {
        expiresIn: "30d",
      },
    );
    const customer = await customerService.retrieve(result.id || "", {
      relations: ["orders", "orders.items"],
    });

    res.json({ customer });
  });

  return router;
};
