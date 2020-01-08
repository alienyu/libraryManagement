const dealWithLogin = (req,res) => {
    let data = {
        userID: "yuyongjian",
        userName: "於永健"
    };
    res.status(200).send(data);
};

const proxy = {
    "POST /web/libraryManagement/login": dealWithLogin
}

module.exports = proxy;