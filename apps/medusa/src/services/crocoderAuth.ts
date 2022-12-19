import {
  TransactionBaseService,
  UserService,
  CustomerService,
  Customer,
} from "@medusajs/medusa";
import { EntityManager } from "typeorm";

export type AuthenticateResult = {
  success: boolean;
  customer?: Customer;
  error?: string;
};

type InjectedDependencies = {
  manager: EntityManager;
  userService: UserService;
  customerService: CustomerService;
};

class CroCoderAuthService extends TransactionBaseService {
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager | undefined;
  protected readonly userService_: UserService;
  protected readonly customerService_: CustomerService;

  constructor({ manager, userService, customerService }: InjectedDependencies) {
    super(arguments[0]);

    this.manager_ = manager;
    this.userService_ = userService;
    this.customerService_ = customerService;
  }

  async authenticateCustomer(email: string): Promise<AuthenticateResult> {
    return await this.atomicPhase_(async (transactionManager) => {
      try {
        const customer: Customer = await this.customerService_
          .withTransaction(transactionManager)
          .retrieveRegisteredByEmail(email);

        return {
          success: true,
          customer,
        };
      } catch (error) {
        // ignore
      }

      return {
        success: false,
        error: "Invalid email or password",
      };
    });
  }
}

export default CroCoderAuthService;
