const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const serverPing = require("minecraft-server-util");

module.exports = {
    name: "mcc",
    category: "Utility",
    description: "Check a Minecraft servers status.",
    usage: "ip:port",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        let serverip = message.content.slice(4).trim().split(":");
        const ip = serverip[0];
        const port = parseInt(serverip[1]);

        if (isNaN(port)) return message.reply("Please provide a proper port, that doesn't seem to be a number.");

        const serverCheck = await serverPing(ip, port);

        if (!serverCheck) return message.channel.send("Server failed to respond, Either offline or the provided ip and port are incorrect.");

        let Players;
        if (serverCheck.samplePlayers) {
            Players = serverCheck.samplePlayers.map(pl => pl.name).join('\n');
        } else {
            Players = "No players online."
        }

        let Forge;
        if (serverCheck.modList.filter(e => e.modid === 'forge')[0].version) {
            Forge = serverCheck.modList.filter(e => e.modid === 'forge')[0].version;
        } else {
            Forge = "Forge Mod Loader is not present on this server.";
        }

        let Version;
        if (serverCheck.modList.filter(e => e.modid === 'minecraft')[0].version) {
            Version = serverCheck.modList.filter(e => e.modid === 'minecraft')[0].version;
        } else {
            Version = "Not a standard Minecraft server, Possibly Spigot?";
        }

        const ServerEmbed = new Discord.MessageEmbed()
            .setTitle("__**Server Online**__")
            .setColor(config.bot_color)
            .addField("**Connection Info ›**", `${serverCheck.host}:${serverCheck.port}`)
            .addField("**Motd ›**", `${serverCheck.descriptionText}`, false)
            .addField("**Players ›**", `${Players}`, false)
            .addField("**Version ›**", `Minecraft: ${Version} | Forge: ${Forge}`, false)
            .addField("**Mod Count ›**", `${serverCheck.modList.length}`, true)

        message.channel.send({ embed: ServerEmbed });

    }
};