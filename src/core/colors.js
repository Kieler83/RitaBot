// -----------------
// Global variables
// Err TAG: RS003??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const colors = {
   "default": 41215,
   "error": 13107200,
   "info": 9514728,
   "ok": 1551647,
   "status": 15844367,
   "warn": 16764928
};

// ----------
// Get color
// ----------

exports.get = function get (color)
{

   if (color)
   {

      if (Object.prototype.hasOwnProperty.call(
         colors,
         color
      ))
      {

         return colors[color];

      }
      if (isNaN(color))
      {

         return colors.warn;

      }
      return color;

   }
   return undefined;


};

// ------------------------------------
// Convert RGB color to decimal number
// ------------------------------------

exports.rgb2dec = function rgb2dec (rgb)
{

   // eslint-disable-next-line no-bitwise
   return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];

};
