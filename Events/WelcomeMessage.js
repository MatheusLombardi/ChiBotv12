const { bot, defaultSettings } = require("../ChiBot");
const Discord = module.require("discord.js");
const Canvas = module.require("canvas");
const path = require('path');

const TextColor = '#FFFFFF';
const NameColor = '#FFFFFF';

const applyName = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px Roboto`;
    } while (ctx.measureText(text).width > canvas.width - 300);
    return ctx.font;
};;

bot.on("guildMemberAdd", async member => {

    const guildConf = await bot.settings.ensure(member.guild.id, defaultSettings);
    if (guildConf.shouldWelcome === 'false') return;

    const channel = member.guild.channels.cache.find(ch => ch.id === bot.settings.get(member.guild.id, "welcomeChannel"));

    if (!channel) return;

    const TopText = `Welcome to ${member.guild.name},`;

    const BottomText = `Please read our rules!`;

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(path.join(__dirname,`../DataStore/Welcome/background.png`));
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Top Text
    ctx.fillStyle = TextColor;
    ctx.font = '32px Roboto'
    ctx.fillStyle = TextColor;
    ctx.fillText("Welcome to the server,", canvas.width / 2.5, canvas.height / 2.8);

    //Bottom Text
    ctx.font = '32px Roboto'
    ctx.fillStyle = TextColor;
    ctx.fillText("Enjoy your stay!", canvas.width / 2.5, canvas.height / 1.25);

    // Name

    ctx.font = applyName(canvas, `${member.displayName}!`);
    ctx.fillStyle = NameColor;
    ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.65);

    //Shadow

    ctx.beginPath();
    ctx.arc(125, 125, 105, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = '#ffffff';
    ctx.fill()

    //Avatar Circle
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(attachment);
});