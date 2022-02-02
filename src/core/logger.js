// -----------------
// Global variables
// Err TAG: RS011??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
/* eslint-disable no-bitwise */
/* eslint-disable no-unused-vars */
const {MessageEmbed} = require("discord.js");
const discord = require("discord.js");
const auth = require("./auth");
const colors = require("./colors").get;
const spacer = "​                                                          ​";

// --------------------
// Log data to console
// --------------------

function devConsole (data)
{

   if (auth.debug && auth.debug === "1")
   {

      return console.log(data);

   }

}

// ------------
// Hook Sender
// ------------

function hookSend (data)
{

   const hsData = {
      "id": null,
      "token": null
   };
   const debugID = process.env.DISCORD_DEBUG_WEBHOOK_ID;
   const debugToken = process.env.DISCORD_DEBUG_WEBHOOK_TOKEN;

   if (!debugID || !debugToken || debugID === "YOUR WEBHOOK ID" || debugToken === "YOUR WEBHOOK TOKEN")
   {

      hsData.id = null;
      hsData.token = null;

   }
   else
   {

      hsData.id = process.env.DISCORD_DEBUG_WEBHOOK_ID;
      hsData.token = process.env.DISCORD_DEBUG_WEBHOOK_TOKEN;

   }


   const hook = new discord.WebhookClient(hsData);
   const embed = new MessageEmbed({
      "color": colors(data.color),
      "description": data.msg,
      "footer": data.footer,
      "title": data.title
   });

   if (hsData.id === null)
   {

      return;

   }

   return hook.send({"embeds": [embed]}).catch((err) =>
   {

      console.error(`ERROR: Logger.js - hookSend error:\n${err}`);

   });


}

function activityHookSend (data)
{

   const ahsData = {
      "id": null,
      "token": null
   };
   const activityID = process.env.DISCORD_ACTIVITY_WEBHOOK_ID;
   const activityToken = process.env.DISCORD_ACTIVITY_WEBHOOK_TOKEN;

   if (!activityID || !activityToken || activityID === "YOUR WEBHOOK ID" || activityToken === "YOUR WEBHOOK TOKEN")
   {

      ahsData.id = process.env.DISCORD_DEBUG_WEBHOOK_ID;
      ahsData.token = process.env.DISCORD_DEBUG_WEBHOOK_TOKEN;

   }
   else
   {

      ahsData.id = process.env.DISCORD_ACTIVITY_WEBHOOK_ID;
      ahsData.token = process.env.DISCORD_ACTIVITY_WEBHOOK_TOKEN;

   }

   const hook = new discord.WebhookClient(ahsData);

   const embed = new MessageEmbed({
      "color": colors(data.color),
      "description": data.msg,
      "footer": data.footer,
      "title": data.title
   });

   if (ahsData.id === null)
   {

      return;

   }
   return hook.send({"embeds": [embed]}).catch((err) =>
   {

      console.error(`ERROR: Logger.js - activityHookSend error:\n${err}`);

   });

}

// -------------
// Error Logger
// -------------

function errorLog (error, subtype, id)
{

   let errorTitle = null;

   const errorTypes = {
      "api": ":boom:  External API Error",
      "command": ":chains: Command Error",
      "db": ":outbox_tray:  Database Error",
      "discord": ":notepad_spiral: DiscordAPIError: Unknown Message",
      "dm": ":skull_crossbones:  Discord - user.createDM",
      "edit": ":crayon:  Discord - message.edit",
      "fetch": ":no_pedestrians:  Discord - client.users.fetch",
      "presence": ":loudspeaker:  Discord - client.setPresence",
      "react": ":anger:  Discord - message.react",
      "send": ":postbox:  Discord - send",
      "shardFetch": ":pager:  Discord - shard.fetchClientValues",
      "typing": ":keyboard:  Discord - channel.startTyping",
      "uncaught": ":japanese_goblin:  Uncaught Exception",
      "unhandled": ":japanese_ogre:  Unhandled promise rejection",
      "warning": ":exclamation:  Process Warning"
   };

   // If (errorTypes.hasOwnProperty(subtype))
   if (Object.prototype.hasOwnProperty.call(
      errorTypes,
      subtype
   ))
   {

      errorTitle = errorTypes[subtype];

   }


   if (errorTypes[subtype] === ":japanese_ogre:  Unhandled promise rejection")
   {

      return;
      // console.log(`----------------------------------------\nError ${errorTitle} Suppressed\n${error.stack}`);

   }

   // console.log(`----------------------------------------\nError ${errorTitle} Suppressed\n${error.stack}`);

   hookSend({
      "color": "err",
      // eslint-disable-next-line no-useless-concat
      "msg": `\`\`\`json\n${error.toString()}\n${error.stack}\n\n` + `Error originated from server: ${id}\`\`\``,
      "title": errorTitle
   });


}

