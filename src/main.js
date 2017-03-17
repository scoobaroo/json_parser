var makeReport = function(projectFile) {
   var tools = require('./tools.js');
   var project = tools.getModel(projectFile);
   var classes = tools.collectElements(project, "_type", "UMLClass");
   console.log("project classes:");
   for(var i in classes) {
      console.log("  " + classes[i].name);
      var ops = tools.collectElements(classes[i], "_type", "UMLOperation");
      console.log("    operations:");
      for(var k in ops) {
        console.log("      " + ops[k].name);
      }
   }
};

var main = function() {
   var readline = require('readline');
   var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
   });

   rl.question("Enter file name: ", function(answer) {
      makeReport(answer);
      rl.close();
    });
};

main();
