// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lending {
    // The minimum and maximum amount of ETH that can be loaned
    uint public constant MIN_LOAN_AMOUNT = 0.1 ether;
    uint public constant MAX_LOAN_AMOUNT = 25 ether;
    // The minimum and maximum interest rate in percentage that can be set for a loan
    uint public constant MIN_INTEREST_RATE = 10;
    uint public constant MAX_INTEREST_RATE = 50;

    //structure to store loan data
    struct Loan {
        uint amount;
        uint interest;
        uint duration;
        uint repaymentAmount;
        uint fundingDeadline;
        address borrower;
        address payable lender;
        bool active;
        bool repaid;
    }
    //mapping to store loans
    mapping(uint => Loan) public loans;
    uint public loanCount;
    //events to track the loan activity such as creation, funding and repayment of the loan
    event LoanCreated(
        uint loanId,
        uint amount,
        uint interest,
        uint duration,
        uint fundingDeadline,
        address borrower,
        address lender
    );
    event LoanFunded(uint loanId, address funder, uint amount);
    event LoanRepaid(uint loanId, uint amount);
    //modifiers for loan functions
    modifier onlyActiveLoan(uint _loanId) {
        require(loans[_loanId].active, "Loan is not active");
        _;
    }
    modifier onlyBorrower(uint _loanId) {
        require(msg.sender == loans[_loanId].borrower,"Only the borrower can perform this action");
        _;
    }
    //function that allow to create a new loan when the user specifies loan amoun, interest rate,
    //and loan duration
    function createLoan(uint _amount, uint _interest, uint _duration) external payable {
        require(_amount >= MIN_LOAN_AMOUNT && _amount <= MAX_LOAN_AMOUNT, "Loan amount must be between 0.1 ETH and 25 ETH");
        require(_interest >= MIN_INTEREST_RATE && _interest <= MAX_INTEREST_RATE,"Interest rate must be between 10% and 50%");
        require(_duration > 0, "Loan duration must be greater than 0");
        uint _repaymentAmount = _amount + (_amount * _interest) / 100;
        uint _fundingDeadline = block.timestamp + (1 days);
        uint loanId = loanCount++;
        Loan storage loan = loans[loanId];
        loan.amount = _amount;
        loan.interest = _interest;
        loan.duration = _duration;
        loan.repaymentAmount = _repaymentAmount;
        loan.fundingDeadline = _fundingDeadline;
        loan.borrower = msg.sender;
        loan.lender = payable(address(0));
        loan.active = true;
        loan.repaid = false;
        emit LoanCreated(
            loanId,
            _amount,
            _interest,
            _duration,
            _fundingDeadline,
            msg.sender,
            address(0)
        );
    }
    //function that allows someone else to fund your loan fully and close ypur loan
    function fundLoan(uint _loanId) external payable onlyActiveLoan(_loanId) {
        Loan storage loan = loans[_loanId];
        require(msg.sender != loan.borrower,"Borrower cannot fund their own loan");
        require(loan.repaymentAmount == msg.value, "not enough");
        payable(address(this)).transfer(msg.value);
        loan.lender = payable(msg.sender);
        loan.active = false;
        emit LoanFunded(_loanId, msg.sender, msg.value);
    }
    //function that allows you to repay your loan
    function repayLoan(uint _loanId, uint _repayAmount) external payable onlyActiveLoan(_loanId) onlyBorrower(_loanId) {
        require(_repayAmount == loans[_loanId].repaymentAmount,"Incorrect repayment amount");
        payable(loans[_loanId].lender).transfer(_repayAmount);
        loans[_loanId].repaid = true;
        loans[_loanId].active = false;
        emit LoanRepaid(_loanId, _repayAmount);
    }
    //function that allows to get information about the certain loan 
    function getLoanInfo(uint _loanId)external view returns (
            uint amount,
            uint interest,
            uint duration,
            uint repaymentAmount,
            uint fundingDeadline,
            address borrower,
            address lender,
            bool active,
            bool repaid
        )
    {
        Loan storage loan = loans[_loanId];
        return (
            loan.amount,
            loan.interest,
            loan.duration,
            loan.repaymentAmount,
            loan.fundingDeadline,
            loan.borrower,
            loan.lender,
            loan.active,
            loan.repaid
        );
    }
    //this function allows you to withdraw your money that you get from loan creation to your wallet
    function withdrawFunds(uint _loanId) external onlyBorrower(_loanId) {
        Loan storage loan = loans[_loanId];
        require(loan.active == true);
        payable(msg.sender).transfer(loan.amount);
    }
}
