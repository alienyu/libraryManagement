import * as React from "react";
import { Row, Form, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { observer, inject } from 'mobx-react';
import { WrapperRegisterCmp } from './styled';

declare const webAjax: any;
declare const intl: any;
declare const sha256: any;
declare const md5: any;

interface NormalRegFormProps extends FormComponentProps {
    userStore: any,
    ajaxLoadingStore: any,
    form: any,
    history: any
}

@inject("userStore", "ajaxLoadingStore")
@observer
class NormalRegForm extends React.Component<NormalRegFormProps, {}> {
    handleSubmit = (e: any) => {
        e.preventDefault();
        const { userStore, history } = this.props;
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                webAjax({
                    url: "/register",
                    data: {
                        userID: values.userID,
                        userName: values.userName,
                        password: sha256(md5(values.password))
                    },
                    callback(data: any) {
                        if(data.errNo == 0) {
                            message.error(data.errMsg);
                        } else {
                            userStore.changeUserInfo({
                                userID: values.userID,
                                userName: values.userName
                            });
                            history.push("/");
                        }
                    }
                })
            }
        });
    };

    gotoLogin = () => {
        this.props.history.push("/login");
    }

    render() {
        const { userStore, ajaxLoadingStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <WrapperRegisterCmp>
                <Row type="flex" justify="center" align="middle" className="pageFrame">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('userID', {
                                rules: [{ required: true, message: '请输入账号！'}],
                            })(
                                <Input
                                    placeholder="输入账号（万向邮箱账号部分）"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input
                                    type="password"
                                    placeholder="请输入密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入姓名!' }],
                            })(
                                <Input
                                    type="text"
                                    placeholder="请输入姓名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" disabled={ajaxLoadingStore.status}>{ajaxLoadingStore.status ? '注册中' : '注册'}</Button>
                        </Form.Item>
                        <div className="gotoReg">已有账号？<a onClick={this.gotoLogin}>前往登录</a></div>
                    </Form>
                </Row>
            </WrapperRegisterCmp>
        );
    }
}

const WrappedNormalRegForm = Form.create<NormalRegFormProps>()(NormalRegForm);
export default WrappedNormalRegForm;