const fetchDonnees = () => 
    fetch('https://random-data-api.com/api/v2/users?size=10')
        .then(res => res.json());

const creerLigneTableau = (donnee) => `
    <tr class="border-b">
        <td class="p-2 border-r">${donnee.id}</td>
        <td class="p-2 border-r">${donnee.first_name} ${donnee.last_name}</td>
        <td class="p-2">${donnee.email}</td>
    </tr>
`;

const creerTableau = (donnees) => `
    <thead>
        <tr class="bg-gray-200">
            <th class="p-2 border-r">ID</th>
            <th class="p-2 border-r">Nom</th>
            <th class="p-2">Email</th>
        </tr>
    </thead>
    <tbody>
        ${donnees.map(creerLigneTableau).join('')}
    </tbody>
`;

const afficherTableau = (html) => {
    document.querySelector('table').innerHTML = html;
};

const tableauAvecLesDonnees = () => {
    fetchDonnees()
        .then(creerTableau)
        .then(afficherTableau);
};


tableauAvecLesDonnees();