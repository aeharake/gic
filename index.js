require("dotenv").config()
const {request} = require("@octokit/request")
const csv = require('csv-parser');
const fs = require('fs');

const TOKEN = process.env.TOKEN;
const user = process.env.OWNER;
const repo = process.env.REPO;

const data = {
    token: TOKEN,
    owner: user,
    repo: repo
}


const createIssues = (filename, data) => {
    fs.createReadStream(filename)
        .pipe(csv())
        .on('data', async (row) => {
            console.log(row);
            await request(`POST /repos/${data.owner}/${data.repo}/issues`, {
                headers: {
                    authorization: `token ${data.token}`,
                },
                title: row.title,
                body: row.body,
                assignees: [...row.assignees.split(",")]
            })
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });


}

createIssues("data.csv", data);