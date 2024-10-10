const axios = require('axios');
const readlineSync = require('readline-sync');

function getAddressInput() {
    return readlineSync.question("Veuillez saisir une adresse postale :\n");
}

async function fetchAddress(query) {
    try {
        const response = await axios.get('https://api-adresse.data.gouv.fr/search/', {
            params: {
                q: query,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function displayAddress(data) {
    if (data.features && data.features.length > 0) {
        const bestAddress = data.features.reduce((max, address) =>
            address.properties.score > max.properties.score ? address : max
        );

        const address = bestAddress.properties.label;
        console.log("L'adresse la plus probable est : ", address);
    } else {
        console.log('Aucune adresse trouvée.');
    }
}

async function main() {
    const query = getAddressInput();
    const data = await fetchAddress(query);
    displayAddress(data);
}

main().then(() => null);