export class GraphNode {
  name : string;
  // should we delete rows when this value is missing
  // not implemented
  // private filterMissing: boolean = false;
  // factor levels

  private values:string[];
  // the ordered data 
  // which value is missing in values array is missing
  private missingVal:number = null;

  // the column stored as the index in the value array
  public ndata:number[];

  constructor(name: string, column: string[]) {

    this.name = name;
    this.values = [];
    this.ndata = new Array(column.length);

    for (var i: number = 0; i < column.length; i++) {
      var valueIdx = this.values.indexOf(column[i]);
      if (valueIdx === -1) { // push a new value, if it doesn't exist yet
        this.values.push(column[i]);
        valueIdx = this.values.length - 1;
      }
      // store the value
      this.ndata[i] = valueIdx;
    }


    if (this.values.length <= 1) {
      throw new Error(
         'Column ' + name + ' must have at least two differing values'
      ); 
    }

  }

  getName() : string {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
  }

  // returns a list of values with missing first
  getValues( ) : string[] {
    var vals = [];
    if (this.missingVal) {
      vals.push(this.values[this.missingVal]);
    }

    for (var i:number = 0; i < this.values.length; i++) {
      if (!(this.missingVal === i)) {
        vals.push(this.values[i]);
      }
    }
    return vals;
  }

  getValue(i : number) : string {
    return this.values[i];
  }

  // returns the value at the nth row
  getCell(row: number) : string {
    if (row >= this.length()) {
      throw new RangeError; 
    } else {
      return this.values[this.ndata[row]]; 
    }
  }

  // returns number of data points
  length() : number {
    return this.ndata.length;
  }

  setMissingVal(missing: string) {
    this.missingVal = this.values.indexOf(missing);
  }


  // returns missing value if it exists, null if it doesn't
  getMissingVal() : string {
    if (this.missingVal) {
      return this.values[this.missingVal];
    }
    return null;
  }

  getColumn() : Array<string> {
    return this.ndata.map( (index) => { return this.values[index]; } );
  }

  // return the node as a histogram
  histogram() {
    var base_hist = this.values.map( (i) => { return 0 });
    
    this.ndata.forEach( (i) => { base_hist[i]++; return true; });

    return base_hist;
}
