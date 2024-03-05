import fs from 'fs';

const logger = (message) => {
    console.log(message);
}

const copyFile = (instructionFilePath) => {
    fs.readFile(instructionFilePath, 'utf8', (err, data) => {
        if(err) {
            return logger("Soubor nelze přečíst nebo nebyl nalezen.");
        }
        const [inputFile, outPutFile] = data.trim().split(' '); /// cleanup whitespace from both ends and split by space
        fs.access(inputFile, (err) => {
            if(err) {
                return logger("Vstupní soubor neexistuje.");
            }
            fs.readFile(inputFile, 'utf8', (err, data) => {
                if(err) {
                    return logger("Vstupní soubor nelze přečíst.");
                }
                fs.writeFile(outPutFile, data, (err) => {
                    if(err) {
                        return logger("Výstupní soubor nelze zapsat.");
                    }
                    return logger("Soubor byl úspěšně zkopírován.");
                });
            });
        });
    })
}

const instructionFilePath = "./instrukce.txt";
copyFile(instructionFilePath);