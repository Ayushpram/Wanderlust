const mongoose=require("mongoose");

let MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);

}
main().then(()=>{console.log("connected to db");})
.catch((err)=>{console.log(err);});

const Listing=require("../models/listing.js");
const data=require("./data.js");
const insertData=async function(){
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("data initialised");
}
insertData();