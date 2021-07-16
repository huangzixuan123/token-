const express = require("express");
var router = express.Router();
const pool = require("../pool.js");
//  let fs = require('fs');
const multer = require("multer");
const jwt = require("jsonwebtoken");


// console.log(__dirname);
//  console.log(Date.now());

//上传的文件保存在 upload
const storage = multer.diskStorage({
  //存储的位置
  destination(req, file, cb) {
    cb(null, "public/admin/src/assets/imgs");
  },
  //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
  filename(req, file, cb) {
    let math = Math.random();
    math = math.toString().replace(".", ""); //随机字符串
    cb(null, math + "-" + file.originalname);
  },
});
//传入storage 除了这个参数我们还可以传入dest等参数
let upload = multer({
  storage,
}).array("file");
//上传图片总函数
let imgs = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, function (err) {
      if (err) return resolve(0);
      try {
        //循环处理
        let imgPath = [];
        req.files.forEach(function (i) {
          //获取临时文件的存储路径
          imgPath.push(i.filename);
          // console.log("i.path:",i.path)
        });
        resolve(imgPath);
      } catch (errr) {
        return resolve(0);
      }
    });
  });
};

//用户/////
//用户/////
//用户/////
//用户/////
//用户/////
router.post("/YHdelete1", (req, res) => {
  let sql = "DELETE FROM user WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.id], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
router.post("/YHadd1", (req, res) => {
  let sql = "INSERT INTO user(name,pwd,role) VALUES (?,?,?)",
    obj = req.body;
  pool.query(sql, [obj.name, obj.pwd, obj.role], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "添加信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "添加信息成功",
    });
  });
});
router.get("/YHselect1", (req, res) => {
  let sql = "SELECT * FROM user";
  pool.query(sql, (err, result) => {
    // pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
router.post("/YHedit1", (req, res) => {
  let sql = "UPDATE user SET name = ?,pwd=?,role=? WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.name, obj.pwd, obj.role, obj.id], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
//图表//////
//图表//////
//图表//////
//图表//////
//图表//////
router.get("/TBsearch1", (req, res) => {
  let sql =
    "SELECT Month(JStime) AS month , SUM(price) AS SUMprice FROM JS where YEAR(JSTIME) = (select date_format(now(), '%Y'))  GROUP BY Month(JStime) ";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
router.get("/TBsearch2", (req, res) => {
  let sql =
      "SELECT * ,JSbarcode ,Month(JStime) AS month , SUM(price) AS SUMprice FROM (SELECT JSbarcode,price,JStime,productname FROM JS LEFT JOIN CGQD ON JS.JSbarcode = CGQD.barcode WHERE JSbarcode = ?) AS a where YEAR(JSTIME) = (select date_format(now(), '%Y'))  GROUP BY Month(JStime) ",
    obj = req.query;
  pool.query(sql, [obj.JSbarcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/TBsearch3", (req, res) => {
  let sql =
    "SELECT * FROM HJSP join CGQD ON HJSP.HJSPbarcode = CGQD.barcode order by HJSPnumber desc";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
router.get("/TBsearch4", (req, res) => {
  let sql =
    "SELECT COUNT(CKbarcode) as COUNT,productname,CKbarcode FROM CK join CGQD ON CK.CKbarcode = CGQD.barcode GROUP BY CKbarcode";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
////////////////结算
////////////////结算
////////////////结算
////////////////结算
////////////////结算
router.get("/JSsearch1", (req, res) => {
  let sql = "SELECT * FROM JS GROUP BY JSbarcode";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
router.post("/JSadd1", (req, res) => {
  let sql = "INSERT INTO JS(JSbarcode,JSnumber,price,JStime) VALUES (?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.JSbarcode, obj.JSnumber, obj.price, obj.JStime],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});
/////////////////////////警告
/////////////////////////警告
/////////////////////////警告
/////////////////////////警告
/////////////////////////警告
router.get("/WARNINGsearch1", (req, res) => {
  let sql =
    "SELECT * FROM WARNING join CGQD on CGQD.barcode = WARNING.WARNINGbarcode";
  pool.query(sql, (err, result) => {
    // pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
router.post("/WARNINGedit1", (req, res) => {
  let sql =
      "UPDATE WARNING SET CKstockwarning = ?,duedateproportion=?,HJstockwaring=? WHERE WARNINGbarcode=?",
    obj = req.body;
  pool.query(
    sql,
    [
      obj.CKstockwarning,
      obj.duedateproportion,
      obj.HJstockwaring,
      obj.WARNINGbarcode,
    ],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "修改信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "修改信息成功",
      });
    }
  );
});
/////////////////////////上架商品计划
/////////////////////////上架商品计划
/////////////////////////上架商品计划
/////////////////////////上架商品计划
/////////////////////////上架商品计划
router.post("/SJSPJHedit1", (req, res) => {
  let sql = "UPDATE SJSPSM SET outnum = ?  WHERE SJSMbarcode=?";
  obj = req.body;
  pool.query(sql, [obj.outnum, obj.SJSMbarcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
router.post("/SJSPJHedit2", (req, res) => {
  let sql = "UPDATE SJSPSM SET reinnum = ?  WHERE SJSMbarcode=?";
  obj = req.body;
  pool.query(sql, [obj.reinnum, obj.SJSMbarcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
router.post("/SJSPJHedit3", (req, res) => {
  let sql = "UPDATE SJSPSM SET SJSMstatus = '结束'";
  obj = req.body;
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
router.post("/SJSPJHedit4", (req, res) => {
  let sql = "UPDATE SJSPJH SET SJHJstatus = '结束'";
  obj = req.body;
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
router.get("/SJSPJHseach1", (req, res) => {
  let sql =
    "SELECT * FROM SJSPSM join CGQD on CGQD.barcode = SJSPSM.SJSMbarcode where SJSMstatus = '进行中'";
  pool.query(sql, (err, result) => {
    // pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "计划列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询计划列表成功",
      data: result,
    });
  });
});
router.get("/SJSPJHseach2", (req, res) => {
  let sql =
    "SELECT * FROM SJSPJH join CGQD on CGQD.barcode = SJSPJH.SJbarcode where SJHJstatus = '进行中'";
  pool.query(sql, (err, result) => {
    // pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "计划列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询计划列表成功",
      data: result,
    });
  });
});
router.get("/SJSPJHseach3", (req, res) => {
  let sql =
      "SELECT * FROM CK right join (SELECT * FROM SJSPSM WHERE SJSMstatus = '进行中') as SJSPSM on CK.CKbarcode = SJSPSM.SJSMbarcode and CK.intime = SJSPSM.SJSMintime join CGQD on CGQD.barcode =CK.CKbarcode WHERE boxcode = ?",
    obj = req.query;
  pool.query(sql, [obj.boxcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.post("/SJSPJHadd1", (req, res) => {
  let sql =
      "INSERT INTO SJSPJH(SJHJshelf,SJbarcode,SJHJtime,SJHJstatus) VALUES (?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.SJHJshelf, obj.SJbarcode, obj.SJHJtime, obj.SJHJstatus],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});

router.post("/SJSPJHdelete1", (req, res) => {
  let sql = "DELETE FROM SJSPJH WHERE SJHJshelf=? and SJHJtime=?",
    obj = req.body;
  pool.query(sql, [obj.SJHJshelf, obj.SJHJtime], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});

/////////////////////////上架商品数目
/////////////////////////上架商品数目
/////////////////////////上架商品数目
/////////////////////////上架商品数目
/////////////////////////上架商品数目
router.post("/SJSPSMdelete1", (req, res) => {
  let sql = "DELETE FROM SJSPSM WHERE SJSMbarcode=? and SJSMtime=?",
    obj = req.body;
  pool.query(sql, [obj.SJSMbarcode, obj.SJSMtime], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
router.post("/SJSPSMadd1", (req, res) => {
  let sql =
      "INSERT INTO SJSPSM(SJSMbarcode,SJSM,SJSMtime,SJSMstatus,SJSMintime) VALUES (?,?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.SJSMbarcode, obj.SJSM, obj.SJSMtime, obj.SJSMstatus, obj.SJSMintime],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});
router.get("/SJSPseach1", (req, res) => {
  let sql =
    "SELECT * FROM CK left join CGQD on CGQD.barcode = CK.CKbarcode left join HJSP on HJSP.HJSPbarcode = CK.CKbarcode  GROUP BY CKbarcode";
  pool.query(sql, (err, result) => {
    // pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "计划列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询计划列表成功",
      data: result,
    });
  });
});
router.get("/SJSPseach2", (req, res) => {
  let sql =
      "SELECT * FROM CK left join CGQD on CGQD.barcode = CK.CKbarcode left join HJSP on HJSP.HJSPbarcode = CK.CKbarcode where productname = ? ",
    obj = req.query;
  pool.query(sql, [obj.productname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/SJSPseach3", (req, res) => {
  let sql =
      "SELECT * FROM CK left join CGQD on CGQD.barcode = CK.CKbarcode right join HJSP on HJSP.HJSPbarcode = CK.CKbarcode where productname = ?",
    obj = req.query;
  pool.query(sql, [obj.productname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/SJSPseach4", (req, res) => {
  let sql =
      "SELECT * FROM CK right join CGQD on CGQD.barcode = CK.CKbarcode right join HJSP on HJSP.HJSPbarcode = CK.CKbarcode and HJSP.inwarehousetime = CK.intime where intime != '' and productname = ?",
    obj = req.query;
  pool.query(sql, [obj.productname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
/////////////////////////货架商品
/////////////////////////货架商品
/////////////////////////货架商品
/////////////////////////货架商品
/////////////////////////货架商品
router.post("/HJSPedit1", (req, res) => {
  let sql = "UPDATE HJSP SET HJSPnumber = ?  WHERE HJSPbarcode=?";
  obj = req.body;
  pool.query(sql, [obj.HJSPnumber, obj.HJSPbarcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
router.post("/HJSPedit2", (req, res) => {
  obj = req.body;
  let num = obj.HJSPnumber;
  let sql =
    "UPDATE HJSP SET HJSPnumber = (HJSPnumber - ?)  WHERE HJSPbarcode LIKE ?";
  pool.query(sql, [obj.HJSPnumber, obj.HJSPbarcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
router.post("/HJSPadd1", (req, res) => {
  let sql =
      "INSERT INTO HJSP(HJSPbarcode,HJSPnumber,inwarehousetime) VALUES (?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.HJSPbarcode, obj.HJSPnumber, obj.inwarehousetime],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});
router.get("/HJSPsearch1", (req, res) => {
  let sql =
    "SELECT * FROM HJSP left join CGQD on CGQD.barcode = HJSP.HJSPbarcode left join WARNING on CGQD.barcode = WARNING.WARNINGbarcode order by inwarehousetime ";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
router.get("/HJSPsearch2", (req, res) => {
  let sql =
      "SELECT * FROM HJSP left join CGQD on CGQD.barcode = HJSP.HJSPbarcode where HJSPbarcode = ?",
    obj = req.query;
  pool.query(sql, [obj.HJSPbarcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/HJSPsearch3", (req, res) => {
  let sql = "SELECT * FROM HJSP where HJSPbarcode = ?",
    obj = req.query;
  pool.query(sql, [obj.HJSPbarcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
///////////////////////////////////////////货架
///////////////////////////////////////////货架
///////////////////////////////////////////货架
///////////////////////////////////////////货架
///////////////////////////////////////////货架
router.post("/HJadd1", (req, res) => {
  let sql = "INSERT INTO HJ(HJname,HJchildren) VALUES (?,?)",
    obj = req.body;
  pool.query(sql, [obj.HJname, obj.HJchildren], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "添加信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "添加信息成功",
    });
  });
});
router.post("/HJadd2", (req, res) => {
  let sql = "INSERT INTO HJ(HJname,HJchildren,HJbarcode) VALUES (?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.HJname, obj.HJchildren, obj.HJbarcode],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});
router.get("/HJsearch1", (req, res) => {
  let sql =
    "SELECT * FROM HJ left join CGQD on CGQD.barcode = HJ.HJbarcode order by HJchildren";
  //  let sql = "SELECT * FROM CK";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
router.get("/HJsearch2", (req, res) => {
  let sql = "SELECT * FROM HJ GROUP BY HJname";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});

// let sql = "SELECT * FROM HJ left join CGQD on CGQD.barcode = HJ.HJbarcode where HJname = ? order by HJchildren desc ";
router.get("/HJsearch3", (req, res) => {
  let sql =
      "SELECT * FROM HJ left join CGQD on CGQD.barcode = HJ.HJbarcode where HJname = ? order by HJchildren ",
    obj = req.query;
  pool.query(sql, [obj.HJname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/HJsearch4", (req, res) => {
  let sql =
      "SELECT * FROM HJ left join CGQD on CGQD.barcode = HJ.HJbarcode where HJname like ? GROUP BY HJname",
    obj = req.query;
  pool.query(sql, [obj.HJname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/HJsearch5", (req, res) => {
  let sql = "SELECT * FROM HJ where HJname =? and HJbarcode != ''",
    obj = req.query;
  pool.query(sql, [obj.HJname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.post("/HJdelete1", (req, res) => {
  let sql = "DELETE FROM HJ WHERE HJname =?",
    obj = req.body;
  pool.query(sql, [obj.HJname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
router.post("/HJdelete2", (req, res) => {
  let sql =
      "DELETE FROM HJ WHERE HJchildren = any(SELECT SJHJshelf FROM SJSPJH) AND HJbarcode IS null",
    obj = req.body;
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
router.post("/HJdelete3", (req, res) => {
  let sql =
      "DELETE FROM HJ WHERE HJchildren = any(SELECT SJHJshelf FROM SJSPJH where SJHJstatus = '进行中') AND HJbarcode = any(SELECT SJbarcode FROM SJSPJH  where SJHJstatus = '进行中')",
    obj = req.body;
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
///////////////////////////////////////////仓库
///////////////////////////////////////////仓库
///////////////////////////////////////////仓库
///////////////////////////////////////////仓库
///////////////////////////////////////////仓库
//添加
router.post("/CKadd1", (req, res) => {
  let sql = "INSERT INTO CK(CKbarcode,boxcode,intime,stock) VALUES (?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.CKbarcode, obj.boxcode, obj.intime, obj.stock],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});
router.post("/CKedit1", (req, res) => {
  let sql = "UPDATE CK SET stock = ?  WHERE boxcode=?";
  obj = req.body;
  pool.query(sql, [obj.stock, obj.boxcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
router.get("/CKsearch1", (req, res) => {
  let sql =
    "SELECT * FROM CK right join (SELECT CKbarcode,sum(stock) as sum FROM CK GROUP BY CKbarcode ) as a on a.CKbarcode = CK.CKbarcode join CGQD on CGQD.barcode = CK.CKbarcode left JOIN WARNING ON WARNING.WARNINGbarcode = CK.CKbarcode order by productname desc ";
  //  let sql = "SELECT * FROM CK";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
router.get("/CKsearch2", (req, res) => {
  let sql =
      "SELECT * FROM CK right join (SELECT CKbarcode,sum(stock) as sum FROM CK GROUP BY CKbarcode ) as a on a.CKbarcode = CK.CKbarcode join CGQD on CGQD.barcode = CK.CKbarcode left JOIN WARNING ON WARNING.WARNINGbarcode = CK.CKbarcode WHERE productname  LIKE ? order by productname desc ",
    obj = req.query;
  pool.query(sql, [obj.productname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/CKsearch3", (req, res) => {
  let sql =
    "SELECT * FROM(SELECT * ,IF((select date_format(now(), '%Y-%m-%d'))>duetime, '临期' , '正常' ) as due FROM ( SELECT *,date_add(intime, interval duedateproportion day) as duetime FROM(SELECT * FROM((SELECT intime,CKbarcode,boxcode,stock FROM CK) as c) left join (SELECT CKbarcode as CKbarcode2,sum(stock) as sum FROM CK GROUP BY CKbarcode ) as a on a.CKbarcode2 = c.CKbarcode left join CGQD on CGQD.barcode = c.CKbarcode left JOIN (SELECT WARNINGbarcode,CKstockwarning,duedateproportion,HJstockwaring FROM  WARNING) as d ON d.WARNINGbarcode = c.CKbarcode) AS b) as duedata ) as result WHERE due = '临期' order by productname desc";
  //  let sql = "SELECT * FROM CK";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "列表成功",
      data: result,
    });
  });
});
router.get("/CKsearch4", (req, res) => {
  let sql =
      "SELECT * FROM(SELECT * ,IF(CKstockwarning > sum, '不足' , '正常' )as due FROM ( SELECT *,date_add(intime, interval duedateproportion day) as duetime FROM(SELECT * FROM((SELECT intime,CKbarcode,boxcode,stock FROM CK) as c) left join (SELECT CKbarcode as CKbarcode2,sum(stock) as sum FROM CK GROUP BY CKbarcode ) as a on a.CKbarcode2 = c.CKbarcode left join CGQD on CGQD.barcode = c.CKbarcode left JOIN (SELECT WARNINGbarcode,CKstockwarning,duedateproportion,HJstockwaring FROM  WARNING) as d ON d.WARNINGbarcode = c.CKbarcode) AS b) as duedata ) as result WHERE due = '不足' order by productname desc",
    obj = req.query;
  pool.query(sql, [obj.productname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.post("/CKdelete1", (req, res) => {
  let sql = "DELETE FROM CK WHERE boxcode=?",
    obj = req.body;
  pool.query(sql, [obj.boxcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
///////////////////////////////////////////采购计划
///////////////////////////////////////////采购计划
///////////////////////////////////////////采购计划
///////////////////////////////////////////采购计划
///////////////////////////////////////////采购计划
// 列表数据显示(显示全部)
router.get("/CGJHsearch1", (req, res) => {
  let sql =
    "SELECT * FROM CGQD right join CGJH on CGQD.barcode = CGJH.CGJHbarcode order by planinputtime desc";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
//查询时间计划
router.get("/CGJHsearch2", (req, res) => {
  let sql =
    "SELECT * FROM CGQD right join CGJH on CGQD.barcode = CGJH.CGJHbarcode WHERE planinputtime =? order by planinputtime desc";
  obj = req.query;
  pool.query(sql, [obj.planinputtime], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询计划成功",
      data: result,
    });
  });
});
router.get("/CGJHsearch3", (req, res) => {
  let sql = "SELECT * FROM CGQD WHERE barcode =?",
    obj = req.query;
  pool.query(sql, [obj.barcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询供应商成功",
      data: result,
    });
  });
});
router.post("/CGJHdelete1", (req, res) => {
  let sql = "DELETE FROM CGJH WHERE CGJHbarcode=? and planinputtime = ?",
    obj = req.body;
  pool.query(sql, [obj.CGJHbarcode, obj.planinputtime], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
router.post("/CGJHdelete2", (req, res) => {
  let sql = "DELETE FROM CGJH WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.id], (err, result) => {
    if (err)
      res.send({
        code: 500,
        message: "删除失败",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
//删除时间计划
router.post("/CGJHdelete3", (req, res) => {
  let sql = "DELETE FROM CGJH WHERE planinputtime=?",
    obj = req.body;
  pool.query(sql, [obj.planinputtime], (err, result) => {
    if (err)
      res.send({
        code: 500,
        message: "删除计划失败",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});

router.post("/CGJHadd1", (req, res) => {
  let sql =
      "INSERT INTO CGJH(number,CGJHsuppliername,planinputtime,CGJHbarcode) VALUES (?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.number, obj.CGJHsuppliername, obj.planinputtime, obj.CGJHbarcode],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});

///////////////////////////////////////////供应商
///////////////////////////////////////////供应商
///////////////////////////////////////////供应商
///////////////////////////////////////////供应商
///////////////////////////////////////////供应商

router.get("/suppliersearch1", (req, res) => {
  // let sql = "SELECT * FROM shelfproduct left join shelfproductstockwarning on shelfproduct.upperproduct = shelfproductstockwarning.product";
  let sql =
    "SELECT * FROM GYS  left join CGQD on CGQD.barcode = GYS.productbarcode order by suppliername desc";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "信息查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});

router.get("/GYSsearch2", (req, res) => {
  let sql = "SELECT * FROM GYS WHERE suppliername =?",
    obj = req.query;
  pool.query(sql, [obj.suppliername], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});

router.get("/GYSsearch3", (req, res) => {
  let sql =
      "SELECT * FROM GYS left join CGQD on CGQD.barcode = GYS.productbarcode WHERE GYS.suppliername LIKE  ? order by suppliername desc ",
    obj = req.query;
  pool.query(sql, [obj.suppliername], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
//添加供应商数据
router.post("/supplieradd1", (req, res) => {
  let sql =
      "INSERT INTO GYS(suppliername,phonenumber,phonename,productbarcode) VALUES (?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.suppliername, obj.phonenumber, obj.phonename, obj.productbarcode],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});

// 删除供应商商品
router.post("/GYSdelete1", (req, res) => {
  let sql = "DELETE FROM GYS WHERE suppliername=? and productbarcode=?",
    obj = req.body;
  pool.query(sql, [obj.suppliername, obj.productbarcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
router.post("/GYSdelete2", (req, res) => {
  let sql = "DELETE FROM GYS WHERE suppliername=?",
    obj = req.body;
  pool.query(sql, [obj.suppliername], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
router.post("/GYSedit1", (req, res) => {
  let sql =
      "UPDATE GYS SET suppliername = ?,phonenumber=?,phonename=? WHERE id=?",
    obj = req.body;
  pool.query(
    sql,
    [obj.suppliername, obj.phonenumber, obj.phonename, obj.id],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "修改信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "修改信息成功",
      });
    }
  );
});
///////////////////////////////////////////采购清单
///////////////////////////////////////////采购清单
///////////////////////////////////////////采购清单
///////////////////////////////////////////采购清单
///////////////////////////////////////////采购清单
///////////////////////////////////////////采购清单
router.post("/CGQDedit1", (req, res) => {
  let sql =
      "UPDATE CGQD SET productname = ?,producttype=?,retailprice = ?,expirydate=?,specs=? WHERE barcode=?",
    obj = req.body;
  pool.query(
    sql,
    [
      obj.productname,
      obj.producttype,
      obj.retailprice,
      obj.barcode,
      obj.specs,
      obj.expirydate,
    ],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "修改信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "修改信息成功",
      });
    }
  );
});
router.post("/CGQDdelete1", (req, res) => {
  let sql = "DELETE FROM CGQD WHERE barcode=?",
    obj = req.body;
  pool.query(sql, [obj.barcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "删除错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
router.post("/CGQDadd1", (req, res) => {
  let sql =
      "INSERT INTO CGQD(productname,producttype,retailprice,barcode,specs,expirydate) VALUES (?,?,?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [
      obj.productname,
      obj.producttype,
      obj.retailprice,
      obj.barcode,
      obj.specs,
      obj.expirydate,
    ],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加供应商信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加供应商信息成功",
      });
    }
  );
});
router.get("/CGQDsearch1", (req, res) => {
  let sql = "SELECT productname FROM CGQD";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "信息查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "信息查询成功",
      data: result,
    });
  });
});
router.get("/CGQDsearch2", (req, res) => {
  let sql = "SELECT * FROM CGQD WHERE productname =?",
    obj = req.query;
  pool.query(sql, [obj.productname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/CGQDsearch3", (req, res) => {
  let sql = "SELECT barcode FROM CGQD";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "信息查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "信息查询成功",
      data: result,
    });
  });
});
router.get("/CGQDsearch4", (req, res) => {
  let sql = "SELECT * FROM CGQD WHERE barcode =?",
    obj = req.query;
  pool.query(sql, [obj.barcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成绩成功",
      data: result,
    });
  });
});
router.get("/CGQDsearch5", (req, res) => {
  let sql =
    "SELECT * FROM CGQD  left join GYS on CGQD.barcode = GYS.productbarcode left join CGJH  on CGQD.barcode = CGJH.CGJHbarcode order by planinputtime desc ";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "信息查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "信息查询成功",
      data: result,
    });
  });
});
router.get("/CGQDsearch6", (req, res) => {
  let sql = "SELECT * FROM CGQD WHERE productname  LIKE ?",
    obj = req.query;
  pool.query(sql, [obj.productname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/CGQDsearch7", (req, res) => {
  let sql =
    "SELECT * FROM CGQD  left join GYS on CGQD.barcode = GYS.productbarcode left join CGJH  on CGQD.barcode = CGJH.CGJHbarcode where barcode = ? GROUP BY productname order by planinputtime desc ";
  obj = req.query;
  pool.query(sql, [obj.barcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "信息查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "信息查询成功",
      data: result,
    });
  });
});
router.get("/CGQDsearch8", (req, res) => {
  let sql = "SELECT producttype FROM CGQD group by producttype";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "信息查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "信息查询成功",
      data: result,
    });
  });
});

///////////////////////////////////////////

///////////////////////////////////////////

///////////////////////////////////////////

///////////////////////////////////////////

///////////////////////////////////////////

var AppID = "wx726f1d93af637d05";
var AppSecret = "01b843e403456b727940579f29e05f2f";
router.get("/code", function (req, res) {
  var router = "coto";
  var return_uri = "http://127.0.0.1:8080";
  // var scope = 'snsapi_login'; //网页
  var scope = "snsapi_userinfo"; //网页
  var state = "state";
  // res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0e81c3bee622d60&redirect_uri=http%3A%2F%2Fnba.bluewebgame.com%2Foauth_response.php&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect');

  res.redirect(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
      AppID +
      "&redirect_uri=" +
      return_uri +
      "&response_type=code&scope=" +
      scope +
      "&state=" +
      state +
      "#wechat_redirect"
  );
});

router.get("/get_wx", function (req, res, next) {
  //  var code = '031kvWGa1l9RhA0l1uGa1EsqUz4kvWGD';
  var code = req.query.code; //实际上是获取前端请求的code
  // obj=req.body
  // var code = obj.code
  request.get(
    {
      url:
        "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" +
        AppID +
        "&secret=" +
        AppSecret +
        "&code=" +
        code +
        "&grant_type=authorization_code",
      // url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx726f1d93af637d05&secret=001aOv100eCETK1XTX0008xJd32aOv1n&code=011vjQFa1xwvfA08q5Ja1fFbic2vjQFW&grant_type=authorization_code'
    },
    function (error, response, body) {
      if (response.statusCode == 200) {
        let data = JSON.parse(body);
        let access_token = data.access_token;
        let openid = data.openid;
        request.get(
          {
            url:
              "https://api.weixin.qq.com/sns/userinfo?access_token=" +
              access_token +
              "&openid=" +
              openid +
              "&lang=zh_CN",
          },
          function (error, response, body) {
            var userinfo = JSON.parse(body);
            console.log(userinfo);
            res.send(
              "\
                <h1>" +
                userinfo.nickname +
                " 的个人信息</h1>\
                <p><img src='" +
                userinfo.headimgurl +
                "' /></p>\
                <p>" +
                userinfo.city +
                "，" +
                userinfo.province +
                "，" +
                userinfo.country +
                "</p>\
              "
            );
          }
        );
      }
    }
  );
});

// 碧丽公司使用
router.post("/addbili", (req, res) => {
  let sql = "INSERT INTO bili(title,name,content,time) VALUES (?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.title, obj.name, obj.content, obj.time],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加供应商信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加供应商信息成功",
      });
    }
  );
});
router.get("/bililist", (req, res) => {
  let sql = "SELECT * FROM bili order by id desc LIMIT 150";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "计划列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询计划列表成功",
      data: result,
    });
  });
});

router.post("/addshelfproductstockwarning", (req, res) => {
  let sql =
      "INSERT INTO shelfproductstockwarning(product,stockwarning) VALUES (?,?)",
    obj = req.body;
  pool.query(sql, [obj.product, obj.stockwarning], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "添加信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "添加信息成功",
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////
router.post("/addshelfproduct", (req, res) => {
  //  let sql = "INSERT INTO shelfproduct(product,number,inwarehousetime) SELECT distinct upperproduct,outputnumber,inwarehousetime FROM upperplan WHERE status ='结束' ",
  let sql =
      "INSERT INTO shelfproduct(upperproduct,outputnumber,inwarehousetime)  SELECT upperproduct,outputnumber,inwarehousetime FROM upperplan where status = '进行中' ",
    obj = req.body;
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "添加信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "添加信息成功",
    });
  });
});
router.post("/deleshelfproductcopy", (req, res) => {
  let sql = "DELETE FROM shelfproductcopy",
    obj = req.body;
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "添加信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "添加信息成功",
    });
  });
});
router.post("/insertshelfproductcopy", (req, res) => {
  let sql =
      " INSERT INTO shelfproductcopy(upperproduct,outputnumber,inwarehousetime) SELECT upperproduct,SUM(outputnumber),inwarehousetime  FROM shelfproduct  GROUP BY upperproduct ",
    obj = req.body;
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "添加信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "添加信息成功",
    });
  });
});
router.post("/deleshelfproduct", (req, res) => {
  let sql = "DELETE FROM shelfproduct",
    obj = req.body;
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "添加信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "添加信息成功",
    });
  });
});
router.post("/insertshelfproduct", (req, res) => {
  let sql =
      " INSERT INTO shelfproduct(upperproduct,outputnumber,inwarehousetime) SELECT upperproduct,outputnumber,inwarehousetime  FROM shelfproductcopy  GROUP BY upperproduct ",
    obj = req.body;
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "添加信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "添加信息成功",
    });
  });
});
router.get("/shelfproductList", (req, res) => {
  let sql =
    "SELECT * FROM shelfproduct left join shelfproductstockwarning on shelfproduct.upperproduct = shelfproductstockwarning.product";
  // let sql = "SELECT * FROM warehouse GROUP BY productname";
  pool.query(sql, (err, result) => {
    // pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "计划列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询计划列表成功",
      data: result,
    });
  });
});

//货架上架
router.post("/addupperplan", (req, res) => {
  let sql =
      "INSERT INTO upperplan(name,upperproduct,uppernumber,shelfposition,upperplantime,outputnumber,status,inwarehousetime) VALUES (?,?,?,?,?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [
      obj.name,
      obj.upperproduct,
      obj.uppernumber,
      obj.shelfposition,
      obj.upperplantime,
      obj.outputnumber,
      obj.status,
      obj.inwarehousetime,
    ],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});

router.get("/upperplanlist", (req, res) => {
  let sql = "SELECT * FROM upperplan order by upperplantime desc";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "计划列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询计划列表成功",
      data: result,
    });
  });
});
router.get("/SearchUpperplanstatus", (req, res) => {
  let sql =
      "SELECT * FROM upperplan WHERE upperplantime != ? and status = ? and outputnumber != ?",
    obj = req.query;
  pool.query(
    sql,
    [obj.upperplantime, obj.status, obj.outputnumber],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "查询失败",
          err,
        });
      if (result.length === 0)
        return res.send({
          code: 1,
          message: "列表为空",
          data: [],
        });
      res.send({
        code: 1,
        message: "查询计划成功",
        data: result,
      });
    }
  );
});
router.get("/SearchUpperplantime", (req, res) => {
  let sql = "SELECT * FROM upperplan WHERE upperplantime = ?",
    obj = req.query;
  pool.query(sql, [obj.upperplantime], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询计划成功",
      data: result,
    });
  });
});
//删除上架计划单列
router.post("/Deleupperplan", (req, res) => {
  let sql = "DELETE FROM upperplan WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.id], (err, result) => {
    if (err)
      res.send({
        code: 500,
        message: "删除失败",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
//删除上架时间计划
router.post("/DeleupperplanTime", (req, res) => {
  let sql = "DELETE FROM upperplan WHERE upperplantime=?",
    obj = req.body;
  pool.query(sql, [obj.upperplantime], (err, result) => {
    if (err)
      res.send({
        code: 500,
        message: "删除失败",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
//查询时间计划
router.get("/SearchUpperplanTime", (req, res) => {
  let sql = "SELECT * FROM upperplan WHERE upperplantime =?",
    obj = req.query;
  pool.query(sql, [obj.upperplantime], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询计划成功",
      data: result,
    });
  });
});
router.get("/SearchUpperinwarehouser", (req, res) => {
  let sql =
      "SELECT * FROM upperplan WHERE inwarehousetime != ? and upperproduct = ? order by upperplantime desc",
    obj = req.query;
  pool.query(sql, [obj.inwarehousetime, obj.upperproduct], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询计划成功",
      data: result,
    });
  });
});
router.get("/SearchUpperstatus", (req, res) => {
  let sql = "SELECT * FROM upperplan WHERE status =?",
    obj = req.query;
  pool.query(sql, [obj.status], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询计划成功",
      data: result,
    });
  });
});
router.get("/Upperplantime", (req, res) => {
  let sql =
    "SELECT upperplantime FROM upperplan GROUP BY upperplantime order by upperplantime desc";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
router.get("/searchupperproduct", (req, res) => {
  let sql = "SELECT * FROM upperplan WHERE upperproduct =? and upperplantime=?";
  obj = req.query;
  pool.query(sql, [obj.upperproduct, obj.upperplantime], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询计划成功",
      data: result,
    });
  });
});
//包含查询
//  router.get("/searchuppershelfposition", (req, res) => {
//      let sql = "SELECT * FROM upperplan WHERE instr(shelfposition,?)"
//      obj = req.query;
//      pool.query(sql, [obj.shelfposition], (err, result) => {
//          if (err) return res.send({
//              code: 500,
//              message: "查询失败",
//              err
//          });
//          if (result.length === 0) return res.send({
//              code: 1,
//              message: "列表为空",
//              data: []
//          });
//          res.send({
//              code: 1,
//              message: "查询计划成功",
//              data: result
//          });
//      });
//  });
//多条件
router.get("/searchuppershelfposition", (req, res) => {
  let sql =
    "SELECT * FROM upperplan WHERE find_in_set(?,shelfposition) and upperproduct =? and upperplantime=?";
  obj = req.query;
  pool.query(
    sql,
    [obj.shelfposition, obj.upperproduct, obj.upperplantime],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "查询失败",
          err,
        });
      if (result.length === 0)
        return res.send({
          code: 1,
          message: "列表为空",
          data: [],
        });
      res.send({
        code: 1,
        message: "查询计划成功",
        data: result,
      });
    }
  );
});
router.get("/SearchUpperoutputboxcode", (req, res) => {
  let sql =
    "SELECT * FROM upperplan WHERE find_in_set(?,outputboxcode) and status =?";
  obj = req.query;
  pool.query(sql, [obj.outputboxcode, obj.status], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
//编辑
router.post("/changeupperplan", (req, res) => {
  let sql =
    "UPDATE upperplan SET shelfposition = ? ,uppernumber=? WHERE upperproduct=? and upperplantime=?";
  obj = req.body;
  pool.query(
    sql,
    [obj.shelfposition, obj.uppernumber, obj.upperproduct, obj.upperplantime],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "修改信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "修改信息成功",
      });
    }
  );
});
router.post("/changesupperstatus", (req, res) => {
  let sql =
    "UPDATE upperplan SET status = ? WHERE status='进行中' and outputnumber=?";
  obj = req.body;
  pool.query(sql, [obj.status, obj.outputnumber], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
router.post("/changesupperstatus2", (req, res) => {
  let sql = "UPDATE upperplan SET status = ? WHERE status='进行中'";
  obj = req.body;
  pool.query(sql, [obj.status], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
//编辑
router.post("/changeupperout", (req, res) => {
  let sql =
    "UPDATE upperplan SET outputboxcode = ? ,outputnumber=?  WHERE upperproduct=? and upperplantime=?";
  obj = req.body;
  pool.query(
    sql,
    [obj.outputboxcode, obj.outputnumber, obj.upperproduct, obj.upperplantime],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "修改信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "修改信息成功",
      });
    }
  );
});
//编辑
router.post("/changeupperinwarehousetime", (req, res) => {
  let sql =
    "UPDATE upperplan SET inwarehousetime = ? WHERE status=? and upperproduct=?";
  obj = req.body;
  pool.query(
    sql,
    [obj.inwarehousetime, obj.status, obj.upperproduct],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "修改信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "修改信息成功",
      });
    }
  );
});

//仓库模块
router.get("/WarehouseList", (req, res) => {
  let sql = "SELECT * FROM warehouse WHERE stock != 0 GROUP BY productname";
  // let sql = "SELECT * FROM warehouse GROUP BY productname";

  pool.query(sql, (err, result) => {
    // pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "计划列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询计划列表成功",
      data: result,
    });
  });
});
router.get("/WarehouseList2", (req, res) => {
  let sql = "SELECT * FROM warehouse";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "计划列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询计划列表成功",
      data: result,
    });
  });
});
//添加
router.post("/addInventory", (req, res) => {
  let sql =
      "INSERT INTO warehouse(barcode,boxcode,intime,plantime,productname,stock,specs) VALUES (?,?,?,?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [
      obj.barcode,
      obj.boxcode,
      obj.intime,
      obj.plantime,
      obj.productname,
      obj.stock,
      obj.specs,
    ],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});
// 查询(barcode)
router.get("/searchwarehousebarcode", (req, res) => {
  let sql = "SELECT * FROM warehouse WHERE boxcode =?",
    obj = req.query;
  pool.query(sql, [obj.boxcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询供应商成功",
      data: result,
    });
  });
});
router.get("/Searchwarehouserintime", (req, res) => {
  let sql =
      "SELECT * FROM warehouse WHERE productname =? and intime =? and stock !=?",
    obj = req.query;
  pool.query(sql, [obj.productname, obj.intime, obj.stock], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询供应商成功",
      data: result,
    });
  });
});
//编辑stock
router.post("/changewarehousestock", (req, res) => {
  let sql = "UPDATE warehouse SET stock=?  WHERE boxcode = ?";
  obj = req.body;
  pool.query(sql, [obj.stock, obj.boxcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});

//计划模块
router.get("/planlist2", (req, res) => {
  let sql =
    "SELECT planinputtime FROM plan GROUP BY planinputtime order by planinputtime desc";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  });
});
// 列表数据显示(显示全部)
router.get("/planlist", (req, res) => {
  let sql = "SELECT * FROM plan order by planinputtime desc";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "计划列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询计划列表成功",
      data: result,
    });
  });
});
// 添加计划
router.post("/addplan", (req, res) => {
  let sql =
      "INSERT INTO plan(productname,producttype,retailprice,number,suppliername,planinputtime,barcode,specs) VALUES (?,?,?,?,?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [
      obj.productname,
      obj.producttype,
      obj.retailprice,
      obj.number,
      obj.suppliername,
      obj.planinputtime,
      obj.barcode,
      obj.specs,
    ],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});
//删除计划商品
router.post("/DelePlan", (req, res) => {
  let sql = "DELETE FROM plan WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.id], (err, result) => {
    if (err)
      res.send({
        code: 500,
        message: "删除计划商品失败",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
//删除时间计划
router.post("/DelePlanTime", (req, res) => {
  let sql = "DELETE FROM plan WHERE planinputtime=?",
    obj = req.body;
  pool.query(sql, [obj.planinputtime], (err, result) => {
    if (err)
      res.send({
        code: 500,
        message: "删除计划失败",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
//查询时间计划
router.get("/SearchPlanTime", (req, res) => {
  let sql = "SELECT * FROM plan WHERE planinputtime =?",
    obj = req.query;
  pool.query(sql, [obj.planinputtime], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询计划成功",
      data: result,
    });
  });
});

//商品模块
// 查询(barcode)
router.get("/searchproductbarcode", (req, res) => {
  let sql = "SELECT * FROM product WHERE barcode =?",
    obj = req.query;
  pool.query(sql, [obj.barcode], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询供应商成功",
      data: result,
    });
  });
});
// 查询(name)
router.get("/searchproductsupplier", (req, res) => {
  let sql = "SELECT * FROM supplier WHERE supplierproduct =?",
    obj = req.query;
  pool.query(sql, [obj.supplierproduct], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询供应商成功",
      data: result,
    });
  });
});
// 列表数据显示(显示全部)
router.get("/productlist", (req, res) => {
  let sql = "SELECT * FROM product GROUP BY productname";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "货架列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询货架列表成功",
      data: result,
    });
  });
});
//添加产品数据
router.post("/addproduct", (req, res) => {
  let sql =
      "INSERT INTO product(productname,producttype,retailprice,status) VALUES (?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.productname, obj.producttype, obj.retailprice, obj.status],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加信息成功",
      });
    }
  );
});
// 查询(name)
router.get("/searchproduct", (req, res) => {
  let sql = "SELECT * FROM product WHERE productname =?",
    obj = req.query;
  pool.query(sql, [obj.productname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成绩成功",
      data: result,
    });
  });
});

//供应商模块
// 列表数据显示(归纳)
router.get("/supplierlist2", (req, res) => {
  let sql = "SELECT * FROM supplier";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "供应商列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询供应商列表成功",
      data: result,
    });
  });
});
router.get("/supplierlist", (req, res) => {
  let sql = "SELECT * FROM supplier GROUP BY suppliername";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "供应商列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询供应商列表成功",
      data: result,
    });
  });
});

//添加供应商数据
router.post("/addsupplier", (req, res) => {
  let sql =
      "INSERT INTO supplier(suppliername,phonenumber,phonename,supplierproduct,producttype,retailprice) VALUES (?,?,?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [
      obj.suppliername,
      obj.phonenumber,
      obj.phonename,
      obj.supplierproduct,
      obj.producttype,
      obj.retailprice,
    ],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加供应商信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加供应商信息成功",
      });
    }
  );
});
// 查询(name)获取其相同商品长度
router.get("/searchsupplier3", (req, res) => {
  let sql =
      "select supplierproduct, count(1) as counts from supplier WHERE suppliername=? group by supplierproduct",
    obj = req.query;
  pool.query(sql, [obj.suppliername], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成绩成功",
      data: result,
    });
  });
});
// 查询(name)
router.get("/searchsupplier", (req, res) => {
  let sql = "SELECT * FROM supplier WHERE suppliername =?",
    obj = req.query;
  pool.query(sql, [obj.suppliername], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成绩成功",
      data: result,
    });
  });
});
// 查询(supplierproduct)
router.get("/searchsupplier2", (req, res) => {
  let sql = "SELECT * FROM supplier WHERE supplierproduct =?",
    obj = req.query;
  pool.query(sql, [obj.supplierproduct], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成绩成功",
      data: result,
    });
  });
});
// 删除供应商(批量删除也是调用这个)(supplierproduct)
router.post("/delesupplierproduct", (req, res) => {
  let sql = "DELETE FROM supplier WHERE supplierproduct=?",
    obj = req.body;
  pool.query(sql, [obj.supplierproduct], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改学生错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
// 删除供应商(批量删除也是调用这个)(id)
router.post("/delesupplier", (req, res) => {
  let sql = "DELETE FROM supplier WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.id], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改学生错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
// 删除供应商(批量删除也是调用这个)(suppliername)
router.post("/delesuppliername", (req, res) => {
  let sql = "DELETE FROM supplier WHERE suppliername=?",
    obj = req.body;
  pool.query(sql, [obj.suppliername], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改学生错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
//编辑产品状态
router.post("/changeproductstatus", (req, res) => {
  let sql = "UPDATE product SET status = ? WHERE productname=?",
    obj = req.body;
  pool.query(sql, [obj.status, obj.productname], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
//编辑供应商信息（不包括供应商产品信息）
router.post("/changesupplier", (req, res) => {
  let sql =
      "UPDATE supplier SET suppliername = ?,phonenumber=?,phonename=? WHERE id=?",
    obj = req.body;
  pool.query(
    sql,
    [obj.suppliername, obj.phonenumber, obj.phonename, obj.id],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "修改信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "修改信息成功",
      });
    }
  );
});

//编辑供应商信息(商品信息)
router.post("/changesupplierproduct", (req, res) => {
  let sql =
      "UPDATE supplier SET supplierproduct=?,producttype=?,retailprice=? WHERE id=?",
    obj = req.body;
  pool.query(
    sql,
    [obj.supplierproduct, obj.producttype, obj.retailprice, obj.id],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "修改信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "修改信息成功",
      });
    }
  );
});

//添加货架数据
router.post("/addShelf", (req, res) => {
  let sql =
      "INSERT INTO shelf(name,sex,class,shelfposition,shelfvolume) VALUES (?,?,?,?,?)",
    obj = req.body;
  pool.query(
    sql,
    [obj.name, obj.sex, obj.class, obj.shelfposition, obj.shelfvolume],
    (err, result) => {
      if (err)
        return res.send({
          code: 500,
          message: "添加货架信息错误",
          err,
        });
      res.send({
        code: 1,
        message: "添加货架信息成功",
      });
    }
  );
});

// //删除货架(批量删除也是调用这个)(id)
router.post("/deleShelf", (req, res) => {
  let sql = "DELETE FROM shelf WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.id], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改学生错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});
//删除货架(批量删除也是调用这个)（依据名字）
router.post("/deleShelf2", (req, res) => {
  let sql = "DELETE FROM shelf WHERE name=?",
    obj = req.body;
  pool.query(sql, [obj.name], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改学生错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});

//编辑货架数据
router.post("/changeShelf", (req, res) => {
  let sql = "UPDATE student SET name=?,sex=?,class=? WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.name, obj.sex, obj.class, obj.id], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});
// 列表数据显示(显示全部)
router.get("/listShelf2", (req, res) => {
  let sql = "SELECT * FROM shelf";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "货架列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询货架列表成功",
      data: result,
    });
  });
});
// 列表数据归纳显示
router.get("/listShelf", (req, res) => {
  let sql = "SELECT * FROM shelf GROUP BY name";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "货架列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询货架列表成功",
      data: result,
    });
  });
});
// 查询(name)
router.get("/searchShelfname", (req, res) => {
  let sql = "SELECT * FROM shelf WHERE name=?",
    obj = req.query;
  pool.query(sql, [obj.name], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成绩成功",
      data: result,
    });
  });
});
router.get("/searchShelfposition", (req, res) => {
  let sql = "SELECT * FROM shelf WHERE shelfposition=?",
    obj = req.query;
  pool.query(sql, [obj.shelfposition], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "列表为空",
        data: [],
      });
    res.send({
      code: 1,
      message: "查询成绩成功",
      data: result,
    });
  });
});

router.post("/changeShelfproduct", (req, res) => {
  let sql = "UPDATE shelf SET product = ? WHERE shelfposition= ?";
  obj = req.body;
  pool.query(sql, [obj.product, obj.shelfposition], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改信息成功",
    });
  });
});

