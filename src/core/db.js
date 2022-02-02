// -----------------
// Global variables
// Err TAG: RS006??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable sort-keys */
/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
const autoTranslate = require("./auto");
const Sequelize = require("sequelize");
const logger = require("./logger");
const {oneLine} = require("common-tags");
const Op = Sequelize.Op;
let dbNewPrefix = "";
const server_obj = {};
const botVersion = require("../../package.json").version;
const debugMode = false;
const SequelizeDebugMode = debugMode ?
   console.log :
   false;
exports.server_obj = server_obj;

// ----------------------
// Database Auth Process
// ----------------------

debugMode && console.log("DEBUG: SQL Patch");
if (!process.env.DATABASE_URL)
{

   return console.log("ERROR, Missing Database Information");

}
const regex = (/((mysql):\/\/)((\S*):)((\S*)@)((\S*)\/)(\S*)$/gm);
const dbString = process.env.DATABASE_URL.split(regex);
debugMode && console.log("DEBUG: Pre Stage Database Auth Process");
const db = process.env.DATABASE_URL.endsWith(".db") ?
   new Sequelize({
      logging: SequelizeDebugMode,
      "dialect": "sqlite",
      "dialectOptions": {
         "ssl": {
            "require": true,
            "rejectUnauthorized": false
         },
         acquireTimeout: 60000
      },
      "storage": process.env.DATABASE_URL
   }) :
   process.env.DATABASE_URL.startsWith("mysql") ?
      new Sequelize(
         dbString[9],
         dbString[4],
         dbString[6], {dialect: dbString[2],
            "host": dbString[8],
            logging: SequelizeDebugMode}
      ) :
      new Sequelize(
         process.env.DATABASE_URL,
         {
            logging: SequelizeDebugMode,
            "dialectOptions": {
               "ssl": {
                  "require": true,
                  "rejectUnauthorized": false
               },
               acquireTimeout: 60000
            }
         }
      );

db.
   authenticate().
   then(() =>
   {

      console.log(`----------------------------------------\nAttempting Database Connection.`);

   }).
   catch((err) =>
   {

      logger(
         "error",
         err
      );

   });

// ---------------------------------
// Database stats table definition
// ---------------------------------

debugMode && console.log("DEBUG: Pre Stage Database stats table definition");
const Stats = db.define(
   "stats",
   {
      "id": {
         "type": Sequelize.STRING(32),
         "primaryKey": true,
         "unique": true,
         "allowNull": false
      },
      "message": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "translation": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "embedon": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "embedoff": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "images": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "gif": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "react": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      }
   }
);

// ---------------------------------
// Database server table definition
// ---------------------------------

debugMode && console.log("DEBUG: Pre Stage Database server table definition");

const Servers = db.define(
   "servers",
   {
      "id": {
         "type": Sequelize.STRING(32),
         "primaryKey": true,
         "unique": true,
         "allowNull": false
      },
      "servername": Sequelize.STRING(255),
      "prefix": {
         "type": Sequelize.STRING(32),
         "defaultValue": "!tr"
      },
      "lang": {
         "type": Sequelize.STRING(8),
         "defaultValue": "en"
      },
      "count": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "active": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "embedstyle": {
         "type": Sequelize.STRING(8),
         "defaultValue": "on"
      },
      "bot2botstyle": {
         "type": Sequelize.STRING(8),
         "defaultValue": "off"
      },
      "webhookid": Sequelize.STRING(32),
      "webhooktoken": Sequelize.STRING(255),
      "webhookactive": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "blacklisted": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "whitelisted": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "warn": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "invite": {
         "type": Sequelize.STRING(255),
         "defaultValue": "Not yet Created"
      },
      "announce": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "menupersist": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "flag": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "flagpersist": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "reactpersist": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "langdetect": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "servertags": {
         "type": Sequelize.STRING(8),
         "defaultValue": "none"
      },
      "badwords": {
         "type": Sequelize.STRING(8),
         "defaultValue": "off"
      },
      "owner": {
         "type": Sequelize.STRING(255),
         "defaultValue": "Unknown"
      },
      "errorcount": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "warncount": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "ejectcount": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "usercount": {
         "type": Sequelize.INTEGER
      },
      "purge": {
         "type": Sequelize.BOOLEAN
      }
   }
);

