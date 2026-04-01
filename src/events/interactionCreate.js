const db = require("../database");
const { getSteamBio } = require("../utils/steam");
const { getFaceitLevel } = require("../utils/faceit");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {

    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (cmd) cmd.execute(interaction);
    }

    if (!interaction.isButton()) return;

    if (interaction.customId !== "verify_check") return;

    db.get(
      "SELECT * FROM verifications WHERE userId = ?",
      [interaction.user.id],
      async (err, row) => {

        if (!row) {
          return interaction.reply({ content: "❌ Brak danych", ephemeral: true });
        }

        const bio = await getSteamBio(row.steamId);

        if (!bio.includes(row.code)) {
          return interaction.reply({
            content: "❌ Kod nie znaleziony w BIO Steam",
            ephemeral: true
          });
        }

        const level = await getFaceitLevel(row.steamId);

        if (!level) {
          return interaction.reply({ content: "❌ Brak FACEIT", ephemeral: true });
        }

        const member = await interaction.guild.members.fetch(interaction.user.id);

        // usuń stare role Level
        const roles = interaction.guild.roles.cache.filter(r =>
          r.name.startsWith("Level ")
        );

        for (const r of roles.values()) {
          if (member.roles.cache.has(r.id)) {
            await member.roles.remove(r);
          }
        }

        // nadaj nową rolę
        const role = interaction.guild.roles.cache.find(
          r => r.name === `Level ${level}`
        );

        if (role) await member.roles.add(role);

        interaction.reply({
          content: `✅ Zweryfikowano! Level FACEIT: ${level}`,
          ephemeral: true
        });
      }
    );
  }
};
