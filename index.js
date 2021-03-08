require("dotenv").config()
const createIssues = require('./createIssues');

const TOKEN     = process.env.TOKEN;
const owner     = process.env.OWNER;
const repo      = process.env.REPO;
const filename  = process.env.FILENAME

const data = {
    token: TOKEN,
    owner: owner,
    repo: repo
}

createIssues(filename, data);