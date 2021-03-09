const {request} = require("@octokit/request")
const csv = require('csv-parser');
const fs = require('fs');
const rows = [];

module.exports = (filename, data) => {
    fs.createReadStream(filename)
        .pipe(csv({separator:'\t'}))
        .on('data', async (row) => {
            try {
                rows.push(row);
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch (e) {
                console.log(e.message)
            }

        })
        .on('end', async () => {
            console.log('Done parsing. Submitting...');
            await submit(data, rows)
        });

}

const submit = async (data, rows) => {
    const failed = [];
    for (const row of rows) {
        try {
            await request(`POST /repos/${data.owner}/${data.repo}/issues`, {
                headers: {
                    authorization: `token ${data.token}`,
                },
                ...row,
                assignees: [...row.assignees.split(",")]
            })
            console.log(row)
        } catch (e) {
            failed.push(row);
            console.log("Failed to submit: ")
            console.log(row)
        }
    }
    console.log("Failed to submit the following:");
    console.log(failed);
}
