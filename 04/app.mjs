import http from 'http';
import path from 'path'
import chalk from "chalk";
import fs from 'fs/promises'

const PORT = 3000;
const READ = 'read';
const INCREMENT = 'increment';
const DECREMENT = 'decrement';
const FILENAME = 'counter.txt';
const FILE_PATH = path.join('public', FILENAME);
const INITVALUE = 0;

const readOrCreateFile = async () => {
    try {
        return await fs.readFile(FILE_PATH, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(FILE_PATH, INITVALUE.toString(), 'utf8');
            return INITVALUE;
        }
        return error
    }
}

const writeFile = async (action) => {
    try {
        const value = parseInt(await readOrCreateFile());
        if (action === INCREMENT) {
            return await fs.writeFile(FILE_PATH, (value + 1).toString(), 'utf8');
        } else if (action === DECREMENT) {
            return await fs.writeFile(FILE_PATH, (value - 1).toString(), 'utf8');
        }

    } catch (error) {
        console.log('Chyba při zapisu do souboru');
        throw new Error(error);
    }
};

const response = (res, status, message) => {
    res.writeHead(status, {'Content-Type': "text/html"});
    res.write(message);
    return res.end();
}

const server = http.createServer(async (req, res) => {
    const url = req.url.slice(1);
    if (url === READ) {
        try {
            return response(res, 200, (await readOrCreateFile()).toString());
        } catch (error) {
            return response(res, 500, '500 internal server error');
        }
    } else if (url === INCREMENT || url === DECREMENT) {
        try {
            await writeFile(url)
            return response(res, 200, 'OK');
        } catch (error) {
            return response(res, 500, '500 internal server error');
        }
    }
    return response(res, 404, '404 Not Found');
});


server.listen(PORT, () => {
    console.log(chalk.green(`Server listening at http://localhost:${PORT}`))
});
