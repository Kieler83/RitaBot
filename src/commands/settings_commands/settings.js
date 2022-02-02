/* eslint-disable sort-keys */
// -----------------
// Global variables
// Err TAG: RC307??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");
const fs = require("fs");
const path = require("path");
const auth = require("../../core/auth");

// -------------------
// Available Settings
// -------------------

function getSettings (data)
{

   // ----------------------------
   // Set default server language
   // ----------------------------

   function setLang (data)
   {

      // ---------------------------
      // Error for invalid language
      // ---------------------------

      if (data.cmd.to.valid.length !== 1)
      {

         data.color = "error";
         data.text = ":warning:  Please specify 1 valid language.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // ------------------------
      // Error for same language
      // ------------------------

      if (data.cmd.server && data.cmd.to.valid[0].iso === data.cmd.server.lang)
      {

         data.color = "info";
         data.text =
            `:information_source:  **\`${
               data.cmd.to.valid[0].name}\`** is the current default ` +
            `languange of this server. To change:\n\`\`\`md\n# Example\n${
               data.config.translateCmd} settings setLang to french\n\`\`\``;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // ----------------
      // Update database
      // ----------------

      return db.updateServerTable(
         data.message.channel.guild.id,
         "lang",
         data.cmd.to.valid[0].iso,
         function error (err)
         {

            if (err)
            {

               return logger(
                  "error",
                  err,
                  "db",
                  data.message.channel.guild.name
               );

            }
            data.color = "ok";
            data.text =
               `Default language for server has been changed to **\`${
                  data.cmd.to.valid[0].name}\`**.`;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
      );

   }

   // -------------
   // List Servers
   // -------------

   function listServers (data)
   {

      if (data.message.isDev)
      {

         data.text = "Active Servers - ";

         const activeGuilds = Array.from(data.message.client.guilds._cache);

         data.text += `${activeGuilds.length}\n\n`;

         activeGuilds.forEach((guild) =>
         {

            data.text += `Name: ${guild[1].name}\nID: ${guild[1].id}\nUsers: ${guild[1].memberCount}\n`;
            if (guild[1].ownerId)
            {

               data.text += `Owner ID: ${guild[1].ownerId}\n\n`;


            }
            else
            {

               data.text += "\n";

            }

         });

         // ------------------
         // Send message/file
         // ------------------
         try
         {

            setTimeout(() => data.message.delete(), auth.time.short);

         }
         catch (err)
         {

            console.log(
               "Command Message Deleted Error, settings.js = Line 157",
               err
            );

         }
         fs.writeFileSync(
            path.resolve(
               __dirname,
               "../../files/serverlist.txt"
            ),
            data.text
         );
         // let attachments = Array.from(data.attachments.values());
         data.message.channel.send("Server List");
         data.message.channel.send({"files": ["./src/files/serverlist.txt"]});

      }
      else
      {

         data.text = ":cop:  This Command is for bot developers only.";
         return sendMessage(data);

      }

   }

   // -----------
   // List Users
   // -----------

   async function listUsers (data)
   {

      if (data.message.isDev)
      {

         data.text = "Users - ";


         const serverId = data.cmd.num;
         const target = data.message.client.guilds.cache.get(serverId);
         const members = await target.members.fetch();
         const activeMembers = Array.from(members);

         data.text += `${activeMembers.length}\n\n`;

         activeMembers.forEach((member) =>
         {

            data.text += `ID: ${member[1].id}\n`;

         });

         // ------------------
         // Send message/file
         // ------------------
         try
         {

            setTimeout(() => data.message.delete(), auth.time.short);

         }
         catch (err)
         {

            console.log(
               "Command Message Deleted Error, settings.js = Line 157",
               err
            );

         }
         fs.writeFileSync(
            path.resolve(
               __dirname,
               "../../files/userlist.txt"
            ),
            data.text
         );
         // let attachments = Array.from(data.attachments.values());
         data.message.channel.send("User List");
         data.message.channel.send({"files": ["./src/files/userlist.txt"]});

      }
      else
      {

         data.text = ":cop:  This Command is for bot developers only.";
         return sendMessage(data);

      }

   }

   // --------------------
   // Command Persistence
   // --------------------

   async function setMenuPersistence (data)
   {

      const menuPersistVariable = data.cmd.params.split(" ")[1].toLowerCase();
      let value = false;
      if (menuPersistVariable === "on" || menuPersistVariable === "off")
      {

         if (menuPersistVariable === "on")
         {

            value = true;

         }

         // console.log(`DEBUG: embed variable ${menuPersistVariable}`);
         await db.updateServerTable(
            data.message.channel.guild.id,
            "menupersist",
            value,
            function error (err)
            {

               if (err)
               {

                  return logger(
                     "error",
                     err,
                     "command",
                     data.message.channel.guild.name
                  );

               }
               const output =
            "**```Updated Help Menu Persist Settings```**\n" +
            `Persist Command Messages = ${menuPersistVariable}\n\n`;
               data.color = "info";
               data.text = output;

               // -------------
               // Send message
               // -------------

               return sendMessage(data);

            }
         );

      }
      else
      {

         data.color = "error";
         data.text =
      `:warning:  **\`${menuPersistVariable
      }\`** is not a valid menupersist option.\n`;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

   }

   // ------------------
   // React Persistence
   // ------------------

   async function setReactPersistence (data)
   {

      const reactPersistVariable = data.cmd.params.split(" ")[1].toLowerCase();
      let value = false;
      if (reactPersistVariable === "on" || reactPersistVariable === "off")
      {

         if (reactPersistVariable === "on")
         {

            value = true;

         }

         // console.log(`DEBUG: embed variable ${reactPersistVariable}`);
         await db.updateServerTable(
            data.message.channel.guild.id,
            "reactpersist",
            value,
            function error (err)
            {

               if (err)
               {

                  return logger(
                     "error",
                     err,
                     "command",
                     data.message.channel.guild.name
                  );

               }
               const output =
            "**```Updated Reaction Translation Persist Settings```**\n" +
            `React Persist = ${reactPersistVariable}\n\n`;
               data.color = "info";
               data.text = output;

               // -------------
               // Send message
               // -------------

               return sendMessage(data);

            }
         );

      }
      else
      {

         data.color = "error";
         data.text =
      `:warning:  **\`${reactPersistVariable
      }\`** is not a valid reactpersist option.\n`;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

   }

   // -----------------
   // Flag Persistence
   // -----------------

   async function setFlagPersistence (data)
   {

      const flagPersistVariable = data.cmd.params.split(" ")[1].toLowerCase();
      let value = false;
      if (flagPersistVariable === "on" || flagPersistVariable === "off")
      {

         if (flagPersistVariable === "on")
         {

            value = true;

         }

         // console.log(`DEBUG: embed variable ${flagPersistVariable}`);
         await db.updateServerTable(
            data.message.channel.guild.id,
            "flagpersist",
            value,
            function error (err)
            {

               if (err)
               {

                  return logger(
                     "error",
                     err,
                     "command",
                     data.message.channel.guild.name
                  );

               }
               const output =
            "**```Updated Flag Emoji Persist Settings```**\n" +
            `Flag Persist = ${flagPersistVariable}\n\n`;
               data.color = "info";
               data.text = output;

               // -------------
               // Send message
               // -------------

               return sendMessage(data);

            }
         );

      }
      else
      {

         data.color = "error";
         data.text =
      `:warning:  **\`${flagPersistVariable
      }\`** is not a valid flagpersist option.\n`;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

   }

   // ------------
   // Server Tags
   // ------------

   async function serverTags (data)
   {

      const serverTagsVariable = data.cmd.params.split(" ")[1].toLowerCase();
      let value = "none";
      if (serverTagsVariable === "none" || serverTagsVariable === "everyone" || serverTagsVariable === "all")
      {

         if (serverTagsVariable === "everyone")
         {

            value = "everyone";

         }

         if (serverTagsVariable === "all")
         {

            value = "all";

         }

         // console.log(`DEBUG: embed variable ${serverTags}`);
         await db.updateServerTable(
            data.message.channel.guild.id,
            "servertags",
            value,
            function error (err)
            {

               if (err)
               {

                  return logger(
                     "error",
                     err,
                     "command",
                     data.message.channel.guild.name
                  );

               }
               const output =
            "**```Updated Server Tag Settings```**\n" +
            `Server Tags = ${serverTagsVariable}\n\n`;
               data.color = "info";
               data.text = output;

               // -------------
               // Send message
               // -------------

               return sendMessage(data);

            }
         );

      }
      else
      {

         data.color = "error";
         data.text =
      `:warning:  **\`${serverTagsVariable
      }\`** is not a valid serverTags option.\n`;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

   }

   // ----------------
   // Profanity Fliter
   // ----------------

   async function profanity (data)
   {

      const badWordsVariable = data.cmd.params.split(" ")[1].toLowerCase();
      let value = false;
      if (badWordsVariable === "off" || badWordsVariable === "replace" || badWordsVariable === "delete")
      {

         if (badWordsVariable === "replace")
         {

            value = "replace";

         }

         if (badWordsVariable === "delete")
         {

            value = "delete";

         }

         // console.log(`DEBUG: embed variable ${flagPersistVariable}`);
         await db.updateServerTable(
            data.message.channel.guild.id,
            "badwords",
            value,
            function error (err)
            {

               if (err)
               {

                  return logger(
                     "error",
                     err,
                     "command",
                     data.message.channel.guild.name
                  );

               }
               const output =
            "**```Updated Bad word Detection Settings```**\n" +
            `Bad Words filter = ${badWordsVariable}\n\n`;
               data.color = "info";
               data.text = output;

               // -------------
               // Send message
               // -------------

               return sendMessage(data);

            }
         );

      }
      else
      {

         data.color = "error";
         data.text =
      `:warning:  **\`${badWordsVariable
      }\`** is not a valid Bad Words filter option.\n`;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

   }

   // ------------
   // Lang Detect
   // ------------

   async function langDetect (data)
   {

      const landDetectVariable = data.cmd.params.split(" ")[1].toLowerCase();
      let value = false;
      if (landDetectVariable === "on" || landDetectVariable === "off")
      {

         if (landDetectVariable === "on")
         {

            value = true;

         }

         // console.log(`DEBUG: embed variable ${flagPersistVariable}`);
         await db.updateServerTable(
            data.message.channel.guild.id,
            "langdetect",
            value,
            function error (err)
            {

               if (err)
               {

                  return logger(
                     "error",
                     err,
                     "command",
                     data.message.channel.guild.name
                  );

               }
               const output =
            "**```Updated Language Detection Settings```**\n" +
            `Language Detection = ${landDetectVariable}\n\n`;
               data.color = "info";
               data.text = output;

               // -------------
               // Send message
               // -------------

               return sendMessage(data);

            }
         );

      }
      else
      {

         data.color = "error";
         data.text =
      `:warning:  **\`${landDetectVariable
      }\`** is not a valid langdetect option.\n`;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

   }

   // ---------------
   // settings Reset
   // ---------------

   function reset (data)
   {

      // const target = data.message.client.guilds.cache.get(serverId);

      Override: if (!data.message.isOwner)
      {

         if (data.message.isDev)
         {

            // console.log("DEBUG: Developer ID Confirmed");
            break Override;

         }

         data.text = ":cop:  This Command is for bot Developers and Onwers only.\n";
         return sendMessage(data);

      }

      if (data.cmd.params && data.cmd.params.toLowerCase().includes("server"))
      {

         const serverId = data.cmd.num;
         const target = data.message.client.guilds.cache.get(serverId);

         if (serverId)
         {

            if (!data.message.isDev)
            {

               // console.log("DEBUG: Developer ID Confirmed");
               data.color = "warning";
               data.text = ":cop:  This Command is for bot Developers Only.\n";
               return sendMessage(data);

            }
            if (!target)
            {

               data.color = "error";
               data.text = `\`\`\`${serverId} is not registered in the database.\n\n\`\`\``;
               return sendMessage(data);


            }
            return resetTarget(serverId, data);

         }

         // -------------
         // Send message
         // -------------

         data.color = "error";
         data.text = `\`\`\`You are missing a Server ID, Please try again.\n\n\`\`\``;
         return sendMessage(data);


      }
      return resetTarget(data.message.channel.guild.id, data);

   }

   async function resetTarget (serverId, data)
   {

      const filter = (m) => m.author.id === data.message.author.id;
      // resetClean(data, 1);

      await data.message.channel.send(`Please confirm you wish to reset all Server Settings to defaults`).then(() =>
      {

         data.message.channel.awaitMessages({
            filter,
            "errors": ["time"],
            "max": 1,
            "time": auth.time.long
         }).
            then((message) =>
            {

               let responce = null;
               let responceLower = null;
               responce = message.first();
               responceLower = responce.content.toLowerCase();
               if (responceLower === "yes" || responceLower === "y")
               {

                  resetConfirmed(serverId, data);
                  resetClean(data, 2);

               }
               else if (responceLower === "no" || responceLower === "n")
               {

                  data.message.channel.send(`Command Terminated`);
                  resetClean(data, 2);

               }
               else
               {

                  data.message.channel.send(`Command Terminated: Invalid Response`);
                  resetClean(data, 2);

               }

            }).
            catch((collected) =>
            {

               data.message.channel.send(`No Responce Provided Or Error:`);
               try
               {

                  resetClean(data, 1);

               }
               catch (err)
               {

                  console.log(
                     "Bot Message Deleted Error, settings.js",
                     err
                  );

               }

            });

      });

   }

   async function resetConfirmed (value, data)
   {

      await db.updatePrefix(
         value,
         // This would be the new prefix
         "!tr",
         function error (err)
         {

            if (err)
            {

               return logger(
                  "error",
                  err,
                  "command",
                  data.message.channel.guild.name
               );

            }

         }
      );
      await db.reset(
         data.message.channel.guild.id,
         function error (err)
         {

            if (err)
            {

               return logger(
                  "error",
                  err,
                  "command",
                  data.message.channel.guild.name
               );

            }
            const output =
         "**```All Server Settings Reset```**" +
         "```md\n" +
               `* Allow Annocement Messages: True\n` +
               `* Embedded Message Style: On\n` +
               `* Language Detection: False\n` +
               `* Bot to Bot Translation Status: Off\n` +
               `* Server Tags status: None\n` +
               `* Translation by Flag Reactions: True\n` +
               `* Help Menu Persistance: False\n` +
               `* React Translation Persistance: Flase\n` +
               `* React Emoji Persistance: Flase\n` +
               `* Webhook Debug Active State: Flase\n\n` +
               "```";
            data.color = "info";
            data.text = output;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
      );

   }

   function resetClean (data, value)
   {

      const messageManager = data.channel.messages;
      messageManager.fetch({"limit": value}).then((messages) =>
      {

         // `messages` is a Collection of Message objects
         messages.forEach((message) =>
         {

            message.delete();

         });

      });

   }

   // -------
   // Owners
   // -------

   function ownerUpdate (data)
   {

      if (data.message.isDev)
      {

         let i = 0;
         const guilds = Array.from(data.message.client.guilds._cache);

         const wait = setInterval(async function delay ()

         {

            const guild = guilds.shift();

            i += 1;
            if (guild === undefined)
            {

               console.log(`Done all servers`);
               clearInterval(wait);

            }
            else if (guild[1].ownerId)
            {

               const owner = await guild[1].fetchOwner();
               const target = guild[1].id;

               if (!target)
               {

                  // eslint-disable-next-line no-useless-return
                  return;

               }

               db.updateServerTable(
                  target,
                  "owner",
                  `${owner.user.username}#${owner.user.discriminator}`,
                  function error (err)
                  {

                     if (err)
                     {

                        return console.log(`DEBUG: Unable to save owner details to DB on Owner Command`);

                     }

                  },
                  console.log(`Owner Task ${i} - Server Owner Added for guild: ${target}`)
               );


            }

         }, 2000);

      }
      else
      {

         data.text = ":cop:  This Command is for bot developers only.";
         return sendMessage(data);

      }

   }

   // ------------
   // Server Name
   // ------------

   function serverUpdate (data)
   {

      if (data.message.isDev)
      {

         let i = 0;
         const guilds = Array.from(data.message.client.guilds._cache);

         const wait = setInterval(async function delay ()

         {

            const guild = guilds.shift();

            i += 1;
            if (guild === undefined)
            {

               console.log(`Done all servers`);
               clearInterval(wait);

            }
            else if (guild[1].name)
            {

               const name = await guild[1].name;
               const target = guild[1].id;

               if (!target)
               {

                  // eslint-disable-next-line no-useless-return
                  return;

               }

               db.updateServerTable(
                  target,
                  "servername",
                  name,
                  function error (err)
                  {

                     if (err)
                     {

                        return console.log(`DEBUG: Unable to save guild name to DB on Server Command`);

                     }

                  },
                  console.log(`Server Task ${i} - Guild name added for guild: ${target}`)
               );

            }

         }, 2000);

      }
      else
      {

         data.text = ":cop:  This Command is for bot developers only.";
         return sendMessage(data);

      }

   }

   // ----------
   // Update db
   // ----------

   async function updateDB (data)
   {

      data.color = "info";
      data.text =
         ":white_check_mark: **Database has been updated.**";

      // -------------
      // Send message
      // -------------

      await db.updateColumns();

      return sendMessage(data);

   }

   // --------------------------
   // Execute command if exists
   // --------------------------

   const validSettings = {
      // "announce": announcement,
      // add,
      "flagpersist": setFlagPersistence,
      "langdetect": langDetect,
      "listservers": listServers,
      "listssers": listUsers,
      "menupersist": setMenuPersistence,
      "ownerdb": ownerUpdate,
      profanity,
      "reactpersist": setReactPersistence,
      reset,
      "serverdb": serverUpdate,
      "setlang": setLang,
      "tags": serverTags,
      "updatedb": updateDB

   };

   const settingParam = data.cmd.params.split(" ")[0].toLowerCase();
   if (Object.prototype.hasOwnProperty.call(
      validSettings,
      settingParam
   ))
   {

      return validSettings[settingParam](data);

   }

   // ------------------------
   // Error for invalid param
   // ------------------------

   data.color = "error";
   data.text =
      `:warning:  **\`${data.cmd.params
      }\`** is not a valid settings option.`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

}

// --------------------------
// Proccess settings params
// --------------------------

module.exports = function run (data)
{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   Override: if (!data.message.isOwner)
   {

      if (data.message.isDev)
      {

         // console.log("DEBUG: Developer ID Confirmed");
         break Override;

      }

      data.color = "warn";
      data.text = ":warning: These Commands are for server owners and developers only.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {

      data.color = "info";
      data.text =
      `**\`\`\`${data.message.channel.guild.name} - Server Settings` +
      `\`\`\`**\n:information_source: Your current prefix is: **\`${db.server_obj[data.message.guild.id].db.prefix}\`**\n\n` +
      `:tada: Allow Annocement Messages: **\`${data.cmd.server[0].announce}\`**\n\n` +
      `:inbox_tray: Embedded Message Style: **\`${data.cmd.server[0].embedstyle}\`**\n\n` +
      `:grey_question: Language Detection: **\`${data.cmd.server[0].langdetect}\`**\n\n` +
      `:robot: Bot to Bot Translation Status: **\`${data.cmd.server[0].bot2botstyle}\`**\n\n` +
      `:face_with_symbols_over_mouth: Server Tags Disabled: **\`${data.cmd.server[0].servertags}\`**\n\n` +
      `:book: Profanity Filter: **\`${data.cmd.server[0].badwords}\`** - **FUTURE FEATURE**\n\n` +
      `:flags: Translation by Flag Reactions: **\`${data.cmd.server[0].flag}\`**\n\n` +
      `:pause_button: Help Menu Persistance: **\`${data.cmd.server[0].menupersist}\`**\n\n` +
      `:pause_button: React Translation Persistance: **\`${data.cmd.server[0].reactpersist}\`**\n\n` +
      `:pause_button: React Emoji Persistance: **\`${data.cmd.server[0].flagpersist}\`**\n\n` +
      `:wrench: Webhook Debug Active State: **\`${data.cmd.server[0].webhookactive}\`**`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return getSettings(data);

};
