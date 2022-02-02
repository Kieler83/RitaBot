// -----------------
// Global variables
// Err TAG: RC405??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
const langCheck = require("../../core/lang.check");
const db = require("../../core/db");
const sendMessage = require("../../core/command.send");

// -----------------------
// Destination ID handler
// -----------------------

function destID (dest, author)
{

   if (!dest)
   {

      return "invalid";

   }
   if (dest.startsWith("<#"))
   {

      return dest.slice(
         2,
         -1
      );

   }
   if (dest.startsWith("<@"))
   {

      return dest.slice(
         3,
         -1
      );

   }
   if (dest === "me")
   {

      return `@${author}`;

   }
   return dest;

}

function destResolver (dest, origin)
{

   if (origin === "target" || origin === "user")
   {

      return `@${dest}`;

   }
   if (!dest.startsWith("@"))
   {

      return `#${dest}`;

   }
   return dest;

}

// ---------------------
// Remove from database
// ---------------------

// eslint-disable-next-line no-unused-vars
async function shoutTasks (res, data, command)
{

   data.color = "ok";
   data.text = ":negative_squared_cross_mark:  Translation tasks for this channel:";

   // -------------
   // Send message
   // -------------

   await sendMessage(data);

   for (let i = 0, len = res.length; i < len; i += 1)
   {

      const task = res[i];
      const dest = destResolver(task.dest);
      const origin = destResolver(task.origin);
      const LangFrom = langCheck(task.LangFrom).valid[0].name;
      const LangTo = langCheck(task.LangTo).valid[0].name;
      if (command === "t")
      {

         data.text = `Task ID: **${task.id}**\n` +
                  `Task Location **${data.message.client.guilds.cache.get(task.server).name}, <${task.server}>**\n` +
                  `:arrow_right:   Translating **${LangFrom}** messages from **<${origin}>, <${data.channel.id}>**\n` +
                  `and sending **${LangTo}** messages to **<${dest}>, <${dest.slice(1)}>**`;

      }
      else
      {

         data.text = `Task ID: **${task.id}**\n` +
                  `:arrow_right:   Translating **${LangFrom}** messages from **<${origin}>, <${data.channel.id}>**\n` +
                  `and sending **${LangTo}** messages to **<${dest}>, <${dest.slice(1)}>**`;

      }
      // -------------
      // Send message
      // -------------

      // eslint-disable-next-line no-await-in-loop
      await sendMessage(data);

   }
   data.text = ":negative_squared_cross_mark:  That's all I have!";

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

}

// ---------------
// Database error
// ---------------

function dbError (err, data)
{

   data.color = "error";
   data.text =
      ":warning:  Could not retrieve information from database. Try again " +
      "later or report this issue to an admin if problem continues.";


   // -------------
   // Send message
   // -------------

   sendMessage(data);
   return console.log(
      "error",
      err
   );

}

// -----------------
// Local tasks call
// -----------------

function local (origin, dest, id, data)
{

   db.getTasks(
      origin,
      dest,
      id,
      async function error (err, res)
      {

         if (err)
         {

            return dbError(
               err,
               data
            );

         }

         // -----------------------------
         // Error if task does not exist
         // -----------------------------

         if (res.length < 1 || !res)
         {

            const orig = destResolver(origin);
            const des = destResolver(dest, origin);
            data.color = "error";
            if (origin === "me")
            {

               data.text = ":warning:  __**No tasks**__ for you in this server";

            }
            else if (origin === "target")
            {

               data.text = `:warning:  __**No tasks**__ for **<${des}>**.`;

            }
            else
            {

               data.text = `:warning:  __**No tasks**__ for **<${orig}>**.`;

            }
            if (dest === "all")
            {

               data.text = ":warning:  This channel is not being automatically translated for anyone.";

            }

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }

         // -----------------------------------------------
         // Otherwise, proceed to shout task from database
         // -----------------------------------------------

         const command = "l";
         await shoutTasks(
            res,
            data,
            command
         );

      }
   );

}

// -----------------
// Local tasks call
// -----------------

