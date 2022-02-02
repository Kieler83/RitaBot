// -----------------
// Global variables
// Err TAG: RS009??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const logger = require("./logger");

// --------------------------------------
// Helper Functions & Buffer end checker
// --------------------------------------

exports.bufferEnd = function bufferEnd (arrOriginal, arrFinal)
{

   if (arrOriginal.length === arrFinal.length)
   {

      return true;

   }
   return false;

};

// ----------------------
// Check user permission
// ----------------------

exports.checkPerm = function checkPerm (member, channel, perm)
{

   return channel.permissionsFor(member).has(perm);

};

// ------------------------------------
// Get key name of object by its value
// ------------------------------------

exports.getKeyByValue = function getKeyByValue (object, value)
{

   return Object.keys(object).find((key) => object[key] === value);

};

// -----------------------------
// Remove duplicates from array
// -----------------------------

exports.removeDupes = function removeDupes (array)
{

   return Array.from(new Set(array));

};

// ------------------------------
// Replace all matches in string
// ------------------------------

exports.replaceAll = function replaceAll (str, search, replacement)
{

   return str.replace(
      new RegExp(
         search,
         "g"
      ),
      replacement
   );

};

// ---------------------------
// Sort array by specific key
// ---------------------------

exports.sortByKey = function sortByKey (array, key)
{

   return array.sort(function sort (a, b)
   {

      const x = a[key];
      const y = b[key];
      return x < y ?
         -1 :
         x > y ?
            1 :
            0;

   });

};

// -----------------------------------
// Split string to array if not array
// -----------------------------------

exports.arraySplit = function arraySplit (input, sep)
{

   if (input.constructor === Array && input.length > 0)
   {

      return input;

   }
   return input.split(sep);

};

// -----------------------
// Split string to chunks
// -----------------------

exports.chunkString = function chunkString (str, len)
{

   const _size = Math.ceil(str.length / len);
   const _ret = new Array(_size);
   let _offset = null;

   for (let _i = 0; _i < _size; _i += 1)
   {

      _offset = _i * len;
      _ret[_i] = str.substring(
         _offset,
         _offset + len
      );

   }

   return _ret;

};

// ----------------------------------
// Get sum of array values (numbers)
// ----------------------------------

exports.arraySum = function arraySum (array)
{

   return array.reduce(
      (a, b) => a + b,
      0
   );

};

// -----------------------
// Get Highest Role Color
// -----------------------

exports.getRoleColor = function getRoleColor (member)
{

   if (member)
   {

      return member.displayColor;

   }
   return null;

};

// ---------
// Get user
// ---------

exports.getUser = function getUser (client, userID, cb)
{

   const user = client.users.cache.get(userID);

   if (user)
   {

      return cb(user);

   }

   // User not in cache, fetch 'em

   client.users.fetch(userID).then(cb).
      catch((err) =>
      {

         cb(false);
         return logger(
            "error",
            err
         );

      });

};

// ------------
// Get channel
// ------------

exports.getChannel = function getChannel (client, channelId, userID, cb)
{

   const channel = client.channels.cache.get(channelId);

   if (channel)
   {

      return cb(channel);

   }

   // Not in cache, create DM

   if (userID)
   {

      module.exports.getUser(
         client,
         userID,
         (user) =>
         {

            user.createDM().then(cb).
               catch((err) =>
               {

                  cb(false);
                  return logger(
                     "error",
                     err
                  );

               });

         }
      );

   }

};

// ------------
// Get message
// ------------

exports.getMessage = function getMessage (client, messageID, channelId, userID, cb)
{

   module.exports.getChannel(
      client,
      channelId,
      userID,
      (channel) =>
      {


         // Message not in channel cache

         channel.messages.fetch(messageID).then(cb).
            catch((err) => cb(
               null,
               err
            ));

      }
   );

};

exports.getUserPin = function getUserPin (UID, cb)
{

   let pin = null;
   const stage1 = UID.split("");
   const calc1 = [];

   for (let i = 0; i <= 5; i += 1)
   {

      const stage1count = i * 3;
      calc1[i] = Number(stage1[stage1count]) + Number(stage1[stage1count + 1]) + Number(stage1[stage1count + 2]);

   }

   const stage2 = [];
   for (let i = 0; i < calc1.length; i += 1)
   {

      const temp = calc1[i].toString().split("");
      const x = i * 2;

      if (temp.length < 2)
      {

         stage2[x] = "0";
         stage2[x + 1] = temp[0];

      }
      else
      {

         stage2[x] = temp[0];
         stage2[x + 1] = temp[1];

      }

   }

   const calc2 = [];
   for (let i = 0; i <= 3; i += 1)
   {

      const stage2count = i * 3;
      calc2[i] = Number(stage2[stage2count]) + Number(stage2[stage2count + 1]) + Number(stage2[stage2count + 2]);

   }

   const stage3 = [];
   for (let i = 0; i < calc2.length; i += 1)
   {

      const temp = calc2[i].toString().split("");
      const x = i * 2;

      if (temp.length < 2)
      {

         stage3[x] = "0";
         stage3[x + 1] = temp[0];

      }
      else
      {

         stage3[x] = temp[0];
         stage3[x + 1] = temp[1];

      }

   }

   const calc3 = [];
   for (let i = 0; i <= 3; i += 1)
   {

      const stage3count = i * 2;
      calc3[i] = Number(stage3[stage3count]) + Number(stage3[stage3count + 1]);
      if (calc3[i] >= 10)
      {

         calc3[i] = Number(9);

      }

   }

   pin = calc3.join("");
   return cb(pin);

};
