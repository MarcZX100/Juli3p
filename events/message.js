module.exports = (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  const args = message.content.slice(0).trim().split(/ +/g);
  
  const command = args.shift().toLowerCase();
  // Grab the command data from the client.commands Enmap
  const cmd = client.noprefixcommands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd.run(client, message, args);
};
