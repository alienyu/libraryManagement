import * as React from "react";
import { Row, Col, Button, Table, Popconfirm} from 'antd';
import { WrapperUserListCmp } from './styled';
import { observer, inject } from 'mobx-react';

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
export default class BookList extends React.Component<props, state> {
    constructor(props: props) {
        super(props);
        this.state = {
            dataSource: [],
        }
    }

    componentWillMount() {
        this.getUserList()
    }

    getUserList = () => {
        let that = this;
        webAjax({
            method: "post",
            url: "/getUserList",
            callback(data) {
                that.setState({ dataSource: data.data });
            }
        })
    }

    gotoOrder = () => {
        this.props.history.push("/home");
    }

    gotoBookList = () => {
        this.props.history.push("/bookList");
    }

    delete = (userID) => {
        let that = this;
        webAjax({
            method: "post",
            url: "/deleteUser",
            data: {userID},
            callback() {
                that.getUserList();
            }
                
        })
    }

    render() {
        const { userInfo } = this.props.userStore;
        const columns = [{
            title: "用户ID",
            dataIndex: "userID",
            key: "userID"
        }, {
            title: "用户姓名",
            dataIndex: "userName",
            key: "userName"
        }, {
            title: "操作",
            key: "ops",
            render: (text, record) => (
                <span>
                    {userInfo.type == "super" ?
                        //@ts-ignore
                        <Popconfirm
                            placement="topLeft"
                            title={"确认要删除此用户吗？"}
                            onConfirm={this.delete.bind(this, record.userID)}
                            okText="Yes"
                            canelText="No"
                            disabled={record.hasOrder} 
                        >
                            <Button style={{ marginRight: 10 }} disabled={record.hasOrder} type="danger">删除</Button>
                        </Popconfirm> : null}
                </span>
            )
        }];

        return (
            <WrapperUserListCmp>
                <Row type="flex" justify="center" className="line">
                    <Col span={22}>
                        <Row className="ops" type="flex" justify="start">
                            <Col span={4}><Button type="primary" onClick={this.gotoOrder}>查询个人订阅情况</Button></Col>
                            <Col span={4}><Button type="primary" onClick={this.gotoBookList}>查询当前书籍情况</Button></Col>
                        </Row>
                    </Col>
                </Row>
                <Row type="flex" justify="center" className="line">
                    <Col span={22}>
                        <Table 
                            style={{ background: '#fff' }} 
                            columns={columns} 
                            bordered={true} 
                            dataSource={this.state.dataSource} 
                            rowKey="userID"
                        />
                    </Col>
                </Row>
            </WrapperUserListCmp>
        );
    }
}
