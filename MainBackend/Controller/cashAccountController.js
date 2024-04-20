const CashModel = require('../models/cashModel');
const TransactionTypeModel = require('../models/transationTypeModel')
const InvoiceModel = require('../models/invoicingModel')

//funtions
const {
    getAllTransactionsFunc,
    getBalanceFunc
}=require('../fuctions/transactionFuntions');
const cashModel = require('../models/cashModel');

const createCashAccount = async(req, res)=> {
    const {
        cashAccountName,
        cashId
    } = req.body;

    try {
        const cashAccount = await CashModel.create({
            cashAccountName,
            cashId
        });
        res.status(200).json(cashAccount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getCashAccountById = async(req, res)=> {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such cash account found' });
        }
        const cashAccount = await CashModel.findById(id);
        return res.status(200).json(cashAccount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateCashTransaction = async(req, res)=> {
    const { accountId, transactionId, updateData } = req.params;
    try {
        const updatedAccount = await CashModel.findOneAndUpdate(
            { _id: accountId, "transactions._id": transactionId },
            { $set: { "transactions.$": updateData } },
            { new: true }
        );
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteCashTransaction = async(req, res)=> {
    const { accountId, transactionId } = req.params;
    try {
        const updatedAccount = await CashModel.findByIdAndUpdate(
            accountId,
            { $pull: { transactions: { _id: transactionId } } },
            { new: true }
        );
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteCashAccount = async(req, res)=> {
    const { accountId } = req.params;
    try {
        const deletedAccount = await CashModel.findByIdAndDelete(accountId);
        if (!deletedAccount) {
            return res.status(404).json({ error: 'Cash account not found' });
        }
        return res.status(200).json({ message: 'Cash account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateCashAccount = async(req, res)=> {
    const { accountId } = req.params;
    const { cashAccountName, cashId } = req.body;

    try {
        const updatedAccount = await CashModel.findByIdAndUpdate(
            accountId,
            { $set: { cashAccountName, cashId } },
            { new: true }
        );
        if (!updatedAccount) {
            return res.status(404).json({ error: 'Cash account not found' });
        }
        return res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllTransactions = async (req,res) =>{
    await getAllTransactionsFunc(req, res , cashModel,TransactionTypeModel , InvoiceModel)
}
const getBalance = async(req,res)=>{
    await getBalanceFunc(req,res,cashModel)
}


module.exports = {
    createCashAccount,
    getCashAccountById,
    updateCashTransaction,
    deleteCashTransaction,
    deleteCashAccount,
    updateCashAccount,
    getAllTransactions,
    getBalance
};
