
const chequePayment = async (res, chequePaymentDetails, chequeModel, payments, transactionTypeModelId, savedInvoice) => {

    const chequeAccountId = chequePaymentDetails ? chequePaymentDetails.chequeDetails[0].chequeAccountId :null;
    const paidAmount = chequePaymentDetails.chequeDetails[0].amount

    const chequeId = await chequeModel.findById(chequeAccountId)
    if (!chequeId) {

        return res.status(400).send('cheque id not found !');
    }
   // console.log("cheque acc - ", chequeId)
    const chequePayment = await chequeModel.findByIdAndUpdate(
        chequeId._id,
        {
            $push: {
                transactions: {
                    reference: savedInvoice._id,
                    chequeNumber: chequePaymentDetails.chequeDetails[0].chequeNumber,
                    bankName: chequePaymentDetails.chequeDetails[0].bankName,
                    bankBranch: chequePaymentDetails.chequeDetails[0].bankBranch,
                    datedTo: chequePaymentDetails.chequeDetails[0].datedTo,
                    deposit: paidAmount,
                    transactionsType: transactionTypeModelId._id
                }
            }
        },
        { new: true }
    )
   
    if (chequePayment) {
        const transactionId = chequePayment.transactions[chequePayment.transactions.length - 1]._id
       // console.log("transactionId", transactionId)
        payments.push({
            paymentType: 'cheque',
            transaction: transactionId
        });
     //   console.log("cheque payment", payments)
        chequePayment.save();
        return paidAmount
    } else {
        console, log("no documents found ")
    }

}


const bankPayment = async (res, bankPaymentDetails, bankModel, payments, transactionTypeModelId, savedInvoice) => {

    const bankAccountId = bankPaymentDetails ? bankPaymentDetails.bankDetails[0].bankAccountId :null;
    const paidAmount = bankPaymentDetails.bankDetails[0].amount
    const bankId = await bankModel.findById(bankAccountId)
    if (!bankId) {

        return res.status(400).send('cheque id not found !');
    }
    console.log("bank acc - ", bankId)
    const bankPayment = await bankModel.findByIdAndUpdate(
        bankId._id,
        {
            $push: {
                transactions: {
                    reference: savedInvoice._id,
                    deposit: paidAmount,
                    transactionsType: transactionTypeModelId._id
                }
            }
        },
        { new: true }
    )
   
    if (bankPayment) {
        const transactionId = bankPayment.transactions[bankPayment.transactions.length - 1]._id
        console.log(" bank transactionId", transactionId)
        payments.push({
            paymentType: 'bank',
            transaction: transactionId
        });
        console.log("bank payment", bankPayment)
        bankPayment.save();
        return paidAmount
    } else {
        console, log("no documents found ")
    }

}

const cashPayment = async (res, cashPaymentDetails, cashModel, payments, transactionTypeModelId, savedInvoice) => {

    const cashAccountId = cashPaymentDetails ? cashPaymentDetails.cashDetails[0].cashAccountId : null;
    const paidAmount = cashPaymentDetails ? cashPaymentDetails.cashDetails[0].amount : null;
    const cashId = await cashModel.findById(cashAccountId)
    if (!cashId) {

        return res.status(400).send('cash account id not found !');
    }
    //console.log("cash acc - ", cashId)
    const cashPayment = await cashModel.findByIdAndUpdate(
        cashId._id,
        {
            $push: {
                transactions: {
                    reference: savedInvoice._id,
                    deposit: paidAmount,
                    transactionsType: transactionTypeModelId._id
                }
            }
        },
        { new: true }
    )
    
    
    if (cashPayment) {
        const transactionId = cashPayment.transactions[cashPayment.transactions.length - 1]._id
       // console.log("cash transactionId", transactionId)
        payments.push({
            paymentType: 'cash',
            transaction: transactionId
        });
        cashPayment.save();
       // console.log("cash payment", payments)
        return paidAmount
    } else {
        console, log("no documents found ")
    }

}


module.exports = {
    chequePayment,
    bankPayment,
    cashPayment
}
