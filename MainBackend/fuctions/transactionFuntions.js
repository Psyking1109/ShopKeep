
const getAllTransactionsFunc = async(req, res , bankModel,TransactionTypeModel , InvoiceModel)=> {
    const { AccountId } = req.params;
    try {
   
        const bankAccount = await bankModel.findById(AccountId);

        if (!bankAccount) {
            return res.status(404).json({ error: 'Bank account not found' });
        }
        const transactions = [];


        for (const transaction of bankAccount.transactions) {
            let transactionType;

            // Find the transaction type by its ID
            const transactionTypeObj = await TransactionTypeModel.findById(transaction.transactionsType);

            if (!transactionTypeObj) {
                transactionType = 'Unknown';
            } else {
                transactionType = transactionTypeObj.transactionAccountName;
            }
    
            const transactionObject = {
                type: transactionType,
            };
           
            if (transaction.deposit) {
                transactionObject.deposit = transaction.deposit;
            } else if (transaction.withdrawal) {
                transactionObject.withdrawal = transaction.withdrawal;
            }

            // If transaction type is 'sales', 
            if (transactionType === 'sales') {
                const invoice = await InvoiceModel.findById(transaction.reference);
                if (invoice) {
                    transactionObject.reference = invoice.invoiceNumber;
                }
            } else {
                // For other transaction types, 
                transactionObject.reference = transaction.reference;
            }

            transactions.push(transactionObject);
        }

        return res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const getBalanceFunc = async(req, res , Model)=> {
    const { accountId } = req.params;

    try {
        // Find the bank account by ID
        const Account = await Model.findById(accountId);

        if (!Account) {
            return res.status(404).json({ error: 'Bank account not found' });
        }

        // Calculate the balance
        let balance = 0;
        for (const transaction of Account.transactions) {
            if (transaction.deposit) {
                balance += transaction.deposit;
            }
            if (transaction.withdrawal) {
                balance -= transaction.withdrawal;
            }
        }

        return res.status(200).json({ balance });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = {
    getAllTransactionsFunc,
    getBalanceFunc
}