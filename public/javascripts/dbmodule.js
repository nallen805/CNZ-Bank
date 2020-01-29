var mongojs = require('mongojs');
var databaseURL = "localhost/banking";
var db = mongojs(databaseURL);
var message = null;
var newCAcctNo = 1023+Math.random()*100;
var newSAcctNo = 628+Math.random()*100;
var cBalance;
var sBalance;

//Save user account request
exports.saveUserAccountRequest=function(firstName, lastName, email, address, city, state, zip, usName, usPass, response)
{
    cBalance=parseFloat('0.00');
    sBalance=parseFloat('0.00');

    //Create new user account
    db.newAccountRequests.save({"firstName":firstName, "lastName":lastName, "email":email, "address":address, "city":city, "state":state, "zip":zip, 
    "checking":newCAcctNo, "savings":newSAcctNo, "usName":usName, "usPass":usPass, "cBalance":cBalance, "sBalance":sBalance}, 
    function(error, saved)
    {
        if(error || !saved)
        {
            console.log('Unable to save');
            response.render('error', {title:'Error', message:'error'});
        }
        else
        {
            console.log('Saved user account request');
            response.render('savedRequest', {title:'Success', message:'Your new account request has been saved'});
        }
    });
}

//Save session signups
exports.saveSessions=function(mmFName, mmLName, mmEmail, sessionDate, session, response)
{
    db.moneySessions.save({'mmFName':mmFName, 'mmLName':mmLName, 'mmEmail':mmEmail, 'sessionDate':sessionDate, 'session':session}, 
    function(error, saved)
    {
        if(error || !saved)
        {
            console.log('Error: Unable to save');
            response.render('error', {title:'Error', message:'Error'});
        }
        else
        {
            if(session=='All 4 Sessions')
            {
                console.log('Saved session successfully');
                response.render('sessionSaved', {title:'Saved Session', message:'You have been scheduled for all 4 sessions! See you soon!'});
            }
            else
            {
                console.log('Saved session successfully');
                response.render('sessionSaved', {title:'Saved Session', message:'Your session signup has been saved. Thank you for signing up! If you need to change or cancel your '+
                'session, simply send us an email, and we\'ll update your selection to the requested date. See you on '+sessionDate});
            }
        }
    });
}

//Verify admin user
exports.validateAdminUser=function(adminUser, adminPass, response)
{
    db.adminUsers.find({"adminUser":adminUser, "adminPass":adminPass}, function(error, adminUsersAvailable)
    {
        if(error || !adminUsersAvailable)
        {
            console.log('Invalid login');
            response.render('error', {title:'Invalid User', message:'Invalid User'});
        }
        else if(adminUsersAvailable.length == 0)
        {
            console.log('Invalid user');
            response.render('adminLogin', {title:'Invalid Login', message:'Please try again'});
        }
        else
        {
            console.log('Welcome Admin');
            response.render('adminWelcome', {title:'Admin Welcome', message:'Welcome Admin'});
        }
    });
}

//Admin user view all new account requests
exports.viewNewAcctRequests=function(response)
{
    db.newAccountRequests.find({}, function(error, newAccountRequests)
    {
        if(error || !newAccountRequests)
        {
            console.log('Error');
            response.render('Error', {title:'Error', message:'Error'});
        }
        else
        {
            console.log('Request to view all new account requests received');
            response.render('viewAllAcctRequests', {newAcct:newAccountRequests, title:'View All', message:'View All Account Requests'});
        }
    });
}

//Admin user view all money management signups
exports.showAllMMSignups=function(response)
{
    db.moneySessions.find({}, function(error, moneySessions)
    {
        if(error || !moneySessions)
        {
            console.log('Error');
            response.render('error', {title:'Error', message:error});
        }
        else
        {
            console.log('Showing all MM signups');
            response.render('viewAllMMSignups', {mm:moneySessions, title:'Money Management Signups', message:'View all Money Management Signups'});
        }
    });
}

