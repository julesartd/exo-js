const axios = require('axios');
const readlineSync = require('readline-sync');

let contacts = [];

function getContactInput() {
    const name = readlineSync.question("Veuillez saisir le nom du contact :\n");
    const address = readlineSync.question("Veuillez saisir l'adresse du contact :\n");
    return { name, address };
}

function findBestAddress(features) {
    return features.reduce((highest, feature) =>
        feature.properties.score > highest.properties.score ? feature : highest
    );
}

async function fetchCoordinates(address) {
    try {
        const response = await axios.get('https://api-adresse.data.gouv.fr/search/', {
            params: { q: address }
        });
        if (response.data.features && response.data.features.length > 0) {
            const bestAddress = findBestAddress(response.data.features);
            const coordinates = bestAddress.geometry.coordinates;
            return { latitude: coordinates[1], longitude: coordinates[0] };
        } else {
            console.log('Aucune coordonnée trouvée pour cette adresse.');
            return null;
        }
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
}

async function addContact() {
    const { name, address } = getContactInput();
    const coordinates = await fetchCoordinates(address);
    if (coordinates) {
        contacts.push({ name, address, ...coordinates });
        console.log('Contact ajouté avec succès.');
    }
}

async function main() {
    const numberOfContacts = readlineSync.questionInt("Combien de contacts souhaitez-vous ajouter ?\n");
    for (let i = 0; i < numberOfContacts; i++) {
        await addContact();
    }
    console.log('Carnet de contacts :', contacts);
}

main().then(() => console.log('Script terminé.'));