//上传头像
router.post("/img", async (req, res, next) => {
  let result = await imgs(req, res);
  if (result === 0)
    return res.send({
      code: 500,
      message: "图片上传失败",
    });
  res.send({
    code: 1,
    message: "图片上传成功",
    data: result,
  });
  // console.log(req.file)
});
//添加学生数据
router.post("/addStudent", (req, res) => {
  let sql = "INSERT INTO student(name,sex,class,img) VALUES (?,?,?,?)",
    obj = req.body;
  pool.query(sql, [obj.name, obj.sex, obj.class, obj.img], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "添加学生信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "添加学生信息成功",
    });
  });
});
//查询学生数据
router.get("/listStudent", (req, res) => {
  let sql = "SELECT id,name,sex,class,img FROM student";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "学生列表查询失败",
        err,
      });
    res.send({
      code: 1,
      message: "查询学生列表成功",
      data: result,
    });
  });
});
//修改学生数据
router.post("/changeStudent", (req, res) => {
  let sql = "UPDATE student SET name=?,sex=?,class=? WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.name, obj.sex, obj.class, obj.id], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改学生信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改学生信息成功",
    });
  });
});
//删除学生
router.post("/deleStudent", (req, res) => {
  let sql = "DELETE FROM student WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.id], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改学生错误",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});

