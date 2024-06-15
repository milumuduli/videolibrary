var mongoClient=require("mongodb").MongoClient;
var express=require("express");
var cors=require("cors");
var app=express();
var conStr="mongodb://127.0.0.1:27017";
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.get("/getusers",(request,response)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("videotutorials");
        database.collection("tblusers").find({}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        });
    });
});
app.get("/getadmin",(request,response)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("videotutorials");
        database.collection("tbladmin").find({}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        });
    });
});
app.get("/getcategories",(request,response)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("videotutorials");
        database.collection("tblcategories").find({}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        });
    });
});
app.get("/getvideos",(request,response)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("videotutorials");
        database.collection("tblvideos").find({}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        })
    })
})
app.get("/getvideo/:id",(request,response)=>{
    var id=parseInt(request.params.id);
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("videotutorials");
        database.collection("tblvideos").find({VideoId:id}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        })
    })
})
app.post("/adduser",(request,response)=>{
    var user={
        "UserId":request.body.UserId,
        "UserName":request.body.UserName,
        "Password":request.body.Password,
        "Email":request.body.Email,
        "Mobile":request.body.Mobile
    };
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("videotutorials");
        database.collection("tblusers").insertOne(user).then(()=>{
            console.log("User Added");
            response.end();
            });
        });
    });
app.post("/addvideo",(request,response)=>{
    var video={
        VideoId:parseInt(request.body.VideoId),
        Title:request.body.Title,
        Url:request.body.Url,
        Likes:parseInt(request.body.Likes),
        Views:parseInt(request.body.Views),
        CategoryId:request.body.CategoryId
    };
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("videotutorials");
        database.collection("tblvideos").insertOne(video).then(()=>{
            console.log("Video Added");
            response.end();
        });
    });
});
app.put("/updatevideo/:id",(request,response)=>{
    var id=parseInt(request.params.id);
    var video={
        VideoId:parseInt(request.body.VideoId),
        Title:request.body.Title,
        Url:request.body.Url,
        Likes:parseInt(request.body.Likes),
        Views:parseInt(request.body.Views),
        CategoryId:request.body.CategoryId
    };
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("videotutorials");
        database.collection("tblvideos").updateOne({VideoId:id},{$set:video}).then(()=>{
            console.log("video Updated");
            response.end();
        });
    });
});
app.delete("/deletevideo/:id",(request,response)=>{
    var id=parseInt(request.params.id);
    mongoClient.connect(conStr).then(clientObject=>{
        var database=clientObject.db("videotutorials");
        database.collection("tblvideos").deleteOne({VideoId:id}).then(()=>{
            console.log("Video Deleted");
            response.end();
        });
    });
});
app.listen(3300);
console.log("servert Started http://127.0.0.1:3300");