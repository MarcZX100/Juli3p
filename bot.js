
// require fs para el command handler
const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');

const { prefix, token } = require('./config.json');
// create a new Discord client
const client = new Discord.Client();




fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

 
client.commands = new Discord.Collection();

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
	client.user.setActivity(`Hola soy Juliiii y estoy con mis  ${client.users.cache.size} amigos UwU`)
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
 console.log(`Listo, con ${client.users.cache.size} usuarios, en ${client.channels.cache.size} canales de ${client.guilds.cache.size} servidores.`); 
});



// login to Discord with your app's token
client.login(token);
