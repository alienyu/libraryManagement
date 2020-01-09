const moment = require('moment');
const { writeFileSync } = require("fs");
const path = require("path");
const sha25 = require("js-sha256");
const md5 = require("md5");

const successRes = {
    errNo: 200
};

const writeFile = ({filePath, content}) => {
    writeFileSync(path.resolve(__dirname, filePath), JSON.stringify(content));
}

const readFile = (filePath) => {
    try {
        return JSON.parse(require(path.resolve(__dirname, filePath)));
    } catch(e) {
        return require(path.resolve(__dirname, filePath));
    }
}

const dealWithRegister = (req, res) => {
    let filePath = "./data/user.json";
    let oriData = readFile(filePath);
    let params = req.body;
    let { userID } = params;
    if(oriData.findIndex(item => item.userID == userID) > -1) {
        res.send({
            errNo: 0,
            errMsg: "账号已存在！"
        })
    } else {
        oriData.push(params);
        writeFile({filePath, content: oriData});
        res.send(successRes);
    }
}

const dealWithLogin = (req,res) => {
    let filePath = "./data/user.json";
    let oriData = readFile(filePath);
    let params = req.body;
    let { userID, password } = params;
    let curUser = oriData.find(item => item.userID == userID);
    if(!curUser) {
        res.send({errNo:0, errMsg: "没有此账号！"})
    } else {
        if(curUser.password == password) {
            res.send(Object.assign({}, successRes, {data:{
                userID: curUser.userID, 
                userName: curUser.userName, 
                type: curUser.type
            }}));
        } else {
            res.send({errNo:0, errMsg: "密码错误！"})
        }
    }
};

const dealWithChangeInfo = (req, res) => {
    let filePath = "./data/user.json";
    let oriData = readFile(filePath);
    let params = req.body;
    let { userID, userName } = params;
    oriData.map(item => {
        if(item.userID == userID) {
            item.userName = userName;
        }
    });
    writeFile({filePath, content: oriData});
    res.send(successRes);
};

const dealWithChangePwd = (req, res) => {
    let filePath = "./data/user.json";
    let oriData = readFile(filePath);
    let params = req.body;
    let { userID, oldPwd, newPwd } = params;
    let curUser = oriData.find(item => item.userID == userID);
    if(curUser.password == oldPwd) {
        curUser.password = newPwd;
        writeFile({filePath, content: oriData});
        res.send(successRes);
    } else {
        res.send({errNo:0, errMsg: "密码错误！"});
    }
};

const dealWithGetOrderRecords = (req, res) => {
    let filePath = "./data/orderRecords.json";
    let bookFilePath = "./data/book.json";
    let oriData = readFile(filePath);
    let bookData = readFile(bookFilePath);
    let params = req.body;
    let { userID } = params;
    let curOrderRecords = oriData.filter(item => item.userID == userID);
    let resData = [];
    curOrderRecords.map(item => {
        let orderID = item.orderID;
        let bookID = item.bookID;
        let bookName = bookData.find(item => item.bookID == bookID).bookName;
        let { orderDate, returnDate } = item;
        resData.push({
            orderID,
            bookID,
            bookName,
            orderDate,
            returnDate
        })
    });
    res.send(Object.assign({}, successRes, {data:resData}));
};

const dealWithReturnBook = (req, res) => {
    let filePath = "./data/orderRecords.json";
    let bookFilePath = "./data/book.json";
    let oriData = readFile(filePath);
    let bookData = readFile(bookFilePath);
    let params = req.body;
    let { orderID } = params;
    var bookID = "";
    oriData.map(item => {
        if(item.orderID == orderID) {
            item.returnDate = moment().format('YYYY-MM-DD HH:mm:ss');
            bookID = item.bookID;
        };
    });
    bookData.map(item => {
        if(item.bookID == bookID) {item.orderStatus = 0;}
    });
    writeFile({filePath, content: oriData});
    writeFile({filePath: bookFilePath, content: bookData});
    res.send(successRes);
};

const proxy = {
    "POST /web/libraryManagement/register": dealWithRegister,
    "POST /web/libraryManagement/login": dealWithLogin,
    "POST /web/libraryManagement/changeInfo": dealWithChangeInfo,
    "POST /web/libraryManagement/changePwd": dealWithChangePwd,
    "POST /web/libraryManagement/getOrderRecords": dealWithGetOrderRecords,
    "POST /web/libraryManagement/returnBook": dealWithReturnBook
}

module.exports = proxy;