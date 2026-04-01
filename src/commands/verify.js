const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require("discord.js");

const db = require("../database");
const { generateCode } = require("../utils/code");

function extractSteamId(url) {
  const match = url.match(/(\d{17})/);
  return match ? match[1] : null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("zweryfikuj")
    .setDescription("Weryfikacja FACEIT")
    .addStringOption(opt =>
      opt.setName("steam")
        .setDescription("Link Steam")
        .setRequired(true)
    ),

  async execute(interaction) {

    const steam = interaction.options.getString("steam");
    const steamId = extractSteamId(steam);

    if (!steamId) {
      return interaction.reply({ content: "❌ Zły link Steam", ephemeral: true });
    }

    const code = generateCode();

    db.run(
      "INSERT INTO verifications (userId, steamId, code) VALUES (?, ?, ?)",
      [interaction.user.id, steamId, code]
    );

    const button = new ButtonBuilder()
      .setCustomId("verify_check")
      .setLabel("🔍 Sprawdź")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle("🔐 Weryfikacja FACEIT")
      .setDescription("Wklej kod do BIO Steam i kliknij sprawdź")
      .addFields({
        name: "Kod",
        value: `\`${code}\``
      });

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};
