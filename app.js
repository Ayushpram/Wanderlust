const express=require("express");
const app=express();
const path=require("path");
const ejsMate=require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
let MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);

}
main().then(()=>{console.log("connected to db");})
.catch((err)=>{console.log(err);});
app.listen(8080,()=>{
    console.log("server running");
});
app.get("/",(req,res)=>{
    res.send("hi i am root");
});
app.get("/listing",async (req,res)=>{
const allListings=await Listing.find({});
    res.render("./listing/index.ejs",{allListings});


});
app.get("/listing/new",(req,res)=>{

   res.render("./listing/new.ejs");
});
app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
 const listing=await Listing.findById(id);
 res.render("./listing/show.ejs",{listing});
});
// create route
app.post("/listing",async(req,res,next)=>{
//  let{title,des,image,price,location,country}=req.body;
try{
    let listing=req.body;
let newC =new Listing(listing.listing);
await newC.save();
// let list=await Listing({
//     title:title,
//     description:des,
//     image:image,
//     price:price,
//     location:location,
//     country:country
// });
// list.save();
res.redirect("/listing");
}
catch(err){
    next(err);
}

});
app.get("/listing/:id/edit",async(req,res)=>{
let {id}=req.params;
let list=await Listing.findById(id);
res.render("./listing/edit.ejs",{list});

});
app.put("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    let listing=req.body.listing;
   
    await Listing.findByIdAndUpdate(id,{...listing});
  res.redirect(`/listing/${id}`);


});
app.delete("/listing/:id",async(req,res)=>{
 let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});
app.use((err,req,res,next)=>{
    res.send("something went wrong!");
});