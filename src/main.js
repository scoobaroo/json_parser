var Table = require('cli-table2');

var makeReport = function(projectFile) {
   var tools = require('./tools.js');
   var project = tools.getModel(projectFile);
   var classes = tools.collectElements(project, "_type", "UMLClass");
   var numClasses = classes.length;
   console.log("Total Number of Classes: "+ numClasses)
   var classArr=[];
   for (var e in classes){
      var myClass = new Object();
      myClass.name=classes[e].name;
      myClass.id= classes[e]._id;
      myClass.providers = [];
      myClass.clients = [];
      myClass.cohesion = 0;
      classArr.push(myClass);
   }
   for(var i in classes) {
      console.log("\n\n");
      console.log("THIS IS THE REPORT FOR :  "+ classes[i].name);
      var ops = tools.collectElements(classes[i], "_type", "UMLOperation");
      var atts = tools.collectElements(classes[i], "_type", "UMLAttribute");
      var classAssociations = tools.collectElements(classes[i], "_type", "UMLAssociation")
      var generalizations = tools.collectElements(classes[i], "_type", "UMLGeneralization")
      var attributeProviders = 0;
      var operationProviders = 0;
      var associationProviders = 0;
      var generalizationProviders = 0;
      for(var o=0; o<classArr.length;o++){
        if (classes[i].name == classArr[o].name){
          var targetClass = classArr[o];
        }
      }
      console.log(targetClass);
      console.log(targetClass.providers);
      for (var g in generalizations){
        for (var c in classes){
          if (classes[i]._id==classes[c]._id&&classes[c]._id==generalizations[g].source.$ref){
            for(var o=0; o<classArr.length;o++){
              if (classes[c].name == classArr[o].name){
                var targetClass4 = classArr[o];
              }
            }
            for (var z in classes){
              if (classes[z]._id == generalizations[g].target.$ref){
                for(var o=0; o<classArr.length;o++){
                  if (classes[z].name == classArr[o].name){
                    var targetClass3 = classArr[o];
                  }
                }
                generalizationProviders++;
                targetClass3.clients.push(classes[c].name);
                targetClass4.providers.push(classes[c].name);
                console.log("CLIENTS for: " + classes[z].name+ " :  "+ targetClass3.clients )
              }
            }
          }
        }
      }
      for (var d in classAssociations) {
        console.log(classes[i].name+"'s class associations: "+classAssociations[d].end2.reference.$ref)
      }
      console.log("target class providers initial value: "+ targetClass.providers)
      console.log("target class clients initial value: "+ targetClass.clients)
      for(var a in classAssociations){
        if (classAssociations[a].end2.navigable==true){
          associationProviders++;
          for (var c in classes){
            if (classes[c]._id==classAssociations[a].end2.reference.$ref){
              targetClass.providers.push(classes[c].name)
              for (var u in classes){
                for(var o=0; o<classArr.length;o++){
                  if (classes[c].name == classArr[o].name){
                    var targetClass2 = classArr[o];
                  }
                }
                if (classes[u]._id==classAssociations[a].end1.reference.$ref){
                  targetClass2.clients.push(classes[u].name);
                }
              }
            }
          }
        }
      }

      for(var k in atts){
        for(var b in classes){
          if(atts[k].type==classes[b].name){
            attributeProviders++
            targetClass.providers.push(classes[b].name)
            for (var c in classArr){
              if(classArr[c].id == classes[b]._id){
                var targetClass5 = classArr[b];
                targetClass5.clients.push(classes[b].name)
              }
            }
          }
        }
      }

      for(var k in ops) {
        var params = tools.collectElements(ops[k], "_type", "UMLParameter")
        for(var z in params){
          for (var y in classes)
          if(params[z].type==classes[y].name){
            operationProviders++;
            targetClass.providers.push(classes[y].name);
            for(var h in classArr){
              if(classArr[h].name==params[z].type){
                var targetClass6 = classArr[h];
                targetClass6.clients.push(classes[y].name)
              }
            }
          }
        }
      }

      console.log("Number of providers for " + targetClass.name + " by attributes: " + attributeProviders);
      console.log("Number of providers for " + targetClass.name + " by association endpoint: " + associationProviders);
      console.log("Number of providers for " + targetClass.name + " by operation parameters: " + operationProviders);
      console.log("Number of providers for " + targetClass.name + " by generalizations: " + generalizationProviders);
      console.log("Providers for "+ targetClass.name + ": "+ targetClass.providers + ", for a total of: "+ targetClass.providers.length);
      numProviders = attributeProviders + associationProviders + operationProviders+generalizationProviders;
      console.log("Total number of providers for " + classes[i].name+ ": " + numProviders);
      console.log("Total number of providers in TARGET CLASS: " + targetClass.providers.length);
      console.log("Total number of clients for TARGET CLASS: " + targetClass.clients.length);
      console.log(targetClass);
      var methAttAssoc = 0
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
          for (var w in classArr){
            if (classArr[w].id == parameters[x].type.$ref){
              var type = classArr[w].name
            }
          }
          console.log("         " + parameters[x].name + " of type: "+ type);
          atts.forEach(function(att){
            if (att.name==parameters[x].name){
              methAttAssoc+=1
            }
          })
        }
      }
      var totalPossible = numAtts*numOps;
      console.log("Total possible # of method-attribute connections=" + totalPossible)
      targetClass.cohesion = methAttAssoc/totalPossible;
      var instability = targetClass.providers.length/numClasses;
      var stability = 1 - instability;
      var responsibility = targetClass.clients.length/numClasses;
      var deviance = Math.abs(responsibility-stability);
      console.log(classes[i].name + "'s Cohesion: " +  targetClass.cohesion);
      console.log(classes[i].name + "'s Instability: " + instability);
      console.log(classes[i].name + "'s Stability: " +  stability);
      console.log(classes[i].name + "'s Responsibility: " + responsibility);
      console.log(classes[i].name + "'s Deviance: " + deviance) ;
   }
   console.log('\n\n');
   console.log(classArr);
   //GENERATING REPORT HERE
   var table = new Table({
       head: ['Class', 'Stability', 'Responsibility', 'Deviance','Cohesion']
     , colWidths: [100,100,100,100,100]
   });
   classArr.forEach(function(clas){
     var classname = clas.name;
     var instability = clas.providers.length/numClasses;
     var stability = 1 - instability;
     var responsibility = clas.clients.length/numClasses;
     var deviance = Math.abs(responsibility-stability);
     var cohesion = clas.cohesion
     table.push(
       [classname,stability,responsibility,deviance,cohesion]
     );
   });
   console.log(table.toString());
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



// instantiate

main();
