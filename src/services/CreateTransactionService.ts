import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const validTypes = ['income', 'outcome'];
    const { total } = this.transactionsRepository.getBalance();

    if(type && !validTypes.includes(type))
      throw new Error('This type is not contains a valid value! Allowed income or outcome.');

    if(!type)
      throw new Error('The type for this transaction is required! Allowed income or outcome.');

    if(!title)
      throw new Error('The title for this transaction is required!');

    if(!value)
      throw new Error('The value for this transaction is required!');

    if(type === 'outcome' && total < value)
      throw new Error("You do not have enough balance!");

    const transaction = this.transactionsRepository.create({ title, value, type });
    return transaction;
  }
}

export default CreateTransactionService;
