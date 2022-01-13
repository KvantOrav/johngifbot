const { Client, Intents, MessageEmbed, MessageAttachment} = require('discord.js');
const { Canvas } = require('skia-canvas')
require('dotenv').config();
const token = process.env.TOKEN;


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES], partials: ['CHANNEL'] });

client.once('ready', () => {
	console.log('Bot is ready!');
});

client.on('messageCreate', async (message) => {

	if (message.author.bot) return;

	if (message.content.startsWith("!link")) {
		const messageContents = message.content.split(" ").filter(n => n);
		const messageEmbeds = message.embeds;
		var title = messageContents[1];
		var description = "";
		var image = messageContents[2];

		if (!messageContents[2] && message.attachments.first()) {
			var image = message.attachments.first().url
		};

		if (!image) {
			await message.channel.send("You must provide 2 arguments: 1) link 2) an attachment, gif link or text.")
			return
		}

		if (messageEmbeds[0] && messageEmbeds[0].title) {
			var title = messageEmbeds[0].title;
			var description = messageEmbeds[0].description;
		};
		
		if (image.startsWith("http") && !image.includes(".gif")) {
			await message.channel.send("Gif link must be for the gif.")
			return
		}

		if (!image.startsWith("http")) {
			const txt = message.content.split(" ")
			var words = txt.slice(txt.indexOf(image))
			const canvas = new Canvas(400, 220)
			const ctx = canvas.getContext('2d')
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0, 400, 220);
			ctx.fillStyle = "#000000";
			ctx.font="30px Noto Color Emoji";
			var word = "";
			var a = 1;
			for (var i = 0; i < words.length; i++) {
				if (ctx.measureText(word).width + ctx.measureText(words[i]).width + ctx.measureText(" ").width < 400) {
					var word = word + words[i] + " "
				} else{
				ctx.fillText(word, 10, a*30)
				word = words[i] + " "
				var a = a+1
				}
			}

			ctx.fillText(word, 10, a*30)

			canvas.toBuffer("png").then(
				async function(value) {
					const File = new MessageAttachment()
					.setFile(value, "text.gif")

					var image = "attachment://text.gif"

					const Embed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(title)
					.setURL(messageContents[1])
					.setDescription(description)
					.setImage(image)
					.setTimestamp()
					.setFooter(message.author.tag);
			
					try{await message.channel.send({ embeds: [Embed], files: [File] });}
					catch(err){await message.channel.send("Improper link.") }
					return
				},
				function(error) { console.log(error) }
			  );
			  return
		};

		const Embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(title)
		.setURL(messageContents[1])
		.setDescription(description)
		.setImage(image)
		.setTimestamp()
		.setFooter(message.author.tag);
		try{await message.channel.send({ embeds: [Embed] });}
		catch(err){ await message.channel.send("Improper link.")	}
	};

});


client.login(token);