const {request} = require("@octokit/request")
const csv = require('csv-parser');
const fs = require('fs');

module.exports = (filename, data) => {
    fs.createReadStream(filename)
        .pipe(csv())
        .on('data', async (row) => {
            console.log(row);
            await request(`POST /repos/${data.owner}/${data.repo}/issues`, {
                headers: {
                    authorization: `token ${data.token}`,
                },
                ...row,
                assignees: [...row.assignees.split(",")]
            })
        })
        .on('end', () => {
            console.log('Done');
        });
}
