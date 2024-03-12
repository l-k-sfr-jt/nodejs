import chalk from "chalk";
import http from "http";
import * as fs from "fs/promises";

const server = http.createServer(async (req, res) => {
    const path = req.url.slice(1);
    let fileName = "index.html"
    if(path === 'about.html') {
      fileName = path;
    }
    else if(path !== "") {
        fileName = "404.html"
    }
    const content = await fs.readFile(`./${fileName}`);
    res.writeHead(200, {'Content-Type': "text/html"});
    res.end(content);
});


server.listen(3000, () => {
    console.log(chalk.green("Starosta poslouchá"))
})