// ----------------
// Warnings Logger
// ----------------

function warnLog (warning)
{

   hookSend({
      "color": "warn",
      "msg": warning
   });

}

// ---------------
// Guild Join Log
// ---------------

function logJoin (guild, owner)
{

   // const owner = await guild.fetchOwner();
   if (owner)
   {

      activityHookSend({
         "color": "ok",
         "msg":
         `${`:white_check_mark:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n@${owner.user.username}#${owner.user.discriminator}\n${guild.memberCount} members\n\`\`\`${spacer}${spacer}`,
         "title": "Joined Guild"


      });
      // console.log(`----------------------------------------\nGuild Join: ${guild.name}\nGuild ID: ${guild.id}\nGuild Owner: ${owner.user.username}#${owner.user.discriminator}\nSize: ${guild.memberCount}\n----------------------------------------`);

   }
   else
   {

      activityHookSend({
         "color": "ok",
         "msg":
         `${`:white_check_mark:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n${guild.memberCount} members\n\`\`\`${spacer}${spacer}`,
         "title": "Joined Guild"

      });
      // console.log(`----------------------------------------\nGuild Join: ${guild.name}\nGuild ID: ${guild.id}\nSize: ${guild.memberCount}\n----------------------------------------`);

   }

}

// ----------------
// Guild Leave Log
// ----------------

function logLeave (guild, owner)
{

   if (owner)
   {

      activityHookSend({
         "color": "warn",
         "msg":
         `${`:regional_indicator_x:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n@${owner.user.username}#${owner.user.discriminator}\n${guild.memberCount} members\n\`\`\`${spacer}${spacer}`,
         "title": "Left Guild"
      });
      // console.log(`----------------------------------------\nGuild Left: ${guild.name}\nGuild ID: ${guild.id}\nGuild Owner: ${owner.user.username}#${owner.user.discriminator}\nSize: ${guild.memberCount}\n----------------------------------------`);

   }
   else
   {

      activityHookSend({
         "color": "warn",
         "msg":
         `${`:regional_indicator_x:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n${guild.memberCount} members\n\`\`\`${spacer}${spacer}`,
         "title": "Left Guild"
      });
      // console.log(`----------------------------------------\nGuild Left: ${guild.name}\nGuild ID: ${guild.id}\nSize: ${guild.memberCount}\n----------------------------------------`);

   }

}

// ------------
// Logger code
// ------------

// eslint-disable-next-line default-param-last
module.exports = function run (type, data, subtype = null, id)
{

   if (process.env.DISCORD_DEBUG_WEBHOOK_ID === undefined)
   {

      return;

   }
   const logTypes = {
      "activity": activityHookSend,
      "custom": hookSend,
      "dev": devConsole,
      "error": errorLog,
      "guildJoin": logJoin,
      "guildLeave": logLeave,
      "warn": warnLog
   };

   // If (logTypes.hasOwnProperty(type))
   if (Object.prototype.hasOwnProperty.call(
      logTypes,
      type
   ))
   {

      if (data.message !== undefined)
      {

         if (data.message.guild !== undefined)

         {

            // console.log("DEBUG: Has guild");
            const id = data.message.guild.name;
            return logTypes[type](
               data,
               subtype,
               id
            );

         }

         // console.log("DEBUG: Has Message");

      }

      // console.log("DEBUG: Has");

      return logTypes[type](
         data,
         subtype,
         id
      );

   }

};
