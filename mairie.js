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
            return total + (closeTime - openTime);
        }, 0);
    };
}

const extraireNomFr = (name) => {
    // Extraction de la valeur de "fr_FR"
    const match = name.match(/"fr_FR"\s*:\s*"([^"]+)"/);

    if (match) {
        nomFr= match[1];
    }
    return nomFr;
}


const fetchData = async () => {
    try {
        const response = await fetch('https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/duree-dattente-aux-mairies-en-temps-reel/records?limit=20');
        const data = await response.json();

        console.log(data);

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

        mairiesOuvertes.forEach(mairie => {
            console.log(`Nom: ${mairie.name}, Temps d'attente: ${mairie.averagewaitingtime} minutes`);
        });

        // Calcul du temps d'ouverture global en minutes
        const tempsTotal = mairiesOuvertes.reduce((total, mairie) => {
            return total + mairie.tempsOuvertureJournee();
        }, 0);

        console.log(`Temps d'ouverture global pour toutes les mairies : ${tempsTotal} minutes`); 
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
};

fetchData();