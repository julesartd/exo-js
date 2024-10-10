// Fonction constructeur pour Mairie
function Mairie(name, isopen, averagewaitingtime, dayschedule) {
    this.name = name;
    this.isopen = isopen;
    this.averagewaitingtime = averagewaitingtime;
    this.dayschedule = JSON.parse(dayschedule);

    // Méthode pour calculer les minutes d'ouverture totales pour une journée
    this.tempsOuvertureJournee = function() {
        return this.dayschedule.reduce((total, schedule) => {
            const openTime = schedule.openingHour * 60 + schedule.openingMinute;
            const closeTime = schedule.closingHour * 60 + schedule.closingMinute;
            const openingDuration = closeTime - openTime;
            return total + openingDuration;
        }, 0);
    };
}

const extraireNomFr = (name) => {
    // Extraction de la valeur de "fr_FR"
    const match = name.match(/"fr_FR"\s*:\s*"([^"]+)"/);
    return match ? match[1] : name;
}

const fetchData = async () => {
    try {
        const response = await fetch('https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/duree-dattente-aux-mairies-en-temps-reel/records?limit=20');
        const data = await response.json();

        const mairies = data.results.map(mairie => {
            const nomFr = extraireNomFr(mairie.name);
            return new Mairie(
                nomFr,
                mairie.isopen,
                mairie.averagewaitingtime,
                mairie.dayschedule
            );
        });

        // Filtrage des mairies ouvertes
        const mairiesOuvertes = mairies.filter(mairie => mairie.isopen === 1);

        // Tri par temps d'attente, puis par nom en cas d'égalité
        mairiesOuvertes.sort((a, b) =>
            a.averagewaitingtime - b.averagewaitingtime || a.name.localeCompare(b.name)
        );

        // Calcul du temps d'ouverture global en minutes
        const tempsTotal = mairiesOuvertes.reduce((total, mairie) => {
            return total + mairie.tempsOuvertureJournee();
        }, 0);

        // Création du tableau HTML
        const tableHTML = `
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-2 border-r">Nom</th>
                    <th class="p-2 border-r">Temps d'attente (minutes)</th>
                    <th class="p-2">Temps d'ouverture (minutes)</th>
                </tr>
            </thead>
            <tbody>
                ${mairiesOuvertes.map(mairie => `
                    <tr class="border-b">
                        <td class="p-2 border-r">${mairie.name}</td>
                        <td class="p-2 border-r">${mairie.averagewaitingtime}</td>
                        <td class="p-2">${mairie.tempsOuvertureJournee()}</td>
                    </tr>
                `).join('')}
                <tr class="bg-gray-300">
                    <td class="p-2 border-r font-bold" colspan="2">Temps d'ouverture total</td>
                    <td class="p-2 font-bold">${tempsTotal}</td>
                </tr>
            </tbody>
        `;

        // Affichage du tableau
        document.querySelector('table').innerHTML = tableHTML;

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
};

