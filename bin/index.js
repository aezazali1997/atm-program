#! /usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
const userId = "Aezaz-1";
let pin = 3456;
let tries = 3;
let balance = 1000;
let isVerified = false;
let exit = false;
const VerifyUser = async () => {
    let userEnteredId = "";
    let userEnteredPin = "";
    console.log(chalk.bgCyanBright("\n\t\t\t\t\tWelcome to our ATM\n"));
    await inquirer
        .prompt([
        {
            name: "userId",
            message: "Please enter your user id :",
            type: "input",
        },
    ])
        .then((answerId) => {
        userEnteredId = answerId.userId;
    });
    await inquirer
        .prompt([
        {
            name: "pin",
            message: "Enter the pin",
            type: "number",
        },
    ])
        .then((answerPin) => {
        userEnteredPin = answerPin.pin;
    });
    if (userEnteredId === userId && Number(userEnteredPin) === Number(pin)) {
        isVerified = true;
        exit = false;
    }
};
const balanceCheck = () => {
    console.log("\n\nBalance : " + chalk.greenBright(balance) + "\n\n");
};
const transferFunds = async () => {
    await inquirer
        .prompt([
        {
            type: "input",
            name: "amount",
            message: "Enter the amount to transfer:",
            validate: (value) => {
                const valid = !isNaN(parseFloat(value)) && parseFloat(value) > 0;
                return valid || "Please enter a valid amount";
            },
        },
        {
            type: "input",
            name: "recipient",
            message: "Enter the recipient account:",
            validate: (value) => {
                return value.length > 0 || "Please enter the recipient account";
            },
        },
    ])
        .then(async (answers) => {
        console.log(`Transferred amount: $${answers.amount} to ${answers.recipient}`);
        await confirmTransaction(Number(answers.amount), 1);
    });
};
const mainPage = async () => {
    while (!exit) {
        await inquirer
            .prompt([
            {
                name: "option",
                type: "list",
                message: "Choose the transaction",
                choices: [
                    "Withdraw Cash",
                    "Deposit Funds",
                    "Transfer Funds",
                    "Check Balance",
                    "Change Pin",
                    "Exit",
                ],
            },
        ])
            .then(async (answer) => {
            switch (answer.option) {
                case "Withdraw Cash":
                    await withdrawCash();
                    break;
                case "Deposit Funds":
                    await depositFunds();
                    break;
                case "Transfer Funds":
                    await transferFunds();
                    break;
                case "Check Balance": {
                    balanceCheck();
                    break;
                }
                case "Change Pin": {
                    tries = 3;
                    isVerified = false;
                    exit = true;
                    await inquirer
                        .prompt([
                        {
                            name: "newPin",
                            message: "Enter 4 digit PIN",
                            type: "number",
                        },
                    ])
                        .then((answer) => {
                        pin = Number(answer.newPin);
                        console.log(chalk.green("\nPin Changed Succesfully\n"));
                    });
                    break;
                }
                default:
                    exit = true;
                    break;
            }
        });
    }
};
const withdrawCash = async () => {
    await inquirer
        .prompt([
        {
            type: "input",
            name: "amount",
            message: "Enter the amount to withdraw:",
            validate: (value) => {
                const valid = !isNaN(parseFloat(value)) && parseFloat(value) > 0;
                return valid || "Please enter a valid amount";
            },
        },
    ])
        .then(async (answers) => {
        console.log(`Withdrawn amount: $${answers.amount}`);
        await confirmTransaction(Number(answers.amount), 2);
    });
};
const depositFunds = async () => {
    await inquirer
        .prompt([
        {
            type: "input",
            name: "amount",
            message: "Enter the amount to deposit:",
            validate: (value) => {
                const valid = !isNaN(parseFloat(value)) && parseFloat(value) > 0;
                return valid || "Please enter a valid amount";
            },
        },
    ])
        .then(async (answers) => {
        console.log(`Deposited amount: $${answers.amount}`);
        await confirmTransaction(Number(answers.amount), 3);
    });
};
const confirmTransaction = async (amount, type) => {
    let confirm = await inquirer.prompt([
        {
            type: "list",
            name: "confirmation",
            message: "Are you sure you want to confirm this transaction?",
            choices: ["Yes", "No"],
        },
    ]);
    if (confirm.confirmation === "Yes") {
        transactionSuccess(amount, type);
    }
    else {
        transactionFailure();
    }
};
const transactionSuccess = (amount, type) => {
    console.log(chalk.green("Transaction confirmed!"));
    exit = false;
    if (type !== 3) {
        balance -= amount;
    }
    else {
        balance += amount;
    }
};
const transactionFailure = () => {
    console.log(chalk.red("Transaction cancelled."));
};
const runApp = async () => {
    while (tries > 0 && !isVerified) {
        tries--;
        await VerifyUser();
        if (isVerified) {
            await mainPage();
        }
        else {
            console.log(chalk.red("Incorrect Data"));
        }
    }
    if (tries === 0 && !isVerified) {
        console.log(chalk.bgRed("Account Blocked: Contact Customer Service"));
    }
};
runApp();
