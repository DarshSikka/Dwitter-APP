const express=require("express")
const mongoose=require("mongoose");
const fs=require("fs");
const path=require("path");
const cookies=require("cookie-parser");
const secrets=JSON.parse(fs.readFileSync(path.join(__dirname, "secrets.json")));
console.log(secrets);  
const uri=`mongodb+srv://User1:${secrets.password}@projectdweeps.ncacg.mongodb.net/Everything?retryWrites=true&w=majority`;

mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true}).then(
   ()=>{ console.log("Connection Established")}
).catch(err=>{console.error(err)})
const app=express()
app.use(cookies())
const expressLayouts=require("express-ejs-layouts");
const port=process.env.PORT || 5000
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));
app.use('/', require("./routes/index"));
app.use('/users', require("./routes/users"));
app.use('/dweet', require("./routes/dweet"));
app.listen(port, console.log(`Listening on port ${port}`));