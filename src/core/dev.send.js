// -----------------
// Global variables
// Err TAG: RS007??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const colors = require("./colors");
const {MessageEmbed} = require("discord.js");
const embed = new MessageEmbed();
const logger = require("./logger");
const error = require("./error");
const auth = require("./auth");

// ---------------------
// Send Data to Channel
// ---------------------

async function sendMessage (data)
{

   const owner = await data.message.guild.owner;
   const tag = `${owner.user.username}#${owner.user.discriminator}`;
   return data.message.channel.send({"embeds": [embed]}).
      // eslint-disable-next-line consistent-return
      catch((err) =>
      {

         if (err.code && err.code === error.perm || err.code === error.access)
         {

            // console.log("Error 50013");
            logger(
               "custom",
               {
                  "color": "ok",
                  "msg": `:exclamation: Write Permission Error - DS.js\n
                  Server: **${data.channel.guild.name || "Unknown"}** \n
                  Channel: **${data.channel.name || "Unknown"}**\n
                  Chan ID: **${data.channel.id || "Unknown"}**\n
                  Server ID: **${data.message.guild.id || data.message.sourceID || "Zycore Broke It Again"}**\n
                  Owner: **${owner || "Unknown"}**\n
                  Dscord Tag: **${tag || "Unknown"}**\n
                  The server owner has been notified. \n`
               }
            );
            const writeErr =
                  `:no_entry:  **${data.message.client.user.username}** does not have permission to write in your server **` +
                  `${data.channel.guild.name}**. Please fix.`;

            // -------------
            // Send message
            // -------------

            if (!owner)
            {

               return console.log(writeErr);

            }
            // console.log("DEBUG: Line 59 - Dev.Send.js");
            return owner.
               send(writeErr).
               catch((err) => console.log(
                  "error",
                  err,
                  "warning",
                  data.message.guild.name
               ));

         }

      });

}

// ---------------
// Command Header
// ---------------

// eslint-disable-next-line complexity
module.exports = function run (data)
{

   // ---------------------
   // Send Data to Channel
   // ---------------------

   if (data.message.isDev)
   {

      const devTag = `${data.message.author.username}#${data.message.author.discriminator}`;

      // console.log("DEBUG: Developer Override");
      try
      {

         setTimeout(() => data.message.delete(), auth.time.short);

      }
      catch (err)
      {

         console.log(
            "Bot Message Deleted Error 1, dev.send.js",
            err
         );

      }
      data.footer = {
         "text": "This message may self-destruct in one minute"
      };
      embed.
         setColor(colors.get(data.color)).
         setDescription(`Developer Identity confirmed: ${devTag}\n\n${data.text}`).
         setTimestamp().
         setFooter(data.footer);
      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }
   // console.log("DEBUG: Insufficient Permission");
   try
   {

      setTimeout(() => data.message.delete(), auth.time.short);

   }
   catch (err)
   {

      console.log(
         "Bot Message Deleted Error 2 dev.send.js",
         err
      );

   }
   data.text = ":cop:  This Command is for bot developers only.";
   data.footer = {
      "text": "This message may self-destruct in one minute"
   };
   embed.
      setColor(colors.get(data.color)).
      setDescription(data.text).
      setTimestamp().
      setFooter(data.footer);

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};
