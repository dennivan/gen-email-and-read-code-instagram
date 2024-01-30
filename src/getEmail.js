const fs = require('fs');
const Mailjs = require("@cemalgnlts/mailjs");
const mailjs = new Mailjs();

function getEmailAsync() {
    return new Promise((resolve, reject) => {
        const emails = [];
        const promises = [];

        for (let i = 0; i < 6; i++) {
            const promise = mailjs.createOneAccount()
                .then(account => emails.push(account.data))
                .catch(error => reject(error));

            promises.push(promise);
        }

        Promise.all(promises)
            .then(() => resolve(emails))
            .catch(error => reject(error));
    });
}
async function main() {
    const emails = await getEmailAsync();
    fs.writeFileSync('accounts.json', JSON.stringify(emails));
    fs.readFile('accounts.json', 'utf8', (err, data) => {
        const accounts = JSON.parse(data);
        accounts.forEach((account, index) => {
            console.log(`Mail${index}:`, account.username);
        });
    });
}
main()