// --------------------------------
// Database tasks table definition
// --------------------------------

debugMode && console.log("DEBUG: Pre Stage Database tasks table definition");
const Tasks = db.define(
   "tasks",
   {
      "origin": Sequelize.STRING(32),
      "dest": Sequelize.STRING(32),
      "reply": Sequelize.STRING(32),
      "server": Sequelize.STRING(32),
      "active": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "LangTo": {
         "type": Sequelize.STRING(8),
         "defaultValue": "en"
      },
      "LangFrom": {
         "type": Sequelize.STRING(8),
         "defaultValue": "en"
      }
   },
   {
      "indexes": [
         {
            "unique": true,
            "name": "ux_index_1",
            "fields": [
               "origin",
               "dest",
               "LangTo",
               "LangFrom"
            ]
         },
         {
            "unique": false,
            "name": "ix_tasks_1",
            "fields": [
               "server"
            ]
         },
         {
            "unique": false,
            "name": "ix_tasks_2",
            "fields": [
               "dest"
            ]
         },
         {
            "unique": false,
            "name": "ix_tasks_3",
            "fields": [
               "origin"
            ]
         },
         {
            "unique": false,
            "name": "ix_tasks_4",
            "fields": [
               "active"
            ]
         }
      ]
   }
);

// -------------------
// Init/create tables
// -------------------

// eslint-disable-next-line require-await
exports.initializeDatabase = async function initializeDatabase (client)
{

   debugMode && console.log("DEBUG: Stage Init/create tables - Pre Sync");
   db.sync({logging: SequelizeDebugMode}).then(async () =>
   {

      // eslint-disable-next-line init-declarations
      let guild;

      await this.updateColumns();
      debugMode && console.log("DEBUG: New columns should be added Before this point.");
      await Stats.upsert({logging: SequelizeDebugMode,
         "id": "bot"});

      await Servers.upsert({logging: SequelizeDebugMode,
         "id": "bot",
         "lang": "en"});

      const guilds = Array.from(client.guilds._cache.keys()).length;
      const guildsArray = Array.from(client.guilds._cache);
      let i = 0;
      for (i = 0; i < guilds; i += 1)
      {

         guild = guildsArray[i];
         const guildId = guild[1].id;
         // eslint-disable-next-line no-await-in-loop
         await Stats.upsert({"id": guildId,
            logging: SequelizeDebugMode});
         Servers.findAll({logging: SequelizeDebugMode,
            "where": {"id": guildId}}).then((projects) =>
         {

            if (projects.length === 0)
            {

               debugMode && console.log("DEBUG: Add Server");
               Servers.upsert({logging: SequelizeDebugMode,
                  "id": guildId,
                  "lang": "en",
                  "active": true});
               Stats.upsert({logging: SequelizeDebugMode,
                  "id": guildId});

            }
            debugMode && console.log("DEBUG: Active Check all Active Guilds");
            Servers.upsert({logging: SequelizeDebugMode,
               "id": guildId,
               "active": true});

         });

      }
      debugMode && console.log("DEBUG: Stage Init/create tables - Pre servers FindAll");
      const serversFindAll = await Servers.findAll({logging: SequelizeDebugMode});
      for (let i = 0; i < serversFindAll.length; i += 1)
      {

         // eslint-disable-next-line prefer-const
         const guild_id = serversFindAll[i].id;
         // eslint-disable-next-line eqeqeq
         if (guild_id != "bot")
         {

            server_obj[guild_id] = {"db": serversFindAll[i]};

         }

      }
      debugMode && console.log("DEBUG: Stage Init/create tables - Pre guildClient");
      const guildClient = Array.from(client.guilds.cache.values());
      for (let i = 0; i < guildClient.length; i += 1)
      {

         guild = guildClient[i];
         if (!server_obj[guild.id])
         {

            server_obj[guild.id] = {};

         }
         server_obj[guild.id].guild = guild;
         server_obj[guild.id].size = guild.memberCount;
         if (!server_obj.size)
         {

            server_obj.size = 0;

         }
         server_obj.size += guild.memberCount;

      }
      console.log("----------------------------------------\nDatabase fully initialized.\n----------------------------------------");

      logger(
         "custom",
         {
            "color": "ok",
            "msg": oneLine`
            :wave:  **${client.user.username}**
            - Database fully initialized.
         `
         }
      );

   });

};

