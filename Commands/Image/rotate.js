const Discord = module.require("discord.js");
const Jimp = require('jimp');
const path = require('path');
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "rotate",
    category: "Image",
    description: "rotate banan",
    usage: "url angle",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        let image = args[0]
        let angle = parseInt(args[1])

        let regTest = RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g).test(image)
        if (regTest == false) return message.channel.send(`Sorry, That doesn't seem to be a proper image url.`);
        if (isNaN(angle)) return message.channel.send(`Sorry that doesnt seem to be a proper number.`);

        wait = await message.channel.send("Processing...");

        await Jimp.read(image)
            .then(img => {
                return img
                    .rotate(angle)
                    .write(path.join(__dirname, '../../DataStore/ImageManipulation/rotate.png'));
            })

        const attachment = new Discord.MessageAttachment(path.join(__dirname, '../../DataStore/ImageManipulation/rotate.png'), 'rotate.png');
        wait.delete();
        message.channel.send(attachment);
    }
};