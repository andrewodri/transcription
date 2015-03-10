import fs from 'fs';

import Parser from './parser';

export default class FileManager {
  constructor(path) {
    this.files = [];

    this.processFiles(
      this.getFiles(path)
    );
  }

  getFiles(path) {
    let files = [];
    let pathStat = fs.statSync(path);

    if(pathStat.isFile()){
      files.push(path);
    }else if(pathStat.isDirectory()){
      for(let file of fs.readdirSync(path)){
        if(fs.statSync(path + '/' + file).isFile() && file.match(/\.js$/) !== null){
          files.push(path + '/' + file);
        }
      }
    }else{
      throw new Error("Invalid path supplied to " + this.constructor.name);
    }

    return files;
  }

  processFiles(files) {
    for(let file of files){
      this.files.push(new Parser(file));
    }
  }
}