//Login to see new account
exports.loginUser=function(usName, usPass, response)
{
    db.newAccountRequests.find({"usName":usName, "usPass":usPass}, function(error, newAccountRequests)
    {
        if(error || !newAccountRequests)
        {
            console.log('Invalid username');
            response.render('error', {title:'Invalid User', message:'Invalid User'});
        }
        else if(newAccountRequests.length==0)
        {
            console.log('Invalid user');
            response.render('login', {title:'Invalid User', message:'Invalid User'});
        }
        else
        {
            console.log('Request to view user account received.');
            response.render('viewMyAccount', {acctReq:newAccountRequests, title:'My Account', message:'Welcome, ', usName:usName});
        }
    });
}

//User can view their account --- fixed login rerouting issue
exports.viewAccount=function(usName, response)
{
    db.newAccountRequests.find({"usName":usName}, function(error, newAccountRequests)
    {
        if(error || !newAccountRequests)
        {
            console.log('error');
            response.render('error', {title:'Error', message:error});
        }
        else
        {
            console.log('Viewing account...');
            response.render('viewMyAccount', {acctReq:newAccountRequests, usName:usName, title:'My Account', message:'Welcome, '});
        }
    });
}

//View all my transactions (as a user)
exports.viewTransactions=function(usName, response)
{   
    //Trying to show a limit on how many transactions are displayed
    //db.transactions.aggregate({$limit:10});

    db.transactions.find({"usName":usName}, function(error, userTrans)
    {
        if(error || !userTrans)
        {   response.render('error', {title:'Error', message:error});   }
        else
        {   response.render('viewTransactions', {tran:userTrans, usName:usName, title:'My Account', message:'Transactions'});  }
    });
}

//Make a deposit
exports.makeDeposit=function(usName, acctName, acctNumDeposit, depositAmount, response)
{
    //Making deposit to checking
    if(acctName=='checking')
    {
        db.userDeposits.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "acctName":acctName, "acctNum":acctNumDeposit, "depositAmt":parseFloat(depositAmount)}, 
        function(error, saved)
        {   
            if(error || !saved)
            {   response.render('error', {title:'Error', message:error});   }
            else
            {   response.render('completedDeposit', {title:'Success', usname:usName ,message:'Your deposit to your '+acctName+' account in the amount of $'+depositAmount+ ' was successful.'});   }
        });

        //Update checking balance 
        db.newAccountRequests.update({"usName":usName},{$inc:{"cBalance":parseFloat(depositAmount)}}, function(error, updated)
        {
            if(error || !updated)
            {   response.render('error', {title:'Error', message:error});   }
            else
            {   console.log('Account balance updated.');    }
        });

        //Add this transaction to the trasactions collection
        db.transactions.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "acctName":acctName, "acctNum":acctNumDeposit, 
        "depositAmount":parseFloat(depositAmount), "transactionType":"deposit"}, function(error, saved)
            {
                if(error || !saved)
                {   response.render('error', {title:'Error', message:error});   }
                else
                {   console.log('Added transaction successfully.'); }
            });
    }

    //Making deposit to savings
    else if(acctName=='savings')
    {
        db.userDeposits.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "acctName":acctName, "acctNum":acctNumDeposit, "depositAmt":parseFloat(depositAmount)}, 
        function(error, saved)
        {
            if(error || !saved)
            {   response.render('error', {title:'Error', message:error});   }
            else
            {   response.render('completedDeposit', {title:'Success', usname:usName, message:'Your deposit to your '+acctName+' in the amount of $'+depositAmount+' was successful.'});    }
        });

        //Update savings account
        db.newAccountRequests.update({"usName":usName}, {$inc:{"sBalance":parseFloat(depositAmount)}}, 
        function(error, updated)
        {
            if(error || !updated)
            {   response.render('error', {title:'Error', message:error});   }
            else
            {   console.log('Deposit to savings account successful.');   }
        });
            
        //Add this transaction to the trasactions collection
        db.transactions.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "acctName":acctName, "acctNum":acctNumDeposit, 
        "depositAmount":parseFloat(depositAmount), "transactionType":"deposit"}, 
        function(error, saved)
            {
                if(error || !saved)
                {   response.render('error', {title:'Error', message:error});   }
                else
                {   console.log('Added transaction successfully.'); }
            });
    }
}

