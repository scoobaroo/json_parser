var fun = require('./functions.js')

var Table = require('cli-table2');

var makeReport = function(projectFile) {
   var classArr = [];
   for (var e in classes){
      var myClass = new Object();
      myClass.name=classes[e].name;
      myClass.id= classes[e]._id;
      myClass.providers = [];
      myClass.clients = [];
      myClass.cohesion = 0;
      classArr.push(myClass);
   }
   var tools = require('./tools.js');
   var project = tools.getModel(projectFile);
   var classes = tools.collectElements(project, "_type", "UMLClass");
   var ops =tools.collectElements(project, "_type", "UMLOperation");
      for(var k in ops) {
        var params = tools.collectElements(ops[k], "_type", "UMLParameter")
        for(var z in params){
          for (var y in classes){
            if(params[z].type.$ref==classes[y]._id){
              var targetClass7= classes[y];
              operationProviders++;
              targetClass.providers.push(targetClass7.name);
            }
            for(var h in classArr){
              if(classArr[h]._id==params[z].type.$ref){
                var targetClass6 = classArr[h];
                targetClass6.clients.push(targetClass7.name);
              }
            }
          }
        }
      }
   }
   console.log('\n\n');
   classArr.forEach(function(clas){
     clas.clients=Array.from(new Set(clas.clients));
     clas.providers= Array.from(new Set(clas.providers));
   });
   console.log(classArr);
   //GENERATING REPORT HERE
   var table = new Table({
       head: ['Class', 'Stability', 'Responsibility', 'Deviance']
     , colWidths: [100,100,100,100]
   });
   classArr.forEach(function(clas){
     clas.clients=Array.from(new Set(clas.clients));
     clas.providers= Array.from(new Set(clas.providers));
     var classname = clas.name;
     var instability = clas.providers.length/numClasses;
     var stability = 1 - instability;
     var responsibility = clas.clients.length/numClasses;
     var deviance = Math.abs(responsibility-stability);
     var cohesion = clas.cohesion
     table.push(
       [classname,stability,responsibility,deviance]
     );
   });
   console.log(table.toString());

 }




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



// instantiate

main();
