// -----------------
// Global variables
// Err TAG: RB001??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
/* eslint-disable sort-keys */
const fs = require("fs");
const time = {
   "long": 60000,
   "mid": 30000,
   "short": 5000
};

const path = `${__dirname.slice(0, -3)}`;


if (fs.existsSync(`${path}.env`))
{

   // console.log("main env exists");
   const env = `${path}.env`;
   module.require("dotenv").config({
      "path": env
   });
   console.log("----------------------------------------\n.env file loaded");

}
else if (fs.existsSync(`${path}.env.json`))
{

   // console.log("json env exists");
   const env = `${path}.env.json`;
   module.require("dotenv-json")({
      "path": env
   });
   console.log("----------------------------------------\n.env.json file loaded");

}

console.log(`DEBUG MODE: ${process.env.DEBUG}`);
console.log(`MESSASGE DEBUG MODE: ${process.env.MESSAGE_DEBUG}`);

// const dotenvJSON = require("dotenv-json");
// const envJson = `${__dirname.slice(
//   0,
//   -3
// )}.env.json`;
// dotenvJSON({"path": envJson});

const {Client, Options, Intents} = require("discord.js");

const myIntents = new Intents(32509);

const client = new Client({
   "restRequestTimeout": time.long,
   "shards": "auto",
   "makeCache": Options.cacheWithLimits({
      "GuildBanManager": 20, // guild.bans
      "GuildManager": Infinity, // client.guilds
      "MessageManager": 15, // channel.messages
      "PresenceManager": 15, // guild.presences
      "UserManager": 15 // client.users
   }),
   "intents": myIntents
   // "waitGuildTimeout": 7000
});
const auth = require("./core/auth");

/*
const {AutoPoster} = require("topgg-autoposter");

// your discord.js or eris client
const topggLogin = auth.topggToken;
if (!topggLogin || topggLogin === " ")
{

   console.log("----------------------------------------\nNo top.gg token present");

}
else
{

   // eslint-disable-next-line new-cap
   const poster = AutoPoster(topggLogin, client);
   // optional
   poster.on("posted", (stats) =>
   // ran when succesfully posted
   {

      console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);

   });

}
*/

// ---------------
// Event Listener
// ---------------

const events = require("./events");

events.listen(client);
exports.client = client;
// ---------------
// Initialize Bot
// ---------------

// eslint-disable-next-line func-style
function login (token)
{

   client.login(token).catch((err) =>
   {

      console.log(err);
      console.log(`retrying login...`);
      setTimeout(
         login,
         5000
      );

   });

}

login(auth.token);
