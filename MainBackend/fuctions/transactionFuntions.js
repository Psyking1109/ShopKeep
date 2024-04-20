
const getAllTransactionsFunc = async (req, res, Model, TransactionTypeModel, InvoiceModel) => {
    const { accountId } = req.params;
    try {
        const account = await Model.findById(accountId);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        const transactions = [];

        for (const transaction of account.transactions) {
            let transactionType;
            const foundTransactionType = await TransactionTypeModel.findById(transaction.transactionsType);
            if (!foundTransactionType) {
                transactionType = 'Unknown';
            } else {
                transactionType = foundTransactionType.transactionType;
            }
            console.log("Transaction type ", transaction.transactionsType);

            const transactionObject = {
                type: transactionType,
            };

            transactionObject[transaction.deposit ? 'deposit' : 'withdrawal'] = transaction.deposit || transaction.withdrawal;

            if (transactionType === 'sales') {
                const invoice = await InvoiceModel.findById(transaction.reference);
                if (invoice) {
                    transactionObject.reference = invoice.invoiceNumber;
                }
            } else {
                transactionObject.reference = transaction.reference;
            }

            transactions.push(transactionObject);
        }

        return res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



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