//添加成绩
router.post("/addPer", (req, res) => {
  let sql = "INSERT INTO per(sid,minute,remark,img) VALUES (?,?,?,?)",
    obj = req.body;
  pool.query(sql, [obj.sid, obj.minute, obj.remark, obj.img], (err, result) => {
    if (err)
      res.send({
        code: 500,
        message: "添加成绩失败",
        err,
      });
    res.send({
      code: 1,
      message: "添加成绩成功",
    });
  });
});

//查询成绩
router.get("/selePer", (req, res) => {
  let sql = "SELECT id,sid,minute,remark,img FROM per WHERE sid=?",
    obj = req.query;
  pool.query(sql, [obj.id], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询成绩失败",
        err,
      });
    if (result.length === 0)
      return res.send({
        code: 1,
        message: "成绩列表为空",
        data: [],
      });
    result.forEach((t) => (t.img = JSON.parse(t.img)));
    res.send({
      code: 1,
      message: "查询成绩成功",
      data: result,
    });
  });
});

//删除成绩
router.post("/delePer", (req, res) => {
  let sql = "DELETE FROM per WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.id], (err, result) => {
    if (err)
      res.send({
        code: 500,
        message: "删除成绩失败",
        err,
      });
    res.send({
      code: 1,
      message: "删除成功",
    });
  });
});

