import fs from 'fs';

export default class JsonTransformer {
  static transform(files) {
    let jsonFiles = new Map();

    for(let [path, file] of files){
      for(let classObject of file.classes){
        jsonFiles.set(
          classObject.name.toLowerCase() + '.json',
          JSON.stringify(file)
        );
      }
    }

    return jsonFiles;
  }
}
