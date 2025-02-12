  //  Using the "type": "module"  in package.json use import and export instead of require() and module.exports.

import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Server has started at Port ${process.env.PORT}`); 
})