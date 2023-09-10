const fileURLTOPath = require('url');
import {dirname} from 'path';
const __filename = fileURLTOPath.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
