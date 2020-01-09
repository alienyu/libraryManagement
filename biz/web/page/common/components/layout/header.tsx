import * as React from 'react'
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { WrapperHeaderCmp } from './styled'
import { Popconfirm, Row, Col, Button, Form, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';

declare const webAjax: any;

type props = {
    userStore?: any,
    history: any
}

type state = {
    type: any,
    visible: boolean
}


interface PwdFormProps extends FormComponentProps {
    history?: any
}

class PwdForm extends React.Component<PwdFormProps, {}> {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                webAjax({
                    url: "/changePwd",
                    data: values,
                    callback(data) {
                        this.props.userStore.clearUserInfo();
                        this.props.history.push("/login");
                    }
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>
                <Form.Item label="原密码">
                    {getFieldDecorator('oldPwd', {
                        rules: [{ required: true, message: '请输入原密码！' }]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="新密码">
                    {getFieldDecorator('newPwd', {
                        rules: [{ required: true, message: '请输入原密码！' }]
                    })(<Input />)}
                </Form.Item>
                <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </Form>
        )
    }
}

export const WrappedPwdForm = Form.create<PwdFormProps>()(PwdForm);

interface InfoFormProps extends FormComponentProps {
    history?: any
}

class InfoForm extends React.Component<InfoFormProps, {}> {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                webAjax({
                    url: "/changeInfo",
                    data: values,
                    callback(data) {
                        this.props.userStore.changeUserInfo({ userName: values.userName });
                    }
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>
                <Form.Item label="姓名">
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入姓名！' }]
                    })(<Input />)}
                </Form.Item>
                <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </Form>
        )
    }
}

export const WrappedInfoForm = Form.create<InfoFormProps>()(InfoForm);

@inject('userStore')
@observer
class Header extends React.Component<props, state> {
    constructor(props: any) {
        super(props);
        this.state = {
            type: "",
            visible: false
        }
    }

    logout() {
        this.props.userStore.clearUserInfo();
        this.props.history.push('/login');
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    changePwd = () => {
        this.setState({
            type: "pwd",
            visible: true
        })
    }

    changeInfo = () => {
        this.setState({
            type: "info",
            visible: true
        })
    }

    render() {
        const { userStore } = this.props;
        return (
            <WrapperHeaderCmp>
                <Row type="flex" justify="space-between">
                    <Col span={5}>交易平台部图书馆管理系统</Col>
                    <Col span={10}>
                        <Row type="flex" justify="end">
                            <Col span={12}>
                                <Popconfirm
                                    title="logout"
                                    onConfirm={this.logout.bind(this)}
                                    okText="Yes"
                                    cancelText="No"
                                >{userStore.userInfo.userName}</Popconfirm>
                                {userStore.userInfo.userID ?
                                    [<Button style={{marginLeft: 20}} key="info" type="primary" onClick={this.changeInfo}>修改个人信息</Button>,
                                    <Button style={{marginLeft: 20}} key="pwd" type="primary" onClick={this.changePwd}>修改密码</Button>]
                                    : null
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {this.state.visible ?
                    <Modal
                        title=""
                        visible={true}
                        footer={null}
                        onCancel={this.handleCancel}
                    >
                        {this.state.type == "pwd" ?
                            <WrappedPwdForm /> :
                            <WrappedInfoForm />
                        }
                    </Modal>
                    : null}
            </WrapperHeaderCmp>
        )
    }
}

export default withRouter(Header);
