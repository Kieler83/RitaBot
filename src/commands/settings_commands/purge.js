/* eslint-disable no-undef */
/* eslint-disable sort-keys */
// -----------------
// Global variables
// Err TAG: RC301??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const sendMessage = require("../../core/command.send");
const auth = require("../../core/auth");
const db = require("../../core/db");
const time = {
   "long": 30000,
   "short": 5000
};
// --------------------
// Announce to servers
// --------------------

async function purge (data)
{

   data.announcement = {
      "heading": null,
      "message": null,
      "title": null
   };
   // Announcment started - Collect Title.
   const filter = (m) => m.author.id === data.message.author.id;
   try
   {

      setTimeout(() => data.message.delete(), auth.time.short);

   }
   catch (err)
   {

      console.log(
         "Command Message Deleted Error, announce.js = Line 40",
         err
      );

   }
   if (!data.message.isDev)
   {

      data.text = ":cop:  This Command is for bot developers only.\n";
      return sendMessage(data);

   }
   await data.message.channel.send(`Please confirm you wish you start purge sequence`).then(() =>
   {

      data.message.channel.awaitMessages({
         filter,
         "errors": ["time"],
         "max": 1,
         "time": time.long
      }).
         then((message) =>
         {

            let responce = null;
            let responceLower = null;
            responce = message.first();
            responceLower = responce.content.toLowerCase();
            if (responceLower === "yes" || responceLower === "y")
            {

               data.message.channel.send(`Purge Sequence Started`).then((msg) =>
               {

                  try
                  {

                     setTimeout(() => msg.delete(), auth.time.short);

                  }
                  catch (err)
                  {

                     console.log(
                        "Command Message Deleted Error, purge.js = Line 86",
                        err
                     );

                  }

               });

               db.getPurgeInfo(function getPurgeInfo (server)
               {

                  let i = 0;
                  const guilds = [];
                  for (const guild of server)
                  {

                     guilds.push(guild);

                  }

                  const wait = setInterval(async function delay ()
                  {

                     const guild = guilds.shift();

                     i += 1;
                     if (guild === undefined)
                     {

                        console.log(`Done all servers`);
                        return clearInterval(wait);

                     }
                     if (guild.active === true)
                     {

                        const target = await data.message.client.guilds.cache.get(guild.id);
                        console.log(`DEBUG: Purge Server ${i}`);
                        db.updateServerTable(guild.id, "active", false, function error (err)
                        {

                           if (err)
                           {

                              return console.log("error", err, "command", guild.id);

                           }

                        });
                        // await target.leave();

                     }

                  }, 3000);

               });


               clean(data, 2);

            }

            else if (responceLower === "no" || responceLower === "n")
            {

               data.message.channel.send(`Command Terminated`);
               clean(data, 3);

            }
            else
            {

               data.message.channel.send(`Command Terminated: Invalid Response`);
               clean(data, 3);

            }

         }).
         catch((collected) =>
         {

            data.message.channel.send(`No Responce Provided Or Error: - Confirm`);
            clean(data, 1);

         });

   });

}
function clean (data, value)
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

module.exports = function run (data)
{

   // ----------------
   // Execute setting
   // ----------------

   return purge(data);

};
