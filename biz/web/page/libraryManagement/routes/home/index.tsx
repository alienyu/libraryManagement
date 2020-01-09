import * as React from "react";
import { Row, Col, Button, Table, message } from 'antd';
import { observer, inject } from 'mobx-react';
import { WrapperHomeCmp } from './styled';

declare const webAjax: any;

type props = {
    history: any,
    userStore?: any
}

type state = {
    dataSource: any
}
@inject("userStore")
@observer
export default class Home extends React.Component<props, state> {
    constructor(props: props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    getOrderRecords = () => {
        let that = this;
        webAjax({
            method: "post",
            url: "/getOrderRecords",
            data: {userID: this.props.userStore.userInfo.userID},
            callback(data) {
                if(data.errNo == 200) {
                    that.setState({dataSource: data.data});
                }
            }
        })
    }

    componentDidMount() {
        this.getOrderRecords()
    }

    gotoBookList = () => {
        this.props.history.push("/bookList");
    }

    gotoUserMgr = () => {
        this.props.history.push("/userList");
    }

    returnBook = (orderID) => {
        let that = this;
        webAjax({
            method: "post",
            url: "/returnBook",
            data: {orderID},
            callback(data) {
                if(data.errNo == 200) {
                    message.success("归还成功！", 1.5, () => {
                        that.getOrderRecords();
                    })
                }
            }
        })
    }

    render() {
        const { userInfo } = this.props.userStore;
        const columns = [{
            title: "书籍ID",
            dataIndex: "bookID",
            key: "bookID"
        }, {
            title: "书籍名称",
            dataIndex: "bookName",
            key: "bookName"
        }, {
            title: "借阅日期",
            dataIndex: "orderDate",
            key: "orderDate"
        }, {
            title: "归还日期",
            dataIndex: "returnDate",
            key: "returnDate"
        }, {
            title: "操作",
            key: "ops",
            render: (text, record) => (
                <Button type="primary" disabled={record.returnDate} onClick={this.returnBook.bind(this, record.orderID)}>归还</Button>
            )
        }];

        return (
            <WrapperHomeCmp>
                <Row type="flex" justify="center" className="line">
                    <Col span={22}>
                        <Row className="ops" type="flex" justify="start">
                            <Col span={4}><Button type="primary" onClick={this.gotoBookList}>查询当前书籍情况</Button></Col>
                            {userInfo.type == "super" ? 
                                <Col span={4}><Button type="primary" onClick={this.gotoUserMgr}>用户管理</Button></Col>
                            : null}
                        </Row>
                    </Col>
                </Row>
                <Row type="flex" justify="center" className="line">
                    <Col span={22}>      
                        <Table 
                            style={{background: '#fff'}} 
                            columns={columns} 
                            bordered={true} 
                            dataSource={this.state.dataSource} 
                            rowKey="orderID"
                        />
                    </Col>
                </Row>
            </WrapperHomeCmp>
        );
    }
}