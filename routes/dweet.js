const express=require("express")
const router=express.Router();
const Dweeter=require("../models/Dweeter");
router.get('/:id', (req, res)=>{
    if(req.params.id=="create"){
        res.redirect('/dweet/create/postdweet');
    }
    Dweeter.findOne({_id:req.params.id}).then((result)=>{
        if(result){
        res.render('viewDweet.ejs', {dweet:result});
        }
        else{
            res.status(404).render("notFound", {id:req.params.id});
        }
}).catch(err=>{
        res.status(404).render("notFound", {id:req.params.id});
}
    )
});
router.get('/', (req, res)=>{
    if(typeof req.cookies.legal!='undefined'){
        if(req.cookies.legal){
        Dweeter.find({}).sort([['last_updated_at', -1]]).then(result=>{
            res.render('dashboard',{email:req.cookies.email, display:result});
        });
        }
        else{
            res.redirect("/users/login");
        }
    }
    else{
        res.redirect('/users/login')
    }
});
router.get('/create/postdweet', (req, res)=>{
    if(typeof req.cookies.legal!='undefined'){
        if(req.cookies.legal){
        res.render("create.ejs");
        }
        else{
            res.redirect("/users/login");
        }
    }
    else{
        res.redirect('/users/login')
    }
});
router.post('/create/postdweet', (req, res)=>{
    const dweet=req.body.dweet;
    let error="";
    if(dweet!=""){
        if(dweet.length<=140){
        let sender=new Dweeter({ posted_by_name:req.cookies.email, dweet});
        sender.save();
        res.send("<CENTER><h1>Dweet Posted<br><button><a href='/dweet'>Home</a></button></h1></CENTER>");
        }
        else{
            error="Dweet has to be less than or equal to 140 characters";
            res.status(400).send(error);
        }
    }
    else{
        error="Dweet Can't be empty";
        res.status(400).send(error);
    }
});
router.get('/:id/delete', (req, res)=>{
    res.render("deleton.ejs");
})
router.post('/:id/delete', (req, res)=>{
    console.log(req.params.id);
    Dweeter.findOne({_id:req.params.id}).then((result)=>{
        if(result){
            if(result.posted_by_name==req.cookies.email){
                Dweeter.findByIdAndDelete(req.params.id, (err, result)=>{
                    if(err){
                        res.status(400).send(err);
                    }
                    else{
                        res.send(`<h1 style="color:green">DELETE REQUEST SUCCESSFULL</h1><a href="/dweet">Home</a>`)
                    }
                });
        }
        else{
            res.status(400).send("<h1 style='color:red;'>You don't have access to this document</h1>");
        }
             }
            else{
                res.status(404).render("notFound", {id:req.params.id});
            }}
    ).catch(err=>{
        res.status(400).send(err);
    });
    ;
});
router.get('/:id/update', (req, res)=>{
    res.render("Update");
});
router.post('/:id/update', (req, res)=>{
    const id=req.params.id;
    const replace=req.body.dweet;
    if(replace.length>140 || replace.length<=0){res.status(400).send("Must not be empty and less than 141 characters")}
    else{
    Dweeter.findOne({_id:id, posted_by_name:req.cookies.email}).then(
        (result)=>{
            if(result){
                Dweeter.findByIdAndUpdate(id, {dweet:replace, last_updated_at:new Date()}, (err, docs)=>{
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.send("<H1>HOORAY DONE <a href='/dweet'>Home</a></H1>")
                    }
                }) 
            }
            else{
                res.status(400).send("<h1>You can't access that document with that id or it may be inexistent</h1>")
            }
        }
    ).catch(err=>{
        res.status(400).send("<h1> Either you can't access it or this document is inexistent</h1>")
    });
}
});
router.get("/:user/alldweets/", (req, res)=>{
    Dweeter.find({posted_by_name:req.params.user}).sort([['last_updated_at', -1]]).then(gotcha=>{
        if(gotcha){
            res.render("userDweets.ejs", {display:gotcha});
        }
    }).catch(err=>{res.status(404).send(err);console.error(err)});
})
module.exports=router;