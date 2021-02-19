const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(opts) {
    
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    
    this.path = path.join(userDataPath, opts.configName + '.json');
    
    this.data = parseDataFile(this.path, opts.defaults);
  }
  
  // This will just return the property on the `data` object
  get() {
    return this.data;
  }
  
  // ...and this will set it
  set( val) {
    this.data = val;
    
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath, defaults) {
  
  try {
    return  JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

module.exports = Store;