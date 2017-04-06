exports.extract = function(ops){
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
