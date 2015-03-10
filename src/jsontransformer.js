import fs from 'fs';

export default class JsonTransformer {
  constructor(data, jsonFile) {
    fs.writeFileSync(jsonFile, JSON.stringify(data));
  }
}
