
// require fs para el command handler
const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');

const { prefix, token } = require('./config.json');
// create a new Discord client
const client = new Discord.Client();


client.on("message", message => {

// Variable que permitirÃÂ¡ recibir mensajes al "dm"
  if (message.channel.type === "dm") {

//Embed personalizado que se enviarÃÂ
  message.client.channels.cache.get("757164659882328074").send({embed: {
      color: 3447003,   
      author: {
          name: message.client.user.username,
          icon_url: message.client.user.avatarURL()
      },
      title: "Mensaje Directo",
      description: `Mensaje enviado por <@${message.author.id}>`,
      fields: [{
          name: "Mensaje:",
          value: message.content
        }
      ],
      timestamp: new Date(),
      
    }}
)}
});


fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});


client.noprefixcommands = new Discord.Collection();

fs.readdir("./noprefixcommands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./noprefixcommands/${file}`);
    let noprefixcommandName = file.split(".")[0];
    client.noprefixcommands.set(noprefixcommandName, props);
  });
});



client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	client.user.setActivity(`pp!help | Connected to ${client.guilds.cache.size} servers and ${client.users.cache.size} users!`)
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
 console.log(`Listo, con ${client.users.cache.size} usuarios, en ${client.channels.cache.size} canales de ${client.guilds.cache.size} servidores.`); 
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	
	if (command.guildOnly && message.channel.type === 'dm') {
	return message.reply('I can\'t execute that command inside DMs!');
}
	
          if (command.args && !args.length) {
        	let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

            if (!cooldowns.has(command.name)) {
	           cooldowns.set(command.name, new Discord.Collection());
                }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

      if (timestamps.has(message.author.id)) {
	     const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	     if (now < expirationTime) {
		    const timeLeft = (expirationTime - now) / 1000;
	       	return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
				     
	      timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
}}
	
try {
	command.execute(message, args);
} catch (error) {
	console.error(error);
	message.reply('there was an error trying to execute that command!');
}
});



// login to Discord with your app's token
client.login(token);
