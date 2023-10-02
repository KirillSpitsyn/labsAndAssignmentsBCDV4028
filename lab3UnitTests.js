const Lending = artifacts.require("Lending");

contract("Lending", (accounts) => {
    let LendingInstance;
    const borrower = accounts[0];
    const lender = accounts[1];

    beforeEach(async () => {
        LendingInstance = await Lending.new();
    });

    it("should create a loan and emit LoanCreated event", async () => {
        const amount = web3.utils.toWei("1", "ether");
        const interest = 5;
        const duration = 30;

        const { logs } = await LendingInstance.createLoan(amount, interest, duration, { from: borrower });
        const loanInfo = await pLendingInstance.getLoanInfo(0);

        assert.equal(loanInfo.amount.toString(), amount.toString(), "Incorrect loan amount");
        assert.equal(loanInfo.interest.toNumber(), interest, "Incorrect interest rate");
        assert.equal(loanInfo.duration.toNumber(), duration, "Incorrect loan duration");
        assert.equal(loanInfo.borrower, borrower, "Incorrect borrower address");
        assert.equal(loanInfo.lender, "0x0000000000000000000000000000000000000000", "Lender should be uninitialized");
        assert.equal(loanInfo.active, true, "Loan should be active");
        assert.equal(loanInfo.repaid, false, "Loan should not be repaid");

        const log = logs[0];
        assert.equal(log.event, "LoanCreated", "Event not emitted");
        assert.equal(log.args.amount.toString(), amount.toString(), "Incorrect event amount");
        assert.equal(log.args.interest.toNumber(), interest, "Incorrect event interest rate");
        assert.equal(log.args.duration.toNumber(), duration, "Incorrect event duration");
        assert.equal(log.args.borrower, borrower, "Incorrect event borrower address");
        assert.equal(log.args.lender, "0x0000000000000000000000000000000000000000", "Event lender should be uninitialized");
    });

    it("should fund a loan and emit LoanFunded event", async () => {
        const amount = web3.utils.toWei("1", "ether");
        const loanId = 0;

        await LendingInstance.createLoan(amount, 5, 30, { from: borrower });
        const { logs } = await LendingInstance.fundLoan(loanId, { from: lender, value: amount });

        const loanInfo = await LendingInstance.getLoanInfo(loanId);

        assert.equal(loanInfo.lender, lender, "Incorrect lender address");
        assert.equal(loanInfo.active, false, "Loan should not be active after funding");

        const log = logs[0];
        assert.equal(log.event, "LoanFunded", "Event not emitted");
        assert.equal(log.args.loanId.toNumber(), loanId, "Incorrect event loanId");
        assert.equal(log.args.funder, lender, "Incorrect event funder address");
        assert.equal(log.args.amount.toString(), amount.toString(), "Incorrect event amount");
    });

    it("should repay a loan and emit LoanRepaid event", async () => {
        const amount = web3.utils.toWei("1", "ether");
        const loanId = 0;

        await LendingInstance.createLoan(amount, 5, 30, { from: borrower });
        await LendingInstance.fundLoan(loanId, { from: lender, value: amount });

        const { logs } = await LendingInstance.repayLoan(loanId, { from: borrower, value: amount });

        const loanInfo = await LendingInstance.getLoanInfo(loanId);

        assert.equal(loanInfo.repaid, true, "Loan should be marked as repaid");
        assert.equal(loanInfo.active, false, "Loan should not be active after repayment");

        const log = logs[0];
        assert.equal(log.event, "LoanRepaid", "Event not emitted");
        assert.equal(log.args.loanId.toNumber(), loanId, "Incorrect event loanId");
        assert.equal(log.args.amount.toString(), amount.toString(), "Incorrect event amount");
    });

    it("should not allow a borrower to fund their own loan", async () => {
        const amount = web3.utils.toWei("1", "ether");

        await LendingInstance.createLoan(amount, 5, 30, { from: borrower });

        try {
            await LendingInstance.fundLoan(0, { from: borrower, value: amount });
            assert.fail("Borrower should not be able to fund their own loan");
        } catch (error) {
            assert.include(error.message, "Borrower cannot fund their own loan");
        }
    });

    it("should not allow funding after the funding deadline", async () => {
        const amount = web3.utils.toWei("1", "ether");

        await LendingInstance.createLoan(amount, 5, 1, { from: borrower });

        // Wait for the funding deadline to pass
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            await LendingInstance.fundLoan(1, { from: lender, value: amount });
            assert.fail("Funding should not be allowed after the funding deadline");
        } catch (error) {
            assert.include(error.message, "Loan funding deadline has passed");
        }
    });

    it("should not allow repayment of incorrect amount", async () => {
        const amount = web3.utils.toWei("1", "ether");

        await LendingInstance.createLoan(amount, 5, 30, { from: borrower });
        await LendingInstance.fundLoan(0, { from: lender, value: amount });

        try {
            await LendingInstance.repayLoan(0, { from: borrower, value: web3.utils.toWei("1.10", "ether") });
            assert.fail("Repayment should not be allowed with incorrect amount");
        } catch (error) {
            assert.include(error.message, "Incorrect repayment amount");
        }
    });

    it("should allow a borrower to withdraw remaining funds after loan is not active", async () => {
        const amount = web3.utils.toWei("1", "ether");
        const loanId = 0;

        await LendingInstance.createLoan(amount, 5, 30, { from: borrower });
        await LendingInstance.fundLoan(loanId, { from: lender, value: amount });
        await LendingInstance.repayLoan(loanId, { from: borrower, value: amount });

        const balanceBeforeWithdrawal = await web3.eth.getBalance(borrower);

        await LendingInstance.withdrawFunds(loanId, { from: borrower });

        const balanceAfterWithdrawal = await web3.eth.getBalance(borrower);

        assert.isTrue(balanceAfterWithdrawal > balanceBefore
