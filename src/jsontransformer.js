import fs from 'fs';

export default class JsonTransformer {
  constructor(data, jsonFile) {
    let json = JSON.stringify(data[0][0]);

    fs.writeFileSync(jsonFile, json);

    //console.log(template({data: data[0][0]}));
  }
}
