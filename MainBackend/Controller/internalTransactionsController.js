const BankModel = require('../models/bankModel');
const ChequeModel = require('../models/chequeModel');
const CashModel = require('../models/cashModel');

const transferAmount = async(req, res) => {
    const { sourceAccountId, destinationAccountId, amount, transactionsType } = req.body;
    const { sourceAccountType, destinationAccountType } = req.params;

    try {
        let sourceAccount, destinationAccount;

        // Get source account
        switch (sourceAccountType) {
            case 'bank':
                sourceAccount = await BankModel.findById(sourceAccountId);
                break;
            case 'cheque':
                sourceAccount = await ChequeModel.findById(sourceAccountId);
                break;
            case 'cash':
                sourceAccount = await CashModel.findById(sourceAccountId);
                break;
            default:
                return res.status(400).json({ error: 'Invalid source account type' });
        }

        // Get destination account
        switch (destinationAccountType) {
            case 'bank':
                destinationAccount = await BankModel.findById(destinationAccountId);
                break;
            case 'cheque':
                destinationAccount = await ChequeModel.findById(destinationAccountId);
                break;
            case 'cash':
                destinationAccount = await CashModel.findById(destinationAccountId);
                break;
            default:
                return res.status(400).json({ error: 'Invalid destination account type' });
        }

        // Check if source and destination accounts exist
        if (!sourceAccount || !destinationAccount) {
            return res.status(404).json({ error: 'Source or destination account not found' });
        }

        // Withdraw from source account
        if (sourceAccountType === 'bank') {
            sourceAccount.transactions.push({
                reference: destinationAccountId,
                withdrawal: amount,
                transactionsType: transactionsType // Use the transactionsType from req.body
            });
        } else {
            // For cheque and cash accounts, consider it as withdrawal from the source
            sourceAccount.transactions.push({
                reference: destinationAccountId,
                withdrawal: amount,
                transactionsType: transactionsType // Use the transactionsType from req.body
            });
        }

        // Deposit to destination account
        if (destinationAccountType === 'bank') {
            destinationAccount.transactions.push({
                reference: sourceAccountId,
                deposit: amount,
                transactionsType: transactionsType // Use the transactionsType from req.body
            });
        } else {
            // For cheque and cash accounts, consider it as deposit to the destination
            destinationAccount.transactions.push({
                reference: sourceAccountId,
                deposit: amount,
                transactionsType: transactionsType // Use the transactionsType from req.body
            });
        }

        // Save updated accounts
        await sourceAccount.save();
        await destinationAccount.save();

        return res.status(200).json({ message: 'Amount transferred successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    transferAmount
};
