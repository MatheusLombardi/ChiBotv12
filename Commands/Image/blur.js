const Discord = module.require("discord.js");
const Jimp = require('jimp');
const path = require('path');
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "blur",
    category: "Image",
    description: "Add Gaussian Blur to an image.",
    usage: "url blurr",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        let image = args[0]
        let blur = parseInt(args[1])

        let regTest = RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g).test(image)
        if (regTest == false) return message.channel.send(`Sorry, That doesn't seem to be a proper image url.`);
        if (isNaN(blur)) return message.channel.send(`Sorry that doesnt seem to be a proper number.`);

        let wait = await message.channel.send("Processing...");

        await Jimp.read(image)
            .then(img => {
                return img
                    .gaussian(blur)
                    .write(path.join(__dirname, '../../DataStore/ImageManipulation/blur.png'));
            })

        const attachment = new Discord.MessageAttachment(path.join(__dirname, '../../DataStore/ImageManipulation/blur.png'), 'blur.png');
        wait.delete();
        message.channel.send(attachment);
    }
};