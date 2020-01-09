import * as React from "react";
import { Row, Col, Button, Table, Popconfirm, Modal, Form, Input } from 'antd';
import { WrapperBookListCmp } from './styled';
import { observer, inject } from 'mobx-react';
import { FormComponentProps } from 'antd/es/form';

declare const webAjax: any;

interface FormProps extends FormComponentProps {
    history?: any,
    formData: any,
    getBookList: any,
    handleCancel: any
}

type props = {
    history: any,
    userStore?: any,
    form: any
}

type state = {
    dataSource: any,
    visible: boolean,
    formData: any
}

class BookForm extends React.Component<FormProps, {}> {
    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                webAjax({
                    url: "/submitBook",
                    data: Object.assign({}, values, {bookID: this.props.formData.bookID}),
                    callback() {
                        that.props.getBookList();
                        that.props.handleCancel();
                    }
                })
            }
        });
    }

    componentDidMount() {
        this.props.form.setFieldsValue(this.props.formData);
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>
                <Form.Item label="名称">
                    {getFieldDecorator('bookName', {
                        rules: [{ required: true, message: '请输入书籍名称！' }]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="作者">
                    {getFieldDecorator('author')(<Input />)}
                </Form.Item>
                <Form.Item label="出版社">
                    {getFieldDecorator('publish')(<Input />)}
                </Form.Item>
                <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </Form>
        )
    }
}

export const WrappedForm = Form.create<FormProps>()(BookForm);

@inject("userStore")
@observer
export default class BookList extends React.Component<props, state> {
    constructor(props: props) {
        super(props);
        this.state = {
            dataSource: [],
            visible: false,
            formData: {}
        }
    }

    componentDidMount() {
        this.getBookList();
    }

    getBookList = () => {
        let that = this;
        webAjax({
            method: "post",
            url: "/getBookList",
            callback(data) {
                if(data.errNo == 200) {
                    that.setState({ dataSource: data.data });
                }
            }
        })
    }

    gotoOrder = () => {
        this.props.history.push("/home");
    }

    gotoUserList = () => {
        this.props.history.push("/userList");
    }

    order = (bookID) => {
        let that = this;
        webAjax({
            method: "post",
            url: "/orderBook",
            data: {
                userID: this.props.userStore.userInfo.userID,
                bookID
            },
            callback(data) {
                if(data.errNo == 200) {
                    that.getBookList();
                }
            }
        })
    }

    addBook = () => {
        this.setState({
            visible: true,
            formData: {}
        })
    }

    modify = (bookID) => {
        let selectedBookData = this.state.dataSource.find(item => item.bookID == bookID);
        this.setState({
            visible: true,
            formData: selectedBookData
        })
    }

    delete = (bookID) => {
        let that = this;
        webAjax({
            method: "post",
            url: "/deleteBook",
            data: {bookID},
            callback(data) {
                that.getBookList();
            }
        })
    }

    handleCancel = () => {
        this.setState({ visible: false })
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
            title: "作者",
            dataIndex: "author",
            key: "author"
        }, {
            title: "出版社",
            dataIndex: "publish",
            key: "publish"
        }, {
            title: "操作",
            key: "ops",
            render: (text, record) => (
                <span>
                    <Button style={{ marginRight: 10 }} type="primary" disabled={record.orderStatus} onClick={this.order.bind(this, record.bookID)}>借阅</Button>
                    {userInfo.type == "super" ? <Button style={{ marginRight: 10 }} type="primary" onClick={this.modify.bind(this, record.bookID)}>修改</Button> : null}
                    {userInfo.type == "super" ?
                        //@ts-ignore
                        <Popconfirm
                            placement="topLeft"
                            title={"确认要删除此书籍吗？"}
                            onConfirm={this.delete.bind(this, record.bookID)}
                            okText="Yes"
                            canelText="No"
                            disabled={record.orderStatus} 
                        >
                            <Button style={{ marginRight: 10 }} disabled={record.orderStatus} type="danger">删除</Button>
                        </Popconfirm> : null}
                </span>
            )
        }];

        return (
            <WrapperBookListCmp>
                <Row type="flex" justify="center" className="line">
                    <Col span={22}>
                        <Row className="ops" type="flex" justify="start">
                            <Col span={4}><Button type="primary" onClick={this.gotoOrder}>查询个人订阅情况</Button></Col>
                            {userInfo.type == "super" ? <Col span={4}><Button type="primary" onClick={this.gotoUserList}>管理用户</Button></Col> : null}
                            {userInfo.type == "super" ? <Col span={4}><Button type="primary" onClick={this.addBook}>添加书籍</Button></Col> : null}
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
                            rowKey="bookID"
                        />
                    </Col>
                </Row>
                {this.state.visible ?
                    <Modal
                        title={this.state.formData.bookID ? "修改书籍" : "添加书籍"}
                        visible={true}
                        footer={null}
                        onCancel={this.handleCancel}
                    >
                        <WrappedForm 
                            formData={this.state.formData} 
                            getBookList={this.getBookList} 
                            handleCancel={this.handleCancel}
                        />
                    </Modal>
                    : null}
            </WrapperBookListCmp>
        );
    }
}
