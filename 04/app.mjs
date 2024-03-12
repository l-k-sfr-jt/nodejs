import http from 'http';
import path from 'path'
import chalk from "chalk";
import fs from 'fs/promises'


const PORT = 3000;

const server = http.createServer((req, res) => {

});


server.listen(PORT, () => {
    console.log(chalk.green(`Server listening at http://localhost:${PORT}`))
});
