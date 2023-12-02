import dbClient from "../db/connectDb.ts";

try {
    const usersToAnonymizeDCP = await dbClient.query(
        "SELECT * FROM users WHERE is_active = false AND unsubscribe_at < DATE_SUB(NOW(), INTERVAL 6 MONTH)"
    );

    // Anonymisation des données pour les utilisateurs
    for (const user of usersToAnonymizeDCP) {
        // Anonymisation des données sensibles
        user.firstName = "Anonymized";
        user.lastName = "Anonymized";
        user.email = `userAnonymized${user.id}@example.com`;

        // Mise à jour dans la base de données
        await dbClient.query(
            `UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE id = ?`,
            [user.firstName, user.lastName, user.email, user.id]
        );
    }

    console.log("Données anonymisées avec succès pour les utilisateurs inactifs");
} catch (error) {
    console.error("Erreur lors de l'anonymisation des données :", error);
} finally {
    await dbClient.close();
}

// Crontab : 0 3 * * * deno run --allow-net --allow-read crontab/anonymizeUsersDCP.ts
