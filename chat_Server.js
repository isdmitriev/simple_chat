/**
 * Created by home on 25.04.2016.
 */

"use strict";


class messageHelper
{
    constructor()
    {
        this.message=null;
        this.initilizeMessage();
    }
    initilizeMessage()
{
    var mongoose = require('mongoose');
    mongoose.createConnection('mongodb://localhost/simchat');
    var messagesSchema = new mongoose.Schema({
        content: String,
        userName: {type: String},
        date: {type: String},
        fName: {type: String},
        lName: {type: String}
    });


    this.message = mongoose.model('message', messagesSchema);
}
    getALLMessages(sender)
    {

        this.message.find(function(err,result)
        {


            sender.send(JSON.stringify(result));

        }
        );
    }
    addMessage(mess)

    {
        var message=new this.message
        (
            {
                content:mess.content,
                userName:mess.userName,
                date:mess.date,
                fName:mess.fName,
                lName:mess.lName


        }
        );
        message.save(function(err,message){

        }
        );
    }

}

class userHelper
{
    constructor()
    {
        this.user=null;

        this.initilizeUser();

    }
    initilizeUser()
    {

        var mongoose = require('mongoose');
        mongoose.connect('mongodb://localhost/simchat');
        var userSchema = new mongoose.Schema({
            userName: {type: String}
            , fName: String
            , lName: String
            , password: String
        });


        this.user = mongoose.model('user', userSchema);
    }


        getAllUsers()
    {
        this.user.find({},function(err,res)
        {

            console.log(JSON.stringify(res));
        }
        );
    }

    isUserExist(user,sender,usob)
    {
        this.user.find({userName:user.userName},function (error,result) {

            if(result.length>0)
            {
                sender.send(JSON.stringify({res:false,type:'check'}));

            }
            else
            {


                sender.send(JSON.stringify({res:true,type:'check'}));
                 usob.createUser(user);


            }

        });
    }

    getAutUser(username,password,sender)
    {
        this.user.find({userName:username,password:password},function(error,result)
        {
            if(result.length>0)
            {


                sender.send(JSON.stringify({status:'success',user:result}));
            }
            else
            {

                sender.send(JSON.stringify({status:'noUuser'}));
            }
        }
        );
    }

    createUser(userob)
    {

        var us = new this.user({
            userName:userob.userName
            , fName:userob.fName
            , lName:userob.lName // Notice the use of a String rather than a Number - Mongoose will automatically convert this for us.
            , password:userob.password
        });


        us.save(function(err,us) {

        });

    }

}

class webSocketHelper
{
    constructor()
    {
        this.initilizeServer();
    }

    initilizeServer(err,messages2)
    {
        var user=new userHelper();

        var mes=new messageHelper();

        var WebSocketServer = require('ws').Server;
        var wss = new WebSocketServer({port: 8086});
        wss.on('connection', function (ws)
        {
            ws.on('message', function (message)

                {
                    var m=JSON.parse(message);
                    if(m.type=="insert_User")

                    {
                        user.isUserExist(m.datauser,ws,user);

                    }
                    if(m.type=="allmessages")
                    {


                        mes.getALLMessages(ws);
                    }
                    
                    if(m.type=="checkuser")
                    {
                        
                        user.getAutUser(m.datauser.userName,m.datauser.password,ws);
                    }

                    if(m.type=="addMessage")
                    {

                        mes.addMessage(m.datauser);
                    }
                }

                );
            }
        )

    }
    getMessages()
    {
this.message.find(this.initilizeServer.bind(this));

    }

}

var socket=new webSocketHelper();




























