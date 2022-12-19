import {
  TransactionBaseService,
  UserService,
  CustomerService,
  Customer,
} from "@medusajs/medusa";
import { CustomerRepository } from "@medusajs/medusa/dist/repositories/customer";
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
  customerRepository: typeof CustomerRepository;
};

class CroCoderAuthService extends TransactionBaseService {
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager | undefined;
  protected readonly customerRepository_: typeof CustomerRepository;

  constructor({ manager, customerRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.manager_ = manager;
    this.customerRepository_ = customerRepository;
  }

  async authenticateCustomer(email: string): Promise<AuthenticateResult> {
    console.log("email", email);

    const customerRepo = this.manager_.getCustomRepository(
      this.customerRepository_,
    );

    const [customer] = await customerRepo.find({ email });

    if (customer) {
      return {
        success: true,
        customer,
      };
    }

    return {
      success: false,
      error: "Invalid email",
    };
  }
}

export default CroCoderAuthService;
