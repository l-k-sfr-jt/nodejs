import fs from 'fs/promises';

const createFile = async (fileName, content) => {
    try {
        await fs.writeFile(fileName, content);
        console.log(`Soubor ${fileName} byl úspěšně vytvořen.`);
    } catch (error) {
        console.log(`Chyba při vytváření souboru ${fileName}`);
    }
};

const createFiles = async () => {
    try {
        const data = await fs.readFile("./instrukce.txt", "utf-8");
        const number = parseInt(data.trim());
        if (isNaN(number)) {
            return console.log("Obsah souboru instrukce.txt není platné číslo.");
        }
        const promises = [];
        for (let i = 0; i <= number; i++) {
            promises.push(createFile(`${i}.txt`, `Soubor ${i}`));
        }
        await Promise.all(promises);
        console.log("Všechny soubory byly vytvořeny.");
    } catch (error) {
        console.log("Chyba při čtení souboru instrukce nebo vytváření souborů");
    }
}

createFiles();