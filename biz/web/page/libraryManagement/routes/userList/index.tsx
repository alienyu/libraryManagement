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
            dataSource: require("../../mock/data/user.json"),
        }
    }

    componentWillMount() {
        webAjax({
            method: "get",
            url: "/getUserList",
            callback(data) {
                this.setState({ dataSources: data });
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
        webAjax({
            method: "post",
            url: "/deleteUser",
            data: {userID},
            callback(data) {
                let index = this.state.dateSource.findIndex(item => item.userID == userID);
                this.state.dataSource.splice(index, 1);
                this.setState({ dataSources: this.state.dataSource });
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
                        >
                            <Button style={{ marginRight: 10 }} type="danger">删除</Button>
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
                        <Table style={{ background: '#fff' }} columns={columns} bordered={true} dataSource={this.state.dataSource} />
                    </Col>
                </Row>
            </WrapperUserListCmp>
        );
    }
}
