var makeReport = function(projectFile) {
   var tools = require('./tools.js');
   var project = tools.getModel(projectFile);
   var classes = tools.collectElements(project, "_type", "UMLClass");
   console.log("project classes:");
   for(var i in classes) {
      var methAttAssoc = 0
      console.log("  " + classes[i].name);
      var ops = tools.collectElements(classes[i], "_type", "UMLOperation");
      var atts = tools.collectElements(classes[i], "_type", "UMLAttribute");
      var numAtts = 0
      console.log("    Attributes:");
      for(var j in atts) {
        console.log("      " +atts[j].name);
        numAtts+=1
      }
      console.log("    Operations:");
      var numOps=0
      for(var k in ops) {
        console.log("      " + ops[k].name);
        numOps+=1
        console.log("        "  + ops[k].name + "'s Parameters:");
        var parameters = tools.collectElements(ops[k], "_type", "UMLParameter")
        var numParam=0
        for (var x in parameters){
          numParam += 1
          console.log("         " + parameters[x].name )
          atts.forEach(function(att){
            if (att.name==parameters[x].name){
              methAttAssoc+=1
            }
          })
          var parameterId= parameters[x].type.$ref;
          classes.forEach(function(clas) {
            if(clas._id == parameterId){
              console.log("            " + clas.name)
            }
          })
        }
      }
      var totalPossible = numAtts*numOps;
      console.log("total possible" + totalPossible)
      var cohesion = methAttAssoc/totalPossible;
      console.log(classes[i].name + "'s Cohesion: " +  cohesion);
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

var Table = require('cli-table2');

// instantiate
var table = new Table({
    head: ['Classes', 'Cohesion', 'Stability', 'Responsibility', 'Deviance']
  , colWidths: [100,100,100,100,100]
});

table.push(
    ['First value', 'Second value']
  , ['First value', 'Second value']
);

console.log(table.toString());

main();
