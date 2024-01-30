const readline = require('readline');
const Mailjs = require("@cemalgnlts/mailjs");
const mailjs = new Mailjs();
const fs = require('fs');
const fileName = 'accounts.json';
let userEmail;
let userPassword;

async function main() {
    const loginResponse = await mailjs.login(userEmail, userPassword);
    const messages = await mailjs.getMessages();
    if (messages.status && messages.data.length > 0) {
        const firstMessageId = messages.data[0].id;
        console.log('Mail:', userEmail);
        const code = await mailjs.getMessage(firstMessageId);
        const text = code.data.text;
        const codePattern = /\b(\d{6})\b/;
        const match = text.match(codePattern);
        if (match) {
            const confirmationCode = match[1];
            console.log('Code:', confirmationCode);
            mailjs.deleteMessage(firstMessageId);
        } else {
            console.log('Mail:', userEmail, 'Chua nhan duoc ma.');
        }
    } else {
        console.log('Khong co tin nhan nao nhan duoc.');
    }
}

fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        console.log('Vui long getEmail truoc!');
        return;
    }

    const accounts = JSON.parse(data);
    accounts.forEach((account, index) => {
        userEmail = account.username;
        userPassword = account.password;
        main();
    });
});