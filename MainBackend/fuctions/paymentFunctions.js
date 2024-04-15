
const checkPayment = async(req,payment,chequeModel,payments,transactionTypeModelId,savedInvoice)=>{

    const chequeId = await chequeModel.findOne({chequeAccountId:req.body.chequeAccountId})
                if (!chequeId) {
                   
                    return res.status(400).send('cheque id not found !');
                  }  

                const chequePayment = await chequeModel.findOneAndUpdate(
                    chequeId._id,
                    {                       
                        $push: {
                            transactions: {
                                reference:savedInvoice._id,
                                chequeNumber:payment.chequeDetails.chequeNumber,
                                bankName:payment.chequeDetails.bankName,
                                bankBranch:payment.chequeDetails.bankBranch,
                                datedTo:payment.chequeDetails.datedTo,
                                deposit:payment.chequeDetails.amount,
                                transactionsType:transactionTypeModelId._id
                            }
                        }
                    },
                    { new: true }
                )
                if (chequePayment) {
                    const transactionId = chequePayment.transactions[chequePayment.transactions.length - 1]._id
                    console.log("product movement id", transactionId)
                    payments.push({
                        paymentType: 'cheque',
                        transaction: transactionId
                    });
    
                } else {
                    console, log("no documents found ")
                }

}


const bankPayment = async(req,payment,bankModel,payments,transactionTypeModelId,savedInvoice)=>{

    const bankId = await bankModel.findOne({bankAccountId:req.body.bankModel})
                if (!bankId) {
                   
                    return res.status(400).send('cheque id not found !');
                  }  

                const bankPayment = await bankModel.findOneAndUpdate(
                    bankId._id,
                    {                       
                        $push: {
                            transactions: {
                                reference:savedInvoice._id,
                                deposit:payment.chequeDetails.amount,
                                transactionsType:transactionTypeModelId._id
                            }
                        }
                    },
                    { new: true }
                )
                if (bankPayment) {
                    const transactionId = bankPayment.transactions[bankPayment.transactions.length - 1]._id
                    console.log("product movement id", transactionId)
                    payments.push({
                        paymentType: 'bank',
                        transaction: transactionId
                    });
    
                } else {
                    console, log("no documents found ")
                }

}

const cashPayment = async(req,payment,cashModel,payments,transactionTypeModelId,savedInvoice)=>{

    const cashId = await cashModel.findOne({bankAccountId:req.body.bankModel})
                if (!cashId) {
                   
                    return res.status(400).send('cheque id not found !');
                  }  

                const cashPayment = await cashModel.findOneAndUpdate(
                    cashId._id,
                    {                       
                        $push: {
                            transactions: {
                                reference:savedInvoice._id,
                                deposit:payment.chequeDetails.amount,
                                transactionsType:transactionTypeModelId._id
                            }
                        }
                    },
                    { new: true }
                )
                if (cashPayment) {
                    const transactionId = cashPayment.transactions[cashPayment.transactions.length - 1]._id
                    console.log("product movement id", transactionId)
                    payments.push({
                        paymentType: 'cash',
                        transaction: transactionId
                    });
    
                } else {
                    console, log("no documents found ")
                }

}


module.exports = {
    checkPayment,
    bankPayment,
    cashPayment
}
