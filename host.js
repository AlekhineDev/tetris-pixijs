const { exec } = require("child_process");

var PORT= process.env.PORT || 9000
var command = "node node_modules/http-server/bin/http-server ./dist -p "+PORT

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

console.log("Hosted on localhost:"+PORT)