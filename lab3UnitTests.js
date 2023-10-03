const Lending = artifacts.require("Lending");

contract("Lending", (accounts) => {
    const owner = accounts[0];
    const borrower = accounts[1];
    const lender = accounts[2];
    let lendingContract;

    before(async () => {
        lendingContract = await Lending.new({ from: owner });
    });

    describe("createLoan", () => {
        it("should create a new loan", async () => {
            const amount = web3.utils.toWei("1", "ether");
            const interest = 10;
            const duration = 30;

            const tx = await lendingContract.createLoan(amount, interest, duration, { from: borrower });

            // Check the LoanCreated event
            assert.equal(tx.logs[0].event, "LoanCreated");
            assert.equal(tx.logs[0].args.borrower, borrower);
        });

        it("should not create a loan with amount below 0.1 ETH", async () => {
            const amount = web3.utils.toWei("0.08", "ether"); // Below the MIN_LOAN_AMOUNT

            try {
                await lendingContract.createLoan(amount, 10, 30, { from: borrower });
                assert.fail("Expected an error but succeeded");
            } catch (error) {
                assert.include(error.message, "Loan amount must be between");
            }
        });

        it("should not create a loan with amount above 25 ETH", async () => {
            const amount = web3.utils.toWei("26", "ether"); // Above the MAX_LOAN_AMOUNT

            try {
                await lendingContract.createLoan(amount, 10, 30, { from: borrower });
                assert.fail("Expected an error but succeeded");
            } catch (error) {
                assert.include(error.message, "Loan amount must be between");
            }
        });

        it("should not create a loan with interest rate below 10% interest", async () => {
            const interest = 7; // Below the MIN_INTEREST_RATE

            try {
                await lendingContract.createLoan(web3.utils.toWei("1", "ether"), interest, 30, { from: borrower });
                assert.fail("Expected an error but succeeded");
            } catch (error) {
                assert.include(error.message, "Interest rate must be between");
            }
        });

        it("should not create a loan with interest rate above 50% interest rate", async () => {
            const interest = 55; // Above the MAX_INTEREST_RATE

            try {
                await lendingContract.createLoan(web3.utils.toWei("1", "ether"), interest, 30, { from: borrower });
                assert.fail("Expected an error but succeeded");
            } catch (error) {
                assert.include(error.message, "Interest rate must be between");
            }
        });

        it("should not create a loan with zero duration", async () => {
            try {
                await lendingContract.createLoan(web3.utils.toWei("1", "ether"), 10, 0, { from: borrower });
                assert.fail("Expected an error but succeeded");
            } catch (error) {
                assert.include(error.message, "Loan duration must be greater than 0");
            }
        });
    });

    describe("fundLoan", () => {
        it("should fund your loan fully", async () => {
            const loanId = 0;
            const amount = web3.utils.toWei("0.1", "ether");
            const tx = await lendingContract.fundLoan(loanId, { from: lender, value: amount });

            // Check the LoanFunded event
            assert.equal(tx.logs[0].event, "LoanFunded");
            assert.equal(tx.logs[0].args.funder, lender);
        });

        it("should not fund a loan with insufficient amount", async () => {
            const loanId = 0;
            const amount = web3.utils.toWei("0.09", "ether"); // Below the loan amount

            try {
                await lendingContract.fundLoan(loanId, { from: lender, value: amount });
                assert.fail("Expected an error but succeeded");
            } catch (error) {
                assert.include(error.message, "not enough");
            }
        });
    });

    describe("repayLoan", () => {
        it("should repay a loan", async () => {
            const loanId = 0;
            const repayAmount = web3.utils.toWei("0.1", "ether");
            const tx = await lendingContract.repayLoan(loanId, repayAmount, { from: borrower });

            // Check the LoanRepaid event
            assert.equal(tx.logs[0].event, "LoanRepaid");
            assert.equal(tx.logs[0].args.amount.toString(), repayAmount);
        });

        it("should not repay a loan with incorrect repayment amount", async () => {
            const loanId = 0;
            const repayAmount = web3.utils.toWei("0.09", "ether"); // Incorrect amount

            try {
                await lendingContract.repayLoan(loanId, repayAmount, { from: borrower });
                assert.fail("Expected an error but succeeded");
            } catch (error) {
                assert.include(error.message, "Incorrect repayment amount");
            }
        });
    });

    describe("getLoanInfo", () => {
        it("should get information about requested loan", async () => {
            const loanId = 0;
            const loanInfo = await lendingContract.getLoanInfo(loanId);

            assert.notEqual(loanInfo.amount, 0);
            assert.notEqual(loanInfo.interest, 0);
        });
    });

    describe("withdrawFunds", () => {
        it("should withdraw funds from loan to your account", async () => {
            const loanId = 0;
            const tx = await lendingContract.withdrawFunds(loanId, { from: borrower });

            // Check that funds were withdrawn
            assert.notEqual(tx.receipt.gasUsed, 0);
        });

        it("should not withdraw funds from an inactive loan", async () => {
            const loanId = 0;

            // Deactivate the loan
            await lendingContract.withdrawFunds(loanId, { from: borrower });

            try {
                await lendingContract.withdrawFunds(loanId, { from: borrower });
                assert.fail("Expected an error but succeeded");
            } catch (error) {
                assert.include(error.message, "reverted with reason");
            }
        });
    });
});
