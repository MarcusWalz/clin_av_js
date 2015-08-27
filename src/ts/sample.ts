
// Pipeline for sampling / selecting data


// Negative Values Denote Rows Excluded From The Data Set
const FILTER     = -1; // filtered out
const VALIDATION = -2; // part of the validation set

interface ISampleArray {
  [i:number]:number;
  length: number;
}

export interface ISampleFunction {
  (ISample) : ISample 
}

export interface ISample {
  arr: ISampleArray;
  rlength: number; // equal to length - number of negative values
}

export function newSample(n:number) : ISample {
  var arr = new Array(n);
  for(var i = 0; i < n; i++) {
    arr[i] = 0;
  }
  return { arr: arr, rlength: n };
}

export function exeSampleFunction(f: ISampleFunction[], n:number) : ISample {
  return addSampleFunctions(f)(newSample(n));
}

export function addSampleFunctions(f:ISampleFunction[]) : ISampleFunction {
  return (samp) => f.reduce( (a,b) => b(a), samp);
}

// stash some percent for validation
export function stash(p:number=0.1) : ISampleFunction {
  return (samp : ISample) => {
    var target = Math.ceil(samp.rlength * p);

    while(target >= 0) {
      var pick = Math.floor(samp.arr.length);
      if( samp.arr[pick] >= 0) {
        samp.arr[pick] = VALIDATION;
        samp.rlength--;
        target--;
      }
    }

    return samp;
  }
}

// Speedy sample function.
export function sample( bootstraps:number    // number of bootstraps
                      , prob:number = 0.9    // precent of training data to bootstrap
                      , nudge:boolean = true // ensure number of samples equal to
                      ) : ISampleFunction {

  return (sample : ISample) =>  {
    var out = sample.arr;
    var n = sample.rlength;

    var lambda = bootstraps * prob;
    var sum  = 0; // the total number of rows selected
    for(var i = 0; i < out.length; i++) {
      if(out[i] < 0) { continue; }
      //using inverse poisson algorithm found on wikipedia's poisson page
      var x = 0;
      var p = Math.exp(-lambda);
      var s = p;
      var u = Math.random();

      while ( u > s) {
        x += 1;
        p *= lambda/x;
        s += p;
      }
      sum +=   x;
      out[i] = x;
    }

    if (nudge) {
      var total_selects = Math.floor(n * bootstraps * prob);
      while (sum != total_selects) {
        var s = Math.floor(Math.random()*n);
        if(out[s] >= 0) {
          if(sum < total_selects) { 
            out[s]++; sum++;
          } else {
            out[s]--; sum--;
          } 
        }
      } 
    }

    return sample;
  }
}
