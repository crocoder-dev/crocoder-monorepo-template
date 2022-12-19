import { Router } from "express";
import "@medusajs/medusa/dist/types/global";
import authenticate from "@medusajs/medusa/dist/api/middlewares/authenticate";
import { EntityManager } from "typeorm";
import jwt from "jsonwebtoken";
import { CustomerService } from "@medusajs/medusa";
import bodyParser from "body-parser";
export default () => {
  const router = Router();

  const jsonParser = bodyParser.json();

  router.post(
    "/admin/email-auth",
    jsonParser,
    authenticate(),
    async (req, res) => {
      console.log("body", req.body);
      const { email } = req.body;
      const crocoderAuthService = req.scope.resolve("crocoderAuthService");
      const manager: EntityManager = req.scope.resolve("manager");

      const result = await manager.transaction(async (transactionManager) => {
        return await crocoderAuthService
          .withTransaction(transactionManager)
          .authenticateCustomer(email);
      });

      console.log("result", result);

      if (!result.success) {
        res.sendStatus(401);
        return;
      }

      const {
        projectConfig: { jwt_secret },
      } = req.scope.resolve("configModule");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).session.jwt_store = jwt.sign(
        { customer_id: result.customer?.id },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        jwt_secret!,
        {
          expiresIn: "30d",
        },
      );
      const customerService: CustomerService =
        req.scope.resolve("customerService");
      const customer = await customerService.retrieve(
        result.customer?.id || "",
        {
          relations: ["orders", "orders.items"],
        },
      );

      res.json({ customer });
    },
  );

  router.get("/admin/hello-product", authenticate(), async (req, res) => {
    const productService = req.scope.resolve("productService");
    console.log(req.user?.userId);
    const [product] = await productService.list({}, { take: 1 });

    res.json({
      message: `Welcome to ${product.title}!`,
    });
  });

  return router;
};
