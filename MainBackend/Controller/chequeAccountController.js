const ChequeModel = require('../models/chequeModel');
const TransactionTypeModel = require('../models/transationTypeModel')
const InvoiceModel = require('../models/invoicingModel')

//funtions
const {
    getAllTransactionsFunc,
    getBalanceFunc
}=require('../fuctions/transactionFuntions');
const chequeModel = require('../models/chequeModel');



const createChequeAccount = async(req, res)=> {
    const {
        chequeAccountName,
        chequeAccountId
    } = req.body;

    try {
        const chequeAccount = await ChequeModel.create({
            chequeAccountName,
            chequeAccountId
        });
        res.status(200).json(chequeAccount);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getChequeAccountById = async(req, res)=> {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such cheque account found' });
        }
        const chequeAccount = await ChequeModel.findById(id);
        return res.status(200).json(chequeAccount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateChequeTransaction = async(req, res)=> {
    const { accountId, transactionId, updateData } = req.params;
    try {
        const updatedAccount = await ChequeModel.findOneAndUpdate(
            { _id: accountId, "transactions._id": transactionId },
            { $set: { "transactions.$": updateData } },
            { new: true }
        );
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteChequeTransaction = async(req, res) => {
    const { accountId, transactionId } = req.params;
    try {
        const updatedAccount = await ChequeModel.findByIdAndUpdate(
            accountId,
            { $pull: { transactions: { _id: transactionId } } },
            { new: true }
        );
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteChequeAccount = async(req, res)=> {
    const { accountId } = req.params;
    try {
        const deletedAccount = await ChequeModel.findByIdAndDelete(accountId);
        if (!deletedAccount) {
            return res.status(404).json({ error: 'Cheque account not found' });
        }
        return res.status(200).json({ message: 'Cheque account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const updateChequeAccount = async(req, res)=> {
    const { accountId } = req.params;
    const { chequeAccountName, chequeAccountId } = req.body;

    try {
        const updatedAccount = await ChequeModel.findByIdAndUpdate(
            accountId,
            { $set: { chequeAccountName, chequeAccountId } },
            { new: true }
        );
        if (!updatedAccount) {
            return res.status(404).json({ error: 'Cheque account not found' });
        }
        return res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getBalance = async(req,res)=>{
    await getBalanceFunc(req,res,chequeModel)
}

const getAllTransactions = async(req,res)=>{
    await getAllTransactionsFunc(req, res , chequeModel,TransactionTypeModel , InvoiceModel)
}



module.exports = {
    createChequeAccount,
    getChequeAccountById,
    updateChequeTransaction,
    deleteChequeTransaction,
    deleteChequeAccount,
    updateChequeAccount,
    getBalance,
    getAllTransactions
};
