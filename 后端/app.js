const express=require("express");
const bodyparser=require("body-parser");//body中间件
const userrouter=require("./router/user.js");//用户信息路由
const cors=require("cors");//解决跨域的中间件
// const path =request('path')
var server=express();
// server.all("*", function (req, res, next) {
//   res.header("Access-Control-Allow-Headers", "X-Requested-With,Authorization");
//   next();
// });
// server.listen(3000);
// console.log("node后端 启动成功")
server.use(cors({//统一伪装跨域，之后不用再res.writeHead
    // origin:["http://localhost:3000"]
    // origin:["http://localhost:8080"]

    // origin:["http://47.112.182.67:3000"]
    // origin:["http://47.112.182.67:8080"]
  })),
// server.use(express.static(path.join(__dirname,"./public/dist")));//用户的静态资源

server.use(express.static("./public/dist"));//用户的静态资源

//server.use(express.static(path.join(dist,'public')));


//回头将(bodyparser.json()这个文件加上去！！！！！！！！！！！！！！！！！！！！！！！！！！
server.use(bodyparser.json()),
//挂载用户信息路由
server.use("/user",userrouter);






server.listen(3002, '0.0.0.0',function(req,res){		//创建服务器
	console.log('可以启动啦'+'http://localhost:3002');
})


// var request = require('request');
// var AppID = 'wx726f1d93af637d05';
// var AppSecret = '01b843e403456b727940579f29e05f2f';
// server.get('/code', function(req,res){
//     var router = 'coto';
//     var return_uri = 'http://127.0.0.1:3000'; 
//     // var scope = 'snsapi_login'; //网页
//     var scope = 'snsapi_userinfo'; //网页
//     var state = 'state';
//     // res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0e81c3bee622d60&redirect_uri=http%3A%2F%2Fnba.bluewebgame.com%2Foauth_response.php&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect');

//     res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state='+state+'#wechat_redirect');
//   });

//   server.get('/get_wx', function(req,res, next){
//     var code = '031kvWGa1l9RhA0l1uGa1EsqUz4kvWGD';
//     //   var code = req.query.code;  //实际上是获取前端请求的code
//       request .get(
//           {
//               url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code'
//               // url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx726f1d93af637d05&secret=001aOv100eCETK1XTX0008xJd32aOv1n&code=011vjQFa1xwvfA08q5Ja1fFbic2vjQFW&grant_type=authorization_code'


//           }, 
//           function(error,response,body){
//               if(response.statusCode == 200){
//                   let data = JSON.parse(body)
//                   let access_token = data.access_token;
//                   let openid = data.openid;
//                   request .get(
//                       {
//                           url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'
//                       },
//                       function(error,response,body){
//                           var userinfo = JSON.
//                           parse(body);
//                           console.log(userinfo)
//                           res.send("\
//                               <h1>"+userinfo.nickname+" 的个人信息</h1>\
//                               <p><img src='"+userinfo.headimgurl+"' /></p>\
//                               <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
//                           ");
//                       }
//                   )
//               }
//           }
//       )
//   })
  



//   server.get('/wx_login', function(req,res, next){
//     //console.log("oauth - login")
    
//     // 第一步：用户同意授权，获取code
//     var router = 'get_wx_access_token';
//     // 这是编码后的地址
//     var return_uri = 'http%3A%2F%2Fwww.onelib.biz%2Foauth%2F'+router;  
//     var scope = 'snsapi_userinfo';
    
//     res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');
    
// });







//   server.get('/get_wx', function(req,res, next){
//         // var code = '081Pb0000UyEUK13fp100WvWe54Pb00j';

//     // console.log("get_wx_access_token")
//     // console.log("code_return: "+req.query.code)
    
//     // 第二步：通过code换取网页授权access_token
//     var code = req.query.code;
//     request.get(
//         {   
//             url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
//         },
//         function(error, response, body){
//             if(response.statusCode == 200){
                
//                 // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
//                 //console.log(JSON.parse(body));
//                 var data = JSON.parse(body);
//                 var access_token = data.access_token;
//                 var openid = data.openid;
                
//                 request.get(
//                     {
//                         url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
//                     },
//                     function(error, response, body){
//                         if(response.statusCode == 200){
                            
//                             // 第四步：根据获取的用户信息进行对应操作
//                             var userinfo = JSON.parse(body);
//                             //console.log(JSON.parse(body));
//                             console.log('获取微信信息成功！');
                            
//                             // 小测试，实际应用中，可以由此创建一个帐户
//                             res.send("\
//                                 <h1>"+userinfo.nickname+" 的个人信息</h1>\
//                                 <p><img src='"+userinfo.headimgurl+"' /></p>\
//                                 <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
//                                 <h1>"+code+" </h1>\
//                             ");
                            
//                         }else{
//                             console.log(response.statusCode);
//                         }
//                     }
//                 );
//             }else{
//                 console.log(response.statusCode);
//             }
//         }
//     );
// });