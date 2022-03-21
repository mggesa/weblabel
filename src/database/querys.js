export const querysProducts = {
  getAllProducts: "SELECT * FROM [products].[dbo].[Products]",  
  getProductById: "SELECT *, (SELECT Vars FROM [products].[dbo].[Labels] Where [products].[dbo].[Labels].[Label] = [products].[dbo].[Products].[Label]) AS Vars FROM [products].[dbo].[Products] Where Code like @code",
  addNewProduct: "INSERT INTO [products].[dbo].[Products] (Code, Name, Description, Quantity) VALUES (@code,@name,@description,@quantity);",
  deleteProduct: "DELETE FROM [products].[dbo].[Products] WHERE Code = @code",
  getTotalProducts: "SELECT COUNT(*) FROM [products].[dbo].[Products]",
  updateProductById: "UPDATE [products].[dbo].[Products] SET Code = @code, Name = @name, Description = @description, Quantity = @quantity WHERE Code = @code",
  getLabelById: "SELECT * FROM [products].[dbo].[Labels] Where Name = @name"
};

export const querysPrinters = {
  getAllPrinters: "SELECT * FROM [products].[dbo].[Printers]",
  getPrinterById: "SELECT TRIM(Printer) AS Printer, TRIM(Alias) AS Alias FROM [products].[dbo].[Printers] WHERE [Printers].[Id] = @id",
};

