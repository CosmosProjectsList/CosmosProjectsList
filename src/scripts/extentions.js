function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}

module.exports.json2array = json2array;

function jsonEqual(obj1, obj2){
    if(typeof obj1 === "undefined" || typeof obj2 === "undefined" ){
        return false;
    }
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

module.exports.jsonEqual = jsonEqual;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  module.exports.sleep = sleep;