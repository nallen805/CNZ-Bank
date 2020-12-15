// Additional JS functions
window.onload=function()
{
    $('#datePicker').datepicker();   
    $('#showDeposit').hide();
    $('#showWithdrawal').hide();
    $('#showTransferForm').hide();
    $('#showTransactions').hide();
}

//Show these forms when respective buttons are clicked
function showTransactions(usName)
{
    usName = document.getElementById('usName').innerHTML.split(" ")[1];
    window.location.assign('/viewTransactions/'+usName);
}

function showDepositForm()
{
    $('#showDeposit').toggle();
    $('#showWithdrawal').hide();
    $('#showTransferForm').hide();
    $('#showTransactions').hide();
}

function showWithdrawalForm(cBalance, sBalance)
{
    cBalance=document.getElementById('cBalance').innerHTML.split(" ")[1].slice(1);
    sBalance=document.getElementById('sBalance').innerHTML.split(" ")[1].slice(1);
    document.getElementById('checkBal').value=cBalance;
    document.getElementById('saveBal').value=sBalance;

    $('#showWithdrawal').toggle();
    $('#showDeposit').hide();
    $('#showTransferForm').hide();
    $('#showTransactions').hide();
}

function showTransferForm(cBalance, sBalance)
{
    cBalance=document.getElementById('cBalance').innerHTML.split(" ")[1].slice(1);
    sBalance=document.getElementById('sBalance').innerHTML.split(" ")[1].slice(1);
    document.getElementById('cBalan').value=cBalance;
    document.getElementById('sBalan').value=sBalance;

    $('#showTransferForm').toggle();
    $('#showWithdrawal').hide();
    $('#showDeposit').hide();
    $('#showTransactions').hide();
}

//Prepopulate deposit account field so user doens't have to type it in
function depositPrepopulate(acctNameDeposit)
{
    acctNameDeposit=document.getElementById('acctNameDeposit').value;
    if(acctNameDeposit=='checking')
    {   document.getElementById('depositAcct').value=document.getElementById('checking').innerHTML.split(" ")[2];}
    else if(acctNameDeposit=='savings')
    {   document.getElementById('depositAcct').value=document.getElementById('savings').innerHTML.split(" ")[2];}
}

//Prepopulate
function withdrawalPrepopulate(acctNameWithdrawal)
{
    acctNameWithdrawal=document.getElementById('acctNameWithdrawal').value;
    if(acctNameWithdrawal=='checking')
    {   
        document.getElementById('acctNumWithdrawal').value=document.getElementById('checking').innerHTML.split(" ")[2];
        
    }
    else if(acctNameWithdrawal=='savings')
    {   document.getElementById('acctNumWithdrawal').value=document.getElementById('savings').innerHTML.split(" ")[2];}

}

//Prepopulate
function transferPrepopulate(selection)
{
    selection=document.getElementById('selection').value;
    if(selection=='checking')
    {
        document.getElementById('transFrom').value=document.getElementById('checking').innerHTML.split(" ")[2];
        document.getElementById('transTo').value=document.getElementById('savings').innerHTML.split(" ")[2];
    }
    else if(selection=='savings')
    {
        document.getElementById('transFrom').value=document.getElementById('savings').innerHTML.split(" ")[2];
        document.getElementById('transTo').value=document.getElementById('checking').innerHTML.split(" ")[2];
    }
}

//Money Management Signup
function moneyManagementSignup()
{   window.location.assign('/moneymanage');}

//Go back to home page
function logout()
{   window.location.assign('/login');}

//Redirect to view my account after successful deposit, withdrawal, or transfer
function goBackToAccount(usname)
{   
    usname=document.getElementById('usname').innerHTML.split(" ")[7];
    window.location.assign('/viewMyAccount/'+usname);
}

//Redirect to view my account after unsuccessful withdrawal, or transfer
function backToMyAccount(usName)
{
    usName=document.getElementById('usName').innerHTML.split(" ")[1];
    window.location.assign('/viewMyAccount/'+usName);
}

//Search users
function searchUsers()
{
    let input = document.getElementById('search').value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName('searches');

    for(var i=0; i<x.length; i++)
    {
        if(!x[i].innerHTML.toLowerCase().includes(input))
        {
            x[i].style.display='none';
        }
        else
        {
            x[i].style.display='tr';
        }
    }
}
