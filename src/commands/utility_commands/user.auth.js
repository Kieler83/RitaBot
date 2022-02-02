// -----------------
// Global variables
// Err TAG: RC509??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
const sendMessage = require("../../core/command.send");
const fs = require("fs");
const path = require("path");
const auth = require("../../core/auth");
const fn = require("../../core/helpers");


// ----------
// Core Code
// ----------

module.exports = function run (data)
{


   if (!data.cmd.num)
   {

      return fn.getUserPin(data.message.author.id, (pin) =>
      {

         // console.log(`DEBUG: ${pin}`);
         data.color = "info";
         data.text = `Your pin is: ${pin}`;
         return sendMessage(data);

      });

   }

   return fn.getUserPin(data.cmd.num, (pin) =>
   {

      // console.log(`DEBUG: ${pin}`);
      data.color = "info";
      data.text = `That users pin is: ${pin}`;
      return sendMessage(data);

   });

};

