const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const ms = require("ms");
const moment = require("moment");
const path = require('path');
const fs = require('fs');
let warns = JSON.parse(fs.readFileSync(path.join(__dirname, "../../DataStore/Warnings/", "./Warnings.json"), "utf8"));

module.exports = {
  name: "warn",
  category: "Moderation",
  description: "Warn a user.",
  usage: "<@user> <reason>",
  cooldown: "2",
  aliases: [],
  run: async (bot, message, args, guildWarn) => {

    message.delete();

    let lastWarning;

    if (!message.member.roles.cache.has(guildConf.ownerRole) || message.member.roles.cache.has(guildConf.adminRole) || message.member.roles.cache.has(guildConf.modRole)) return message.reply('Sorry, You can\'t use this command.').then(s => s.delete({ timeout: 20 * 1000 }));

    const warnee = (message.mentions.members.first() || message.guild.members.cache.get(args[0]));

    const sentence = args.join(" ");
    const spacing = sentence.split(" ");
    const final = spacing.slice(1).join(" ").split(" | ");

    if (!warnee) return message.channel.send('Specify a user.');
    if (!warns[warnee.guild.id]) { warns[warnee.guild.id] = {}; }
    if (!warns[warnee.guild.id][warnee.id]) {
      warns[warnee.guild.id][warnee.id] = {
        warnings: 0,
        username: "",
        userid: "",
        reasons: [],
        timestamp: ""
      };
    }
    warns[warnee.guild.id][warnee.id].warnings++;
    warns[warnee.guild.id][warnee.id].username = warnee.user.tag;
    warns[warnee.guild.id][warnee.id].userid = warnee.id;
    warns[warnee.guild.id][warnee.id].reasons.push(final.toString());
    warns[warnee.guild.id][warnee.id].timestamp = moment(Date.now()).format("MMMM Do YYYY, h:mm a");

    lastWarning = final.toString();

    fs.writeFileSync(path.join(__dirname, "../../DataStore/Warnings/", "./Warnings.json"), JSON.stringify(warns, null, 2), function (err) {
      if (err) console.log(err);
    });

    const warned = new Discord.MessageEmbed()
      .setTitle("__**Warned User**__")
      .setColor(config.error_color)
      .setDescription(`
      **User Warned›** ${warnee.displayName}
      **Warned By›** ${message.member.displayName}
      **Reason›** ${final.toString()}
      **Number of Warnings›** ${warns[warnee.guild.id][warnee.id].warnings}`);

    let punishment = "";
    let appeal = "";

    //Kick
    if (warns[warnee.guild.id][warnee.id].warnings == 3) {
      punishment = "24 hour kick";
      appeal = "Once 24 hours pass, you may contact a staff team member to ask for a reinvitation.";
      if (warnee.kickable) {
        warnee.kick()
      }
    }
    //TBan
    if (warns[warnee.guild.id][warnee.id].warnings == 4) {
      punishment = "7 day Ban";
      appeal = "Once the week is over, you may contact a staff team member to request a reinvitation, if you have learned your lesson.";
      if (warnee.bannable) {
        warnee.ban({
          days: 7,
          reason: `${lastWarning || "No Reason Provided"} | ${warns[warnee.guild.id][warnee.id].warnings} warnings.`
        })
      }
    }
    //PBan
    if (warns[warnee.guild.id][warnee.id].warnings >= 5) {
      punishment = "Permanent Ban";
      appeal = "Unfortunately we cannot trust you will learn from your mistakes, You will not be allowed an appeal.";
      if (warnee.bannable) {
        warnee.ban({
          days: 0,
          reason: `${lastWarning || "No Reason Provided"} | ${warns[warnee.guild.id][warnee.id].warnings} warnings.`
        })
      }
    }

    const punish = new Discord.MessageEmbed()
      .setColor(config.error_color)
      .setDescription(`
      **You have received warning** #${warns[warnee.guild.id][warnee.id].warnings}
      Reason for Warning: ${lastWarning || "No Reason Provided"}
      This means a ${punishment}
      ${appeal}
      `);

    if (warns[warnee.guild.id][warnee.id].warnings == 3 || warns[warnee.guild.id][warnee.id].warnings == 4 || warns[warnee.guild.id][warnee.id].warnings == 5) {
      warnee.send({ embed: punish });
    }

    message.channel.send({ embed: warned });

  }
}