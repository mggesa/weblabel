import { Router } from "express";

import {
    getPrinters,
    setDefaultPrinter,
    getDefaultPrinter
  } from "../controllers/printers.controller";

  const router = Router();
  
  router.get("/printers", getPrinters);

  router.get("/printers/set/:id", setDefaultPrinter); 
  
  router.get("/printers/get/:id", getDefaultPrinter)
  
  export default router;
