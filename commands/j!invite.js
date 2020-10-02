exports.run = (client, message, args) => {
let inline = true 
 
   const status = {
           false: "No",
           true: "Yes"
         }

message.channel.send({embed: {
      color: 3447003,
      fields: [{
        {
          name: "Invitame a tu servidor :DD",
          value: `[**--Obama**](https://discord.com/api/oauth2/authorize?client_id=760113701419221032&permissions=8&scope=bot)`, inline
        }
      ],
      timestamp: new Date(),
      
    }
});

}
