const express = require('express');
const pdf = require("pdf-creator-node");
const fs = require("fs");
const app = express();
const jsonParser = require('body-parser').json();

app.post('/',jsonParser,(req,res) => {
  
  const html = fs.readFileSync(__dirname+"/template/template.html","utf-8");
  const logo = fs.readFileSync(__dirname+"/template/img/logo.png").toString("base64");
  const currencyFormatter = new Intl.NumberFormat('de-DE',{ style: 'currency', currency: 'EUR'});
  req.body.order.items.forEach((item,i)=>{
     req.body.order.items[i].price = currencyFormatter.format(item.price);
  });
// On ubuntu fonts were about 30% bigger after converting to pdf for some reason, so i increased paper size
  let width = 8.3;
  let height = 11.7;
  if(process.platform === "linux"){
    width = 8.3*1.3;
    height = 11.7*1.3
  }
  const options ={
    width:width+"in",
    height:height+"in",
    orientation: "portrait",
    border: "20mm",
    
   }

    req.body.logo = logo;
    const document = {
        html: html,
        data: req.body,
        path: __dirname+"/test/output.pdf",
        type: "",
    }
    pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
  const pdf_return = fs.readFileSync(__dirname+"/test/output.pdf");
  
  res.send(pdf_return);
  
})
app.listen(3000, () => console.log('app is listening on port 3000.'));