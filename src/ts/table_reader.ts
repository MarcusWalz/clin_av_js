/// <references "app.d.ts" />
/// <references "graph_node.ts" />

import ng         = require('angular');
import papa       = require('papaparse');
import graph_node = require('graph_node');

// papa parsed object not in def file
function constructTable(table) : graph_node.GraphNode[] {
  var hash = {};
  table.meta.fields.forEach((f) => { hash[f] = []; });
  table.data.forEach((row) => {
    for (var field in row) {
      hash[field].push(row[field]);
    }
  });


  var nodes = [];
  for (var field in hash) { 
    nodes.push(new graph_node.GraphNode(field, hash[field]));
  }

  return nodes;
}

export class TableReaderService {
  
  public static inject = ['$q'];

  constructor(private $q:ng.IQService) {

  }


  get(url : string) : ng.IPromise<graph_node.GraphNode[]> {
    var deferred : ng.IDeferred<graph_node.GraphNode[]> = this.$q.defer();
    deferred.notify("About to read table");

    papa.parse(url, {
      download: true,
      delimiter: ' ',
      header: true,
      error : (err) => deferred.reject(err),
      complete : (out, err) => { 
        return err ? deferred.reject(err) : deferred.resolve(constructTable(out));
      }
    });

    return deferred.promise;
  }             
}
