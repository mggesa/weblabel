const fs = require('fs');

export const sentinelPrintPreview = async (content, option, fileName) => {     

        fs.unlink("src/public/sentinel/images/" + fileName + ".jpg", (err) => {
            if (err) 
                console.log('No File!');
            else
                console.log('File deleted!');

            fs.writeFile("src/public/sentinel/preview/" + fileName + ".txt", content, { flag: 'w+' }, err => {
                if (err) {
                    console.error(err)
                    return
                }       

            var fileExist = false;    
            while (!fileExist) {
                if (fs.existsSync("src/public/sentinel/images/" + fileName + ".jpg")) {
                    fileExist = true;
                    console.log('File Ok!');
                }
            }  
        });  
    });
    
    if (option == "print")
    {
        await fs.writeFile("src/public/sentinel/print/" + fileName +".txt", content, { flag: 'w+' }, err => {
        if (err) {
            console.error(err)
            return
            }          
        })    
    }
} 

export const deleteFileLogOut = async (fileName) => {
    await fs.unlink("src/public/sentinel/images/" + fileName + ".jpg", (err) => {
        if (err) 
            console.log('No File!'); 
        else
            console.log('File deleted!');

        return;
        }
    )
};