exports.getModel = function (fname) {
   var fs = require('fs');
   return JSON.parse(fs.readFileSync(fname, 'utf8'));
}

exports.visit = function(obj, callBack) {
   var result = callBack(obj);
   if (!result && obj != null && (typeof obj == "object" || typeof obj == "array")) {
      for(var i in obj) {
         result = exports.visit(obj[i], callBack);
         if (result) break;
      }
   }
   return result;
}

exports.collectElements = function(obj, key, val) {
   var result = [];
   var filter = function(elem) {
      if (elem != null && typeof elem[key] != null && elem[key] == val) {
         result.push(elem);
      }
   }
   exports.visit(obj, filter);
   return result;
}
