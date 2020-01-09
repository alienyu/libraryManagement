const { writeFileSync } = require("fs");
const path = require("path");

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
        res.send({
            errNo: 200
        })
    }
}

const dealWithLogin = (req,res) => {
    let data = {
        userID: "yuyongjian",
        userName: "於永健"
    };
    res.status(200).send(data);
};

const proxy = {
    "POST /web/libraryManagement/register": dealWithRegister,
    "POST /web/libraryManagement/login": dealWithLogin
}

module.exports = proxy;