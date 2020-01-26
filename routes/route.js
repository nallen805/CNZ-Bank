//Routing for CNZ Bank

//Required modules
var express = require('express');
var router = express.Router();
var dbmodule = require('../public/javascripts/dbmodule.js');


//Home Page
router.get('/', function(request, response)
{   response.render('home', {title:'Welcome', message:'Welcome to CNZ Bank'});  });

//About page
router.get('/about', function(request, response)
{   response.render('about', {title:'About', message:'About Us'});  });

//Account creation request page
router.get('/accountRequest', function(request, response)
{   response.render('accountRequest', {title:'New Account', message:'New Account Request'});    });

//Login
router.get('/savedRequest', function(response)
{   response.render('savedRequest', {title:'Login', message:'Login'});  });

//Save account user info
router.post('/savedRequest', function(request, response)
{
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var email = request.body.email;
    var address = request.body.address;
    var city = request.body.city;
    var state = request.body.state;
    var zip = request.body.zip;
    var usName = firstName+'.'+lastName;
    var usPass = lastName+'.'+Math.random()*10;
    dbmodule.saveUserAccountRequest(firstName, lastName, email, address, city, state, zip, usName, usPass, response);
});

//Money management page
router.get('/moneymanage', function(request, response)
{   response.render('moneymanage', {title:'Money Management', message:'Money Management'}); });

//Saved money management session
router.post('/sessionSaved', function(request, response)
{
    var mmFName = request.body.mmFName;
    var mmLName = request.body.mmLName;
    var mmEmail = request.body.mmEmail;
    var sessionDate = request.body.sessionDate;
    var session = request.body.session;
    dbmodule.saveSessions(mmFName, mmLName, mmEmail, sessionDate, session, response);
});

//Admin login page
router.get('/adminLogin', function(request, response)
{   response.render('adminLogin', {title:'Admin Login', message:'Admin Login'});    });

//Admin Welcome
router.post('/adminWelcome', function(request, response)
{
    //console.log('Admin welcome');
    var adminUser = request.body.adminUser;
    var adminPass = request.body.adminPass;
    dbmodule.validateAdminUser(adminUser, adminPass, response);
}).get('/adminWelcome', function(request, response)
{   response.render('adminWelcome', {title:'Welcome', message:'Welcome, Admin'});   });

//Admin view all new account requests
router.get('/viewAllAcctRequests', function(request, response)
{   dbmodule.viewNewAcctRequests(response); });

//Admin view all user transactions
router.get('/viewAllUserTransactions', function(request, response)
{   dbmodule.viewAllUserTransactions(response); });

//Admin view all money management signups
router.get('/viewAllMMSignups', function(request, response)
{   dbmodule.showAllMMSignups(response);    });

//Login page
router.get('/login', function(request, response)
{   response.render('login', {title:'Login', message:'Login'}); });

router.post('/viewMyAccount', function(request, response)
{
    var usName = request.body.usName;
    var usPass = request.body.usPass;
    dbmodule.loginUser(usName, usPass, response);
}).get('/viewMyAccount/:usName', function(request, response)
{
    var usName = request.params.usName;
    dbmodule.viewAccount(usName, response);    
});

//Completed deposit
router.post('/completedDeposit', function(request, response)
{
    var usName = request.body.usName;
    var acctName = request.body.acctName;
    var acctNumDeposit = request.body.acctNumDeposit;
    var depositAmount = request.body.depositAmount;
    dbmodule.makeDeposit(usName, acctName, acctNumDeposit, depositAmount, response);
});

//Complete withdrawal
router.post('/completedWithdrawal', function(request, response)
{
    //console.log('Completing withdrawal');
    var usName = request.body.usName;
    var acctNameWithdrawal = request.body.acctNameWithdrawal;
    var acctNumWithdrawal = request.body.acctNumWithdrawal;
    var withdrawalAmount = request.body.withdrawalAmount;
    var checkingBalance = request.body.checkingBalance;
    var savingsBalance = request.body.savingsBalance;
    dbmodule.makeWithdrawal(usName, acctNameWithdrawal, acctNumWithdrawal, withdrawalAmount, checkingBalance, savingsBalance, response);
});

//Completed transfer
router.post('/completedTransfer', function(request, response)
{
    console.log('Request to transfer money received.');
    var usName = request.body.usName;
    var tranSelection = request.body.tranSelection;
    var transAmount = request.body.transAmount;
    var transFrom = request.body.transFrom;
    var transTo = request.body.transTo;
    var cBalan = request.body.checkBalan;
    var sBalan = request.body.saveBalan;
    dbmodule.transferMoney(usName, tranSelection, transFrom, transTo, transAmount, cBalan, sBalan, response);
});

//View all transactions
router.get('/viewTransactions/:usName', function(request, response)
{
    console.log('Viewing all transactions');
    var usName = request.params.usName;
    dbmodule.viewTransactions(usName, response);
});

module.exports=router;