import { getConnection, querysPrinters, sql } from "../database";

  export const getPrinters = async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool
          .request()
          .query(querysPrinters.getAllPrinters);

      const defaultPrinter = {
        Printer: req.session.printer,
        Alias: req.session.alias
      };    
      
      res.render("printers", {printers: result.recordset, defaultPrinter});    
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  };   
    
  export const setDefaultPrinter = async (req, res) => {
    try {
      const pool = await getConnection();
      const resultDefaultPrinter = await pool
          .request()
          .input("id", req.params.id)
          .query(querysPrinters.getPrinterById);
          
          const resultGetPrinters = await pool
              .request()
              .query(querysPrinters.getAllPrinters);

      req.session.printer = resultDefaultPrinter.recordset[0].Printer;
      req.session.alias = resultDefaultPrinter.recordset[0].Alias;

      res.render("printers", {printers: resultGetPrinters.recordset, defaultPrinter: resultDefaultPrinter.recordset[0]});    
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  };

  export const getDefaultPrinter = async (req, res) => {
    try {
      const pool = await getConnection();

      const result = await pool
        .request()
        .input("alias", req.params.alias)
        .query(querysPrinters.getDefaultPrinter);     

      res.redirect("/printers", {defaultPrinter: result.recordset[0]});    
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  };
