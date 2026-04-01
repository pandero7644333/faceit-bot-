const { REST, Routes } = require("discord.js");
const fs = require("fs");
const { token, clientId, guildId } = require("./src/config");

const commands = [];

for (const file of fs.readdirSync("./src/commands")) {
  const cmd = require(`./src/commands/${file}`);
  commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
  );

  console.log("✅ Komendy zdeployowane");
})();