//Make a withdrawal
exports.makeWithdrawal=function(usName, acctNameWithdrawal, acctNumWithdrawal,  withdrawalAmount, checkingBalance, savingsBalance, response)
{
    //If checking is selected
    if(acctNameWithdrawal=='checking')
    {
        //Make sure the withdrawal amount is less than the available balance
        if(parseFloat(withdrawalAmount) > parseFloat(checkingBalance))
        {   response.render('unsuccessfulWithdrawal', {title:'Unsuccessful', usName:usName, message:' unfortunately, you do not have enough funds unavailable. You will need to make a deposit first.'});  }
        else
        {
            db.userWithdrawals.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "acctName":acctNameWithdrawal, "acctNum":acctNumWithdrawal,
        "withdrawalAmount":parseFloat(withdrawalAmount)}, function(error, saved)
        {
            if(error || !saved)
            {   response.render('error', {title:'Error', message:'Unable to complete withdrawal'}); }
            else
            {   response.render('completedWithdrawal', {title:'Successful withdrawal', usname:usName, message:'Your withdrawal from your '+acctNameWithdrawal+' in the amount of $'+withdrawalAmount+' was successful.'}); }
        });

        //Update checking account balance
        db.newAccountRequests.update({"usName":usName}, {$inc:{"cBalance":-parseFloat(withdrawalAmount)}}, function(error, updated)
        {
            if(error || !updated)
            {   response.render('error', {title:'Error', message:error});   }
            else
            {   console.log('Account balance updated.');    }
        });

        //Add this transaction to the trasactions collection
        db.transactions.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "acctName":acctNameWithdrawal, 
        "acctNum":acctNumWithdrawal, "withdrawalAmount":parseFloat(withdrawalAmount), "transactionType":"withdrawal"}, 
        function(error, saved)
            {
                if(error || !saved)
                {   response.render('error', {title:'Error', message:error});   }
                else
                {   console.log('Added transaction successfully.'); }
            });
        }
    }

    //Savings account selected
    else if(acctNameWithdrawal=='savings')
    {
        //Make sure the withdrawal amount is less than the available balance
        if(parseFloat(withdrawalAmount) > parseFloat(savingsBalance))
        {   response.render('unsuccessfulWithdrawal', {title:'Unsuccessful', usName:usName, message:' unfortunately, you do not have enough funds unavailable. You will need to make a deposit first.'});  }

        else
        {
            db.userWithdrawals.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "acctName":acctNameWithdrawal, "acctNum":acctNumWithdrawal,
            "withdrawalAmount":parseFloat(withdrawalAmount)}, function(error, saved)
            {
                if(error || !saved)
                {   response.render('error', {title:'Error', message:error});   }
                else
                {   response.render('completedWithdrawal', {title:'Success', usname:usName, message:'Your withdrawal from your '+acctNameWithdrawal+' in the amount of $'+withdrawalAmount+' was successful.'});   }
            });
            
            //Update savings account balance
            db.newAccountRequests.update({"usName":usName}, {$inc:{"sBalance":-parseFloat(withdrawalAmount)}}, 
            function(error, updated)
            {
                if(error || !updated)
                {   response.render('error', {title:'Error', message:error});   }
                else
                {   console.log('Account balance updated.');    }
            });
    
            //Add this transaction to the trasactions collection
            db.transactions.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "acctName":acctNameWithdrawal, 
            "acctNum":acctNumWithdrawal, "withdrawalAmount":parseFloat(withdrawalAmount), "transactionType":"withdrawal"}, 
            function(error, saved)
                {
                    if(error || !saved)
                    {   response.render('error', {title:'Error', message:error});   }
                    else
                    {   console.log('Added transaction successfully.'); }
                });
        }
    }
}