function target (data)
{

   let origin = null;
   let dest = null;
   let id = null;

   try
   {

      if (data.cmd.params && data.cmd.params.split(" ")[1].toLowerCase())
      {

         origin = data.cmd.params.split(" ")[0].toLowerCase();
         dest = data.cmd.num;
         // console.log(`DEBUG: Target Called - ${origin} @${dest}`);

      }

   }
   catch (err)
   {

      // console.log(`DEBUG: Error - No Variable for ${data.cmd.params}`);
      data.text = `:warning:  Missing Variable for ${data.cmd.params}`;
      return sendMessage(data);

   }


   db.getTasks(
      origin,
      dest,
      id,
      async function error (err, res)
      {

         if (err)
         {

            return dbError(
               err,
               data
            );

         }

         // -----------------------------
         // Error if task does not exist
         // -----------------------------

         if (res.length < 1 || !res)
         {

            const des = destResolver(dest, origin);
            data.color = "error";
            if (origin === "user")
            {

               data.text = `:warning:  __**No tasks**__ for **<${des}>** in Database`;

            }
            else if (origin === "channel")
            {

               data.text = `:warning:  __**No tasks**__ for targeted channel.`;

            }
            else if (origin === "server")
            {

               data.text = `:warning:  __**No tasks**__ for targeted server.`;

            }

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }

         // -----------------------------------------------
         // Otherwise, proceed to shout task from database
         // -----------------------------------------------

         const command = "t";
         await shoutTasks(
            res,
            data,
            command
         );

      }
   );

}

// ---------------------
// Handle tasks command
// ---------------------

module.exports = function run (data)
{

   // -------------------------------------------------
   // Disallow this command in Direct/Private messages
   // -------------------------------------------------

   if (data.message.channel.type === "DM")
   {

      data.color = "warn";
      data.text =
         ":no_entry:  This command can only be called in server channels.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // -------------------------------
   // Disallow multiple destinations
   // -------------------------------

   if (data.cmd.for.length > 1)
   {

      data.color = "error";
      data.text = ":warning:  Please specify only one `for` value.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // -----------------------------------------
   // Disallow non-managers to stop for others
   // -----------------------------------------

   Override: if (!data.message.isDev)
   {

      if (!data.message.isGlobalChanManager)
      {

         // console.log(`DEBUG: Is not global chan manager`);
         if (!data.message.isChanManager)
         {

            // console.log(`DEBUG: Is not single chan manager`);
            data.color = "error";
            data.text = ":police_officer:  This command is reserved for server admins & channel managers";

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
         // console.log(`DEBUG: Is single chan manager`);
         break Override;

      }
      // console.log(`DEBUG: Is global chan manager`);
      break Override;

   }

   let origin = null;
   let dest = null;
   let id = null;

   if (!data.cmd.params)
   {

      // ------------------
      // Prepare task data
      // ------------------

      origin = data.message.channel.id;
      dest = destID(
         data.cmd.params,
         data.message.author.id
      );
      id = data.message.guild.id;
      return local(origin, dest, id, data);

   }
   else if (data.cmd.params.toLowerCase().includes("server") || data.cmd.params.toLowerCase().includes("channel") || data.cmd.params.toLowerCase().includes("user"))
   {

      if (!data.message.isDev)
      {

         // console.log(`DEBUG: Is not single chan manager`);
         data.color = "error";
         data.text = ":police_officer:  This command is reserved for Developers only";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // console.log("DEBUG: Server / Channel / User Command called");
      return target(data);

   }
   else if (data.cmd.params.toLowerCase().includes("#"))
   {

      origin = destID(
         data.cmd.params,
         data.message.author.id
      );
      dest = "target";
      id = null;
      return local(origin, dest, id, data);


   }
   else if (data.cmd.params.toLowerCase().includes("me"))
   {

      origin = "me";
      dest = destID(
         data.cmd.params,
         data.message.author.id
      );
      id = data.message.guild.id;
      return local(origin, dest, id, data);

   }
   else if (data.cmd.params.toLowerCase().includes("@"))
   {

      // ------------------
      // Prepare task data
      // ------------------

      origin = "target";
      dest = destID(
         data.cmd.params,
         data.message.author.id
      );
      id = data.message.guild.id;
      return local(origin, dest, id, data);

   }

};
