const getRandomNUmber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const promptForNumber = () => {
    const input = prompt("Please enter a number:");
    const number = parseFloat(input);

    if (isNaN(number)) {
        return promptForNumber(); // Recursively call promptForNumber until a valid number is entered
    } else {
        return number;
    }
}

// Example usage
const userNumber = promptForNumber();
console.log("You entered:", userNumber);


const initialize = () => {
    const response = prompt("Vyber nahodne cislo");
    if (response === null) {
        return;
    }
};