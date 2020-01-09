import * as React from "react";
import { Row, Col, Form, Icon, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { observer, inject } from 'mobx-react';
import { WrapperLoginCmp } from './styled';

declare const webAjax: any;
declare const sha256: any;
declare const md5: any;

interface NormalLoginFormProps extends FormComponentProps {
    userStore: any,
    ajaxLoadingStore: any,
    form: any,
    history: any
}

@inject("userStore", "ajaxLoadingStore")
@observer
class NormalLoginForm extends React.Component<NormalLoginFormProps, {}> {
    componentWillMount() {
        const { userStore, history } = this.props;
        if(userStore.userInfo.userID) {
            history.push("/");
        }
    }
    handleSubmit = (e: any) => {
        e.preventDefault();
        const { userStore, history } = this.props;
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                webAjax({
                    url: "/login",
                    data: {
                        userID: values.userID,
                        password: sha256(md5(values.password))
                    },
                    callback(data: any) {
                        if(data.errNo == 0) {
                            message.error(data.errMsg);
                        } else {
                            userStore.changeUserInfo(data.data);
                            history.push("/");
                        }
                    }
                })
            }
        });
    };

    gotoReg = () => {
        this.props.history.push("/register");
    }

    render() {
        const { userStore, ajaxLoadingStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <WrapperLoginCmp>
                <Row type="flex" justify="center" align="middle" className="pageFrame">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('userID', {
                                rules: [{ required: true, message: "请输入账号！" }],
                            })(
                                <Input
                                    placeholder="输入账号（万向邮箱账号部分）"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码！' }],
                            })(
                                <Input
                                    type="password"
                                    placeholder="请输入密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" disabled={ajaxLoadingStore.status}>{ajaxLoadingStore.status ? '登录中' : '登录'}</Button>
                        </Form.Item>
                        <div className="gotoReg">还没有账号？<a onClick={this.gotoReg}>前往注册</a></div>
                    </Form>
                </Row>
            </WrapperLoginCmp>
        );
    }
}

const WrappedNormalLoginForm = Form.create<NormalLoginFormProps>()(NormalLoginForm);
export default WrappedNormalLoginForm;