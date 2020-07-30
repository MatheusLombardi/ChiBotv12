const Discord = module.require("discord.js");
const Jimp = require('jimp');
const path = require('path');
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "invert",
    category: "Image",
    description: "invert an images colors",
    usage: "url",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        let image = args[0]

        let regTest = RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g).test(image)
        if (regTest == false) return message.channel.send(`Sorry, That doesn't seem to be a proper image url.`);

        wait = await message.channel.send("Processing...");

        await Jimp.read(image)
            .then(img => {
                return img
                    .invert()
                    .write(path.join(__dirname, '../../DataStore/ImageManipulation/invert.png'));
            })

        const attachment = new Discord.MessageAttachment(path.join(__dirname, '../../DataStore/ImageManipulation/invert.png'), 'invert.png');
        wait.delete();
        message.channel.send(attachment);
    }
};