//Transfer money
exports.transferMoney=function(usName, tranSelection, transFrom, transTo, transAmount, cBalan, sBalan, response)
{
    //If checking account is selected -- transfer from checking to savings
    if(tranSelection=='checking')
    {
        //Make sure the transfer amount is less than the available balance
        if(parseFloat(transAmount) > parseFloat(cBalan))
        {   response.render('unsuccessfulTransfer', {title:'Unsuccessful', usName:usName, message:' unfortunately, you do not have enough funds unavailable. You will need to make a deposit first.'});  }

        else
        {
        db.userTransfers.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "transFrom":transFrom, "transTo":transTo, "transAmount":parseFloat(transAmount)},
        function(error, saved)
        {
            if(error || !saved)
            {   response.render('error', {title:'Error', message:error});   }
            else
            {   response.render('completedTransfer', {title:'Success', usname:usName, message:'Your transfer from your '+tranSelection+' account to your savings account in the amount of $'+transAmount+' was successful.'}); }
        });

        //Update checking and savings accounts
        db.newAccountRequests.update({"usName":usName}, {$inc:{"cBalance":-parseFloat(transAmount), "sBalance":parseFloat(transAmount)}}, function(error, updated)
        {
            if(error || !updated)
            {   response.render('error', {title:'Error', message:error});   }
            else
            {   console.log('Checking and savings account balances updated.');   }
        });

        //Add this transaction to the trasactions collection
        db.transactions.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "transFrom":"checking", 
        "transTo":"savings", "transAmount":parseFloat(transAmount), "transactionType":"transfer"}, 
        function(error, saved)
            {
                if(error || !saved)
                {
                    console.log('Unable to save transaction');
                    response.render('error', {title:'Error', message:error});
                }
                else
                {   console.log('Added transaction successfully.'); }
            });
        }
    }

    //Savings account selected -- transfer from savings to checking
    else if(tranSelection=='savings')
    {
        //Make sure transfer amount is less than available balance
        if(parseFloat(transAmount) > parseFloat(sBalan))
        {   response.render('unsuccessfulTransfer', {title:'Unsuccessful', usName:usName, message:' unfortunately, you do not have enough funds unavailable. You will need to make a deposit first.'});  }
        
        else
        {
        db.userTransfers.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "transFrom":transFrom, "transTo":transTo, "transAmount":parseFloat(transAmount)},
        function(error, saved)
        {
            if(error || !saved)
            {   response.render('error', {title:'Error', message:error});   }
            else
            {   response.render('completedTransfer', {title:'Success', usname:usName, message:'Your transfer from your '+tranSelection+' account to your checking account in the amount of $'+transAmount+' was successful. What would you like to do next, '});    }
        });

        //Update checking and savings accounts
        db.newAccountRequests.update({"usName":usName}, {$inc:{"sBalance":-parseFloat(transAmount), "cBalance":parseFloat(transAmount)}}, function(error, updated)
        {
            if(error || !updated)
            {   response.render('error', {title:'Error', message:error});   }
            else
            {   console.log('Checking and savings account balances updated.');   }
        });

        //Add this transaction to the trasactions collection
        db.transactions.save({"date":new Date().toDateString()+' '+new Date().toTimeString(), "usName":usName, "transFrom":"savings", 
        "transTo":"checking", "transAmount":parseFloat(transAmount), "transactionType":"transfer"}, 
        function(error, saved)
            {
                if(error || !saved)
                {   response.render('error', {title:'Error', message:error});   }
                else
                {   console.log('Added transaction successfully.'); }
            });
        }
    }
}

//View all user transactions
exports.viewAllUserTransactions=function(response)
{
    db.transactions.find({}, function(error, userTransactions)
    {
        if(error || !userTransactions)
        {   response.render('error', {title:'Error', message:error});   }
        else
        {   response.render('viewAllUserTransactions', {allTrans:userTransactions, title:'View All Transactions', message:'Viewing all user transactions'});    }
    });
}