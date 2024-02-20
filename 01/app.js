const getRandomNumber = (min = 1, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const promptForNumber = (message = "Zadej nahodné celé čislo z intervalu 1 až 100", min = 1, max = 100) => {
    const input = prompt(message);
    if (input === null) {
        return null
    } // handle cancel button

    const number = parseInt(input);
    if (isNaN(number) || number < min || number > max) {
        return promptForNumber(number);
    }
    return number;
}

const guessing = (lastChance = false, randomNumber) => {
    const guessNumber = promptForNumber(lastChance ? "Nevadí máš ještě jeden pokus." : "Zadej nahodné celé čislo z intervalu 1 až 100");
    if (guessNumber === null) return;
    if (guessNumber === randomNumber) {
        return alert("Trefil jsi číslo, dneska si jdi vsadit do Tipsportu.")
    }
    if (!lastChance) {
        return guessing(true, randomNumber);
    }
    return alert(`Bohužel, správné číslo bylo ${randomNumber}`);

}

const init = () => {
    const randomNumber = getRandomNumber(1, 100);
    console.log(randomNumber); //comment in for testing
    guessing(false, randomNumber)
};

init();