// -----------------------
// Add Server to Database
// -----------------------

exports.addServer = async function addServer (id, lang)
{

   debugMode && console.log("DEBUG: Stage Add Server to Database");
   server_obj[id] = {
      "db": {
         "embedstyle": "on",
         "bot2botstyle": "off",
         id,
         "webhookid": null,
         "webhooktoken": null,
         "prefix": "!tr"
      }
   };
   await Servers.findAll({logging: SequelizeDebugMode,
      "where": {id}}).then((server) =>
   {

      if (server.length === 0)
      {

         Servers.create({
            id,
            lang,
            "prefix": "!tr"
         }).catch((err) => console.log("VALIDATION: Server Already Exists in Servers Table"));
         Stats.create({logging: SequelizeDebugMode,
            id}).catch((err) => console.log("VALIDATION: Server Already Exists in Stats Table"));

      }

   });

};

// ------------------------
// Add server member count
// ------------------

exports.servercount = function servercount (guild)
{

   server_obj.size += guild.memberCount;

};

// -------------------------------
// Update Embedded Variable in DB
// -------------------------------

exports.updateEmbedVar = function updateEmbedVar (id, embedstyle, _cb)
{

   debugMode && console.log("DEBUG: Stage Update Embedded Variable in DB");
   server_obj[id].db.embedstyle = embedstyle;
   return Servers.update(
      {embedstyle},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// ------------------------------
// Update Bot2Bot Variable In DB
// ------------------------------

exports.updateBot2BotVar = function updateBot2BotVar (id, bot2botstyle, _cb)
{

   debugMode && console.log("DEBUG: Stage Update Bot2Bot Variable In DB");
   server_obj[id].db.bot2botstyle = bot2botstyle;
   return Servers.update(
      {bot2botstyle},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -----------------------------------------------
// Update webhookId & webhookToken Variable In DB
// -----------------------------------------------

exports.updateWebhookVar = function updateWebhookVar (id, webhookid, webhooktoken, webhookactive, _cb)
{

   debugMode && console.log("DEBUG: Stage Update webhookId & webhookToken Variable In DB");
   return Servers.update(
      {webhookid,
         webhooktoken,
         webhookactive},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// --------------
// Update prefix
// --------------

exports.updatePrefix = function updatePrefix (id, prefix, _cb)
{

   debugMode && console.log("DEBUG: Stage Update prefix");
   dbNewPrefix = prefix;
   server_obj[id].db.prefix = dbNewPrefix;
   return Servers.update(
      {prefix},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -----------------------
// Update Server Variable
// -----------------------

exports.updateServerTable = function updateServerTable (id, columnName, value, _cb)
{

   debugMode && console.log(`DEBUG: ID: ${id} - Name: ${columnName} - Value: ${value}`);
   return Servers.update(
      {[`${columnName}`]: value},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -----------------------
// Update Server Variable
// -----------------------

exports.reset = function reset (id, _cb)
{

   debugMode && console.log(`DEBUG: ID: ${id} - Name: ${columnName} - Value: ${value}`);
   return Servers.update(
      {lang: "en",
         embedstyle: "on",
         bot2botstyle: "off",
         announce: true,
         flag: true,
         flagpersist: true,
         reactpersist: true,
         langdetect: false,
         servertags: "none",
         badwords: "off"},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -----------------------------
// Add Missing Variable Columns
// -----------------------------

exports.updateColumns = async function updateColumns ()
{

   debugMode && console.log("DEBUG: Checking Missing Variable Columns for old RITA release");
   // For older version of RITA, they need to upgrade DB with adding new columns if needed
   const serversDefinition = await db.getQueryInterface().describeTable("servers");
   await this.addTableColumn("servers", serversDefinition, "prefix", Sequelize.STRING(32), "!tr");
   await this.addTableColumn("servers", serversDefinition, "embedstyle", Sequelize.STRING(8), "on");
   await this.addTableColumn("servers", serversDefinition, "bot2botstyle", Sequelize.STRING(8), "off");
   await this.addTableColumn("servers", serversDefinition, "webhookid", Sequelize.STRING(32));
   await this.addTableColumn("servers", serversDefinition, "webhooktoken", Sequelize.STRING(255));
   await this.addTableColumn("servers", serversDefinition, "webhookactive", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "blacklisted", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "whitelisted", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "warn", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "invite", Sequelize.STRING(255), "Not yet Created");
   await this.addTableColumn("servers", serversDefinition, "announce", Sequelize.BOOLEAN, true);
   await this.addTableColumn("servers", serversDefinition, "menupersist", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "owner", Sequelize.STRING(255), "Unknown");
   await this.addTableColumn("servers", serversDefinition, "errorcount", Sequelize.INTEGER, 0);
   await this.addTableColumn("servers", serversDefinition, "warncount", Sequelize.INTEGER, 0);
   await this.addTableColumn("servers", serversDefinition, "ejectcount", Sequelize.INTEGER, 0);
   await this.addTableColumn("servers", serversDefinition, "flag", Sequelize.BOOLEAN, true);
   await this.addTableColumn("servers", serversDefinition, "reactpersist", Sequelize.BOOLEAN, true);
   await this.addTableColumn("servers", serversDefinition, "langdetect", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "flagpersist", Sequelize.BOOLEAN, true);
   await this.addTableColumn("servers", serversDefinition, "servername", Sequelize.STRING(255));
   await this.addTableColumn("servers", serversDefinition, "servertags", Sequelize.STRING(8), "none");
   await this.addTableColumn("servers", serversDefinition, "badwords", Sequelize.STRING(8), "OFF");
   await this.addTableColumn("servers", serversDefinition, "usercount", Sequelize.INTEGER);
   await this.addTableColumn("servers", serversDefinition, "purge", Sequelize.BOOLEAN);

   debugMode && console.log("DEBUG: All Columns Checked or Added");

   // For older version of RITA, must remove old unique index
   debugMode && console.log("DEBUG: Stage Remove old RITA Unique index");
   await this.dropTableIndex("tasks", "tasks_origin_dest");
   debugMode && console.log("DEBUG : All old index removed");

};

// ------------------------------------
// Dropping an index in DB if exists
// ------------------------------------
exports.dropTableIndex = async function dropTableIndex (tableName, indexName)
{

   const listTableIndexes = await db.getQueryInterface().showIndex(tableName);

   // if index does not exists we don't do nothing
   if (listTableIndexes.find((element) => element.name === indexName) === undefined)
   {

      debugMode && console.log(`Index ${indexName} already dropped before`);

   }
   else
   {

      debugMode && console.log(`Dropping Index ${indexName}`);
      await db.getQueryInterface().removeIndex(tableName, indexName);

   }

};

// ------------------------------------
// Adding a column in DB if not exists
// ------------------------------------
exports.addTableColumn = async function addTableColumn (tableName, tableDefinition, columnName, columnType, columnDefault)
{

   // Adding column only when it's not in table definition
   if (!tableDefinition[`${columnName}`])
   {

      console.log(`--> Adding ${columnName} column`);
      if (columnDefault === null)
      {

         // Adding column whithout a default value
         await db.getQueryInterface().addColumn(tableName, columnName, {"type": columnType});

      }
      else
      {

         // Adding column with a default value
         await db.getQueryInterface().addColumn(tableName, columnName, {"type": columnType,
            "defaultValue": columnDefault});

      }

   }

};

// ------------------
// Get Channel Tasks
// ------------------

// eslint-disable-next-line consistent-return
exports.channelTasks = function channelTasks (data)
{

   debugMode && console.log("DEBUG: Stage Get Channel Tasks");
   let id = data.message.channel.id;
   if (data.message.channel.type === "DM")
   {

      debugMode && console.log("DEBUG: Line 609 - DB.js");
      id = `@${data.message.author.id}`;

   }
   try
   {

      // eslint-disable-next-line no-unused-vars
      const taskList = Tasks.findAll({logging: false,
         "where": {"origin": id,
            "active": true}}).then(function res (result)
      {

         data.rows = result;
         return autoTranslate(data);

      });

   }
   catch (e)
   {

      logger(
         "error",
         e
      );
      data.err = e;
      return autoTranslate(data);

   }

};

// ------------------------------
// Get tasks for channel or user
// ------------------------------

exports.getTasks = function getTasks (origin, dest, id, cb)
{

   debugMode && console.log("DEBUG: Stage Get tasks for channel or user");
   if (origin.includes("me"))
   {

      debugMode && console.log("DEBUG: getTasks Me");
      return Tasks.findAll(
         {"where": {"server": id,
            dest}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   else if (origin.includes("user"))
   {

      let dest1 = "@";
      dest1 += dest;

      debugMode && console.log("DEBUG: getTasks user");
      return Tasks.findAll(
         {"where": {"dest": dest1}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   else if (origin.includes("target"))
   {

      let dest1 = "@";
      dest1 += dest;

      debugMode && console.log("DEBUG: getTasks target");
      return Tasks.findAll(
         {"where": {"server": id,
            "dest": dest1}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   else if (origin.includes("server"))
   {

      debugMode && console.log("DEBUG: getTasks server");
      return Tasks.findAll(
         {"where": {"server": dest}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   else if (origin.includes("channel"))
   {

      debugMode && console.log("DEBUG: getTasks channel");
      return Tasks.findAll(
         {"where": {[Op.or]: [
            {dest},
            {"origin": dest}]}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   debugMode && console.log("DEBUG: getTasks All");
   return Tasks.findAll(
      {"where": {origin}},
      {"raw": true}
   ).then(function res (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// --------------------------------
// Check if dest is found in tasks
// --------------------------------

exports.checkTask = function checkTask (origin, dest, eh, cb)
{

   debugMode && console.log("DEBUG: Stage Check if dest is found in tasks");
   if (dest === "all")
   {

      return Tasks.findAll(
         {"where": {origin}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   if (dest === "id")
   {

      return Tasks.findAll(
         {"where": {"id": origin}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   if (dest === "server")
   {

      return Tasks.findAll(
         {"where": {"server": origin}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   if (eh === "o")
   {

      return Tasks.findAll(
         {"where": {"server": origin,
            "origin": dest}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   if (eh === "d")
   {

      return Tasks.findAll(
         {"where": {"server": origin,
            dest}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   return Tasks.findAll(
      {"where": {origin,
         dest}},
      {"raw": true}
   ).then(function res (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// --------------------
// Remove Channel Task
// --------------------

exports.removeTask = function removeTask (origin, dest, cb)
{

   debugMode && console.log("DEBUG: Stage Remove Channel Task");
   if (dest === "all")
   {

      debugMode && console.log("DEBUG: removeTask() - all");
      return Tasks.destroy({"where": {[Op.or]: [
         {origin},
         // !!!DO NOT REMOVE!!! The next line is what deletes tasks for channels that get deleted! !!!DO NOT REMOVE!!!
         {"dest": origin}
      ]}}).then(function error (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   if (dest === "server")
   {

      debugMode && console.log("DEBUG: removeTask() - all");
      return Tasks.destroy({"where": {[Op.or]: [
         {"server": origin},
         // !!!DO NOT REMOVE!!! The next line is what deletes tasks for channels that get deleted! !!!DO NOT REMOVE!!!
         {"dest": origin}
      ]}}).then(function error (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   return Tasks.destroy({"where": {[Op.or]: [
      {origin,
         dest}
   ]}}).then(function error (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// ------------------
// Remove Task by ID
// ------------------

exports.removeTaskID = function removeTaskID (id, cb)
{

   debugMode && console.log("DEBUG: Stage Remove Task by ID");
   Tasks.destroy({"where": {id,
      "active": true}}).then(function error (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// ---------------
// Get Task Count
// ---------------

exports.getTasksCount = function getTasksCount (origin, cb)
{

   debugMode && console.log("DEBUG: Get Task Count");
   return Tasks.count({"where": {origin}}).then((c) =>
   {

      cb(
         "",
         c
      );

   });

};

// ------------------
// Get Servers Count
// ------------------

exports.getServersCount = function getServersCount ()
{

   debugMode && console.log("DEBUG: Stage Get Servers Count");
   return server_obj.length();

};

// ---------
// Add Task
// ---------

exports.addTask = function addTask (task)
{

   debugMode && console.log("DEBUG: Stage Add Task");
   task.dest.forEach((dest) =>
   {

      Tasks.upsert({
         "origin": task.origin,
         dest,
         "reply": task.reply,
         "server": task.server,
         "active": true,
         "LangTo": task.to,
         "LangFrom": task.from
      }).
         catch((err) =>
         {

            logger(
               "error",
               err,
               "command",
               task.server
            );

         });

   });

};

// -------------
// Update stats
// -------------

// Increase the count in Servers table
exports.increaseServersCount = function increaseServersCount (col, id)
{

   debugMode && console.log("DEBUG: Stage Update count in Servers table");
   return Servers.increment(
      col,
      {logging: false,
         "where": {id}}
   );

};

exports.increaseStatsCount = function increaseStatsCount (col, id)
{

   debugMode && console.log("DEBUG: Stage Update counts in stats table");
   return Stats.increment(
      col,
      {logging: false,
         "where": {id}},
   );

};

// --------------
// Get bot stats
// --------------

exports.getStats = function getStats (callback)
{

   debugMode && console.log("DEBUG: Stage Get bot stats");
   return db.query(
      `select * from (select sum(count) as "totalCount", ` +
  `count(id)-1 as "totalServers" from servers) as table1, ` +
  `(select count(id)-1 as "activeSrv" from servers where active = TRUE) as table2, ` +
  `(select lang as "botLang" from servers where id = 'bot') as table3, ` +
  `(select count(distinct origin) as "activeTasks" ` +
  `from tasks where active = TRUE) as table4, ` +
  `(select count(distinct dest) as "activeUserTasks" ` +
  `from tasks where active = TRUE and dest like '@%') as table5,` +
  `(select * from stats where id = 'bot') as table6;`,
      {"type": Sequelize.QueryTypes.SELECT},
   ).
      then(
         (result) => callback(result),
         (err) => logger(
            "error",
            `${err}\nQuery: ${err.sql}`,
            "db"
         )
      );

};

// ----------------
// Get server info
// ----------------

exports.getServerInfo = function getServerInfo (id, callback)
{

   debugMode && console.log("DEBUG: Stage Get server info");
   return db.query(`select * from (select count as "count",` +
   `lang as "lang" from servers where id = ?) as table1,` +
   `(select count(distinct origin) as "activeTasks"` +
   `from tasks where server = ?) as table2,` +
   `(select count(distinct dest) as "activeUserTasks"` +
   `from tasks where dest like '@%' and server = ?) as table3, ` +
   `(select * from stats where id = ?) as table4, ` +
   `(select * from servers where id = ?) as table5; `, {"replacements": [ id, id, id, id, id],
      "type": db.QueryTypes.SELECT}).
      then(
         (result) => callback(result),
         (err) => this.updateColumns()
      );

};

// ----------------
// Get server info
// ----------------

exports.getPurgeInfo = function getPurgeInfo (callback)
{

   debugMode && console.log("DEBUG: Stage Get purge stats");
   return db.query(
      `select * from servers where purge = true AND active = true;`,
      {"type": Sequelize.QueryTypes.SELECT},
   ).
      then(
         (result) => callback(result),
         (err) => logger(
            "error",
            `${err}\nQuery: ${err.sql}`,
            "db"
         )
      );

};

// ---------
// Close DB
// ---------

exports.close = function close ()
{

   debugMode && console.log("DEBUG: Stage Close DB");
   return db.close();

};