//查询课程
router.get("/seleCou", (req, res) => {
  let sql = "SELECT userid,time,content FROM cou";
  pool.query(sql, (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "查询课程失败",
        err,
      });
    let arr = result[0],
      sql2 = "SELECT name,img FROM user WHERE id=?",
      name = "",
      img = "avatar.jpg";
    arr.content = JSON.parse(arr.content);
    pool.query(sql2, [arr.userid], (err2, result2) => {
      if (err2)
        return res.send({
          code: 1,
          message: "老师资料出错",
          data: {
            arr,
            name,
            img,
          },
        });
      name = result2[0].name;
      img = result2[0].img;
      res.send({
        code: 1,
        message: "老师资料出错",
        data: {
          arr,
          name,
          img,
        },
      });
    });
  });
});

//修改课程
router.get("/upCou", (req, res) => {
  let sql = "UPDATE cou SET userid=?,time=?,content=? WHERE id=?",
    obj = req.query,
    time = new Date().getTime();
  pool.query(sql, [obj.userid, time, obj.content, obj.id], (err, result) => {
    if (err)
      res.send({
        code: 500,
        message: "修改课程失败",
        err,
      });
    res.send({
      code: 1,
      message: "修改课程成功",
      err,
    });
  });
});

////////////////////////////////////////////////////////////////////////////////////

