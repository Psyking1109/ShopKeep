const mongoose = require('mongoose');
const bankModel = require('../models/bankModel');
const TransactionTypeModel = require('../models/transationTypeModel')
const InvoiceModel = require('../models/invoicingModel')

//funtions
const {
    getAllTransactionsFunc,
    getBalanceFunc
}=require('../fuctions/transactionFuntions')

const createBankAccount = async (req, res) => {
    const { bankName, accountName, accountNumber, bankAccountId } = req.body;
    let emptyFields = [];
    if (!bankName) {
        emptyFields.push('bankName');
    }
    if (!accountName) {
        emptyFields.push('accountName');
    }
    if (!accountNumber) {
        emptyFields.push('accountNumber');
    }
    if (!bankAccountId) {
        emptyFields.push('bankAccountId');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields ', emptyFields });
    }
    try {
        const bank = await bankModel.create({
            bankName,
            accountName,
            accountNumber,
            bankAccountId
        });
        res.status(200).json(bank);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBankAccountById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such bank Account Found' });
        }
        const bankAccount = await bankModel.findById(id);
        return res.status(200).json(bankAccount); 
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateTransaction = async(req, res)=> {
    const { accountId, transactionId } = req.params;
    const {updateData} = req.body
    try {
        const updatedAccount = await bankModel.findOneAndUpdate(
            { _id: accountId, "transactions._id": transactionId },
            { $set: { "transactions.$": updateData } },
            { new: true }
        );
        res.status(200).json(updatedAccount); 
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteTransaction = async(req, res)=> {
    const { accountId, transactionId } = req.params;
    try {
        const updatedAccount = await bankModel.findByIdAndUpdate(
            accountId,
            { $pull: { transactions: { _id: transactionId } } },
            { new: true }
        );
        res.status(200).json(updatedAccount); 
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteBankAccount = async(req, res)=> {
    const { accountId } = req.params;
    try {
        const deletedAccount = await bankModel.findByIdAndDelete(accountId);
        if (!deletedAccount) {
            return res.status(404).json({ error: 'Bank account not found' });
        }
        return res.status(200).json({ message: 'Bank account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateBankAccount = async(req, res)=> {
    const { accountId } = req.params;
    const { bankName, accountName, accountNumber, bankAccountId } = req.body;

    try {
        const updatedAccount = await bankModel.findByIdAndUpdate(
            accountId,
            { $set: { bankName, accountName, accountNumber, bankAccountId } },
            { new: true }
        );
        if (!updatedAccount) {
            return res.status(404).json({ error: 'Bank account not found' });
        }
        return res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getBalance = async(req,res)=>{
    await getBalanceFunc(req,res,bankModel)

}
  const getAllTransactions = async(req,res) =>{
    await getAllTransactionsFunc(req, res , bankModel,TransactionTypeModel , InvoiceModel)
  }
   

module.exports = {
    createBankAccount,
    getBankAccountById,
    updateTransaction,
    deleteTransaction,
    deleteBankAccount,
    updateBankAccount,
    getBalance,
    getAllTransactions
};
