import fs from 'fs';

import JavascriptParser from './javascriptparser';

export default class FileManager {
  static getFiles(path) {
    let files = new Map();
    let pathStat = fs.statSync(path);

    if(pathStat.isFile()){
      files.set(
        path,
        new JavascriptParser(fs.readFileSync(path, {encoding: 'utf8'}))
      );
    }else if(pathStat.isDirectory()){
      for(let file of fs.readdirSync(path)){
        if(fs.statSync(path + '/' + file).isFile() && file.match(/\.js$/) !== null){
          files.set(
            path + '/' + file,
            new JavascriptParser(fs.readFileSync(path + '/' + file, {encoding: 'utf8'}))
          );
        }
      }
    }else{
      throw new Error("Invalid input path supplied to " + this.constructor.name);
    }

    return files;
  }

  static writeFiles(files, output) {
    if(fs.existsSync(output) && fs.statSync(output).isDirectory()){
      for(let [path, file] of files){
        fs.writeFileSync(output + '/' + path, file, {encoding: 'utf8'});
      }
    }else{
      for(let [path, file] of files){
        fs.writeFileSync(output, file, {encoding: 'utf8'});
        break;
      }
    }
  }
}
