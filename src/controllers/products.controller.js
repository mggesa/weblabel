import { getConnection, querysPrinters, querysProducts, sql } from "../database";
import { sentinelPrintPreview } from "../utils/writeFiles";

export const getProducts = async (req, res) => {
  try {    
    const defaultPrinter = {
      Printer: req.session.printer,
      Alias: req.session.alias
    };    

    if (defaultPrinter.Printer == undefined)
        res.redirect ("/printers"); 
    else{
      const pool = await getConnection();
      const result = await pool
          .request()
          .query(querysProducts.getAllProducts);
  
      res.render("index", {products: result.recordset, encontrado: false, buscar: true});  
    }    
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const pool = await getConnection();
    const vars = [];
    const defaultPrinter = {
      Printer: req.session.printer,
      Alias: req.session.alias
    };   

    if (defaultPrinter.Printer == undefined)
        res.redirect ("/printers");
    else{      
        const result = await pool
          .request()
          .input('Code', sql.NVarChar(10), '%' + req.body.Code + '%')
          .query(querysProducts.getProductById);     

          for (let [key, value] of Object.entries(req.body)) {
            if (key != "Code" && key != "serialqty" && key != "Printer" && key != "Alias")
            {
              vars.push({
                name: key,
                value: value
              });
            }     
          } 
        
        if (result.rowsAffected == 1)
        {            
          sentinelPrintPreview(JSON.stringify(result.recordset[0]), "preview", req.sessionID)
          let vars = [];
          result.recordset[0].Vars.split("/").forEach(element => {
            vars.push({
              name: element,
              data: ""
            })        
          });      

          res.render("index", {products: result.recordset[0], defaultPrinter , encontrado: true, vars, idSession: req.sessionID});
        }
        else{
          res.render("index", {products: result.recordset, encontrado: false});
        }
      }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const printProductById = async (req, res) => {
  try {
    const pool = await getConnection();    

    const vars = [];  
    const defaultPrinter = {
      Printer: req.session.printer,
      Alias: req.session.alias
    };   

    for (let [key, value] of Object.entries(req.body)) {
      if (key != "Code" && key != "serialqty" && key != "Printer" && key != "Alias")
      {
        vars.push({
          name: key,
          value: value
        });
      }     
    }      

    const result = await pool
      .request()
      .input('code', sql.NVarChar(10), req.body.Code)
      .query(querysProducts.getProductById);
    
    if (result.rowsAffected == 1)
    {            
      let objectPreview = Object.assign(result.recordset[0] , req.body, defaultPrinter);  

      sentinelPrintPreview(JSON.stringify(objectPreview), req.params.print , req.sessionID)  
      
      res.render("index", {products: result.recordset[0], encontrado: true, vars, defaultPrinter, idSession: req.sessionID});
    }

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const createNewProduct = async (req, res) => {
  const { Code, Name, Description, Label } = req.body;
  let { Quantity } = req.body;

  // validating
  if (Description == null || Code == null || Label == null || Name == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  if (Quantity == null) Quantity = 0;

  try {
    const pool = await getConnection();

    await pool
      .request()
      
      .input("code", sql.VarChar, Code)
      .input("name", sql.VarChar, Name)
      .input("description", sql.Text, Description)
      .input("label", sql.Text, Label)
      .input("quantity", sql.Int, Quantity)
      .query(querysProducts.addNewProduct);

    res.redirect ("/");
    //res.json({ Code, Name, Description, Quantity, Label });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


export const deleteProductById = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("code", req.params.code)
      .query(querysPrinters.deleteProduct);

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getTotalProducts = async (req, res) => {
  const pool = await getConnection();

  const result = await pool.request().query(querysPrinters.getTotalProducts);
  res.json(result.recordset[0][""]);
};

export const updateProductById = async (req, res) => {
  const { Code, Name, Description, Label, Quantity } = req.body;

  // validating
  if (Description == null || Name == null || Quantity == null || Label == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("name", sql.VarChar, Name)
      .input("description", sql.Text, Description)
      .input("quantity", sql.Int, Quantity)
      .input("code", req.params.code)
      .query(querys.updateProductById);
    res.json({ Name, Description, Label, Quantity });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
