//"StAuth10222: I Nakshi Dudhiya, 000793267 certify that this material is my original work.
// No other person's work has been used without due acknowledgement.
// I have not made my work available to anyone else."


const { default: axios } = require("axios");
const { Client, Intents} = require("discord.js");
let yelpAPI = require('yelp-api');

let apiKey = "gjUwbkjtv1gYmWp9O32uO1nJeRSh-TVYQqvVIVroP2ANgcQ0vd7xYi1uNv83B80Z6hkkURqLIxFigUsr0J_Oj0__6FEUVGxRAx5t4BCPB-CzwcuL83P83X1Wz79jYXYx";

let yelp = new yelpAPI(apiKey);

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("ready", function(){
    console.log(`Logged in as ${client.user.tag}`);
});

async function getResult(){
    client.on("messageCreate", async function(message){

        if (!message.author.bot){
            command= message.content.split(" ");
            console.log("command: "+command);

            //1. Italian Restaurants hamilton
            if (command[1]=="Restaurants")
            {
                categoryInput= command[0];
                locationInput= command[2];
                params= [{term: categoryInput},
                        {location: locationInput}];
                console.log("Params: " + params);
                var data =  await yelp.query("businesses/search",params);
                    //console.log(data);
                var obj= JSON.parse(data);
                console.log(obj);
                var names=[];
                obj.businesses.map(({name})=> names.push(name));
                await message.reply(obj.total +" Restaurants found!\n" + names );

            }

            //2. Phone Search 
            else if(command[0]=="Restaurant" && command[1]== "Phone")
            {
                num= command[2];
                console.log("number" +num);
                params= [{phone: num}];
                var data =  await yelp.query("businesses/search/phone",params);
                console.log(data);
                var obj= JSON.parse(data);
                console.log(obj);
                console.log("Location: "+ obj.businesses[0].location.address1);
                var result= (obj.businesses[0].name);
                await message.reply("The Restaurant Name is: "+ result + " at " 
                    + obj.businesses[0].location.address1 + ", " + obj.businesses[0].location.city);
            }

            //3. Open Gyms latitude longitude radius 
            else if (command[0]=="Open" && command[1]=="Gyms"){
                openInput= true;
                catInput= command[1];
                latiInput= command[2];
                longiInput= command[3];
                radInput= command[4];
                params=[{term: catInput}, 
                        {latitude: latiInput},
                        {longitude: longiInput},
                        {radius: radInput},
                        {open_now: openInput}
                ];
                var data =  await yelp.query("businesses/search",params);
                var obj= JSON.parse(data);
                console.log(obj);
                var names=[];
                obj.businesses.map(({name})=> names.push(name));
                await message.reply(obj.total +" Gyms are Open at the moment!\n" + names );
            }

            //4. Nearest 3 Boating burlington
            else if(command[0]== "Nearest"){
                limitInput= command[1];
                locationInput = command[3];
                catInput= command[2];
                
                params= [
                    {location: locationInput},
                    {categories: catInput},
                    {sort_by: "distance"},
                    {limit: 3}
                ];
            
                var data= await yelp.query("businesses/search", params);
                var obj= JSON.parse(data);
                console.log(obj);
                var places=[];
                obj.businesses.map(({name})=> places.push(name));
                await message.reply("Nearest 3 boating places: " + places);                
            }

            //5. Free popular event Burlington
            else if(command[1]=="event"){
                cost= true;
                sortInput= "popularity";
                locationInput= command[2];

                params =[
                    {is_free: cost},
                    { location: locationInput},
                    {sort_on: sortInput}
                    
                ];
                var data =  await yelp.query("events",params);
                var obj= JSON.parse(data);
                console.log(obj);
                
                await message.reply("Events Found: " + obj.events[0].name  + "\n Description:" +
                            obj.events[0].description + "\n Time: " + obj.events[0].time_start); 
            }

            //6. Category
            else if(command[0]== "Category"){
                var type = command[1];
                params= [ {alias: type}];
                var data= await yelp.query("categories",params);
                var obj= JSON.parse(data);
                console.log(obj);
                await message.reply("Category Received!");
            }

        }    
    });

}
getResult();

client.login("ODk1NTQzODc5NDI2Nzk3NjMw.YV6GOw.2PQ-3Dcbmg2yntlhFTqCqSHOeUE");
