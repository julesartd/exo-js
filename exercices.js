function startExo() {
    const exo = document.getElementById("exo").value;

    switch (exo) {
        case "1":
            exo1();
            break;
        case "2":
            exo2();
            break;
        case "3":
            exo3();
            break;
        case "fizzBuzz":
            fizzBuzz();
            break;
        default:
            console.log("Veuillez sélectionner un exercice valide.");
    }
}

function exo1() {
    let num1 = parseInt(prompt("Entrez le premier entier :"));
    if (isNaN(num1)) {
        alert("Veuillez saisir un entier valide.");
        return;
    }
    let num2 = parseInt(prompt("Entrez le deuxième entier :"));
    if (isNaN(num2)) {
        alert("Veuillez saisir un entier valide.");
        return;
    }

    if (num1 > num2) {
        console.log(`Le plus grand nombre est : ${num1}`);
    } else if (num2 > num1) {
        console.log(`Le plus grand nombre est : ${num2}`);
    } else {
        console.log("Les deux nombres sont égaux.");
    }
}

function exo2() {
    let num1 = parseInt(prompt("Entrez le premier entier :"));
    if (isNaN(num1)) {
        alert("Veuillez saisir un entier valide.");
        return;
    }
    let num2 = parseInt(prompt("Entrez le deuxième entier :"));
    if (isNaN(num2)) {
        alert("Veuillez saisir un entier valide.");
        return;
    }

    let produit = num1 * num2;
    if (produit > 0) {
        console.log("Le signe du produit est : +");
    } else if (produit < 0) {
        console.log("Le signe du produit est : -");
    } else {
        console.log("Le produit est zéro.");
    }
}

function exo3() {
    let num1 = parseInt(prompt("Entrez le premier entier :"));
    if (isNaN(num1)) {
        alert("Veuillez saisir un entier valide.");
        return;
    }
    let num2 = parseInt(prompt("Entrez le deuxième entier :"));
    if (isNaN(num2)) {
        alert("Veuillez saisir un entier valide.");
        return;
    }
    let num3 = parseInt(prompt("Entrez le troisième entier :"));
    if (isNaN(num3)) {
        alert("Veuillez saisir un entier valide.");
        return;
    }

    let nombres = [num1, num2, num3];
    nombres.sort((a, b) => a - b);

    console.log(`Les nombres triés sont : ${nombres.join(", ")}`);
}

function fizzBuzz() {
    for (let i = 1; i <= 100; i++) {
        if (i % 15 === 0) {
            console.log("FizzBuzz");
        } else if (i % 3 === 0) {
            console.log("Fizz");
        } else if (i % 5 === 0) {
            console.log("Buzz");
        } else if (i % 10 === 9) {
            console.log(nombreEnTexte(i));
        } else {
            console.log(i);
        }
    }
}

function nombreEnTexte(num) {
    const nombresEnTexte = {
        9: "neuf",
        19: "dix-neuf",
        29: "vingt-neuf",
        39: "trente-neuf",
        49: "quarante-neuf",
        59: "cinquante-neuf",
        69: "soixante-neuf",
        79: "soixante-dix-neuf",
        89: "quatre-vingt-neuf",
        99: "quatre-vingt-dix-neuf"
    };
    return nombresEnTexte[num];
}