let check = (obj) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT id FROM user WHERE name=?";
    pool.query(sql, [obj.name], (err, res) => {
      if (err || res.length !== 0) return resolve(0);
      return resolve(1);
    });
  });
};
//注册
router.post("/reg", async (req, res) => {
  let obj = req.body;
  let sql = "INSERT INTO user(name,pwd,img) VALUES (?,?,?)";
  let checkRes = await check(obj);
  if (checkRes === 0)
    return res.send({
      code: 1,
      message: "该用户名已被注册",
      data: {
        check: 0,
      },
    });
  pool.query(sql, [obj.name, obj.pwd, obj.img], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "注册出错",
        err,
      });
    res.send({
      code: 1,
      message: "注册成功",
      data: {
        check: 1,
      },
    });
  });
});

//登录
router.post("/login", (req, res) => {
  let state = 0;
  let obj = req.body;
  let name = obj.name;
  let pwd = obj.pwd;
  sql = "SELECT img,id,role FROM user WHERE name=? AND pwd=?";
  return new Promise((resolve, reject) => {
    console.log("这里可以");

    pool.query(sql, [obj.name, obj.pwd], (err, result) => {
      if (err) {
        // return res.send({
        //   code: 500,
        //   message: "登录出错",
        //   err,
        // });
      } else if (result.length === 0) {
        reject({
          state: 1,
          message: "请输入正确的用户名和账号",
        });
        // return res.send({
        //   code: 1,
        //   message: "请输入正确的用户名和账号",
        //   data: {
        //     check: 0,
        //   },
        // });
      } else {
        let token = jwt.sign(JSON.stringify(result), "111");
        resolve({
          state,
          pwd,
          name,
          token,
        });
        // return res.send({
        //   code: 1,
        //   message: "登录成功",
        //   data: {
        //     check: 1,
        //     user: {
        //       name: obj.name,
        //       img: result[0].img,
        //       id: result[0].id,
        //       pwd: obj.pwd,
        //       role: result[0].role,
        //     },
        //   },
        // });
      }
    });
  }).then((data) => {
    return res.send({
      state:0,
      message:"成功",
      name:data.name,
      token:data.token,
    });
  });
});
//修改账户信息
router.post("/changeUser", (req, res) => {
  let sql = "UPDATE user SET name=?,pwd=?,img=? WHERE id=?",
    obj = req.body;
  pool.query(sql, [obj.name, obj.pwd, obj.img, obj.id], (err, result) => {
    if (err)
      return res.send({
        code: 500,
        message: "修改信息错误",
        err,
      });
    res.send({
      code: 1,
      message: "修改成功",
    });
  });
});
module.exports = router;
