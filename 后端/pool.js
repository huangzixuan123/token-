const mysql=require("mysql");
// const baseUrl = process.env.NODE_ENV === 'production' ? '47.112.182.67' : '47.112.182.67'

var pool=mysql.createPool({
	host:"47.112.182.67",
	// host:baseUrl,
	port:3306,
	user:"13702915293",//test
	password:"a6696644",//123
	database:"user",
	connectionLimit:15
});
module.exports=pool;