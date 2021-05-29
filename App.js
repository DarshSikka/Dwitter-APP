const express=require("express")
const mongoose=require("mongoose");
require("dotenv").config();
const path=require("path");
const cookies=require("cookie-parser");
const uri=process.env.DB_URI;
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
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/dweet', require("./routes/dweet"));
app.listen(port, console.log(`Listening on port ${port}`));