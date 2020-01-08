import * as React from 'react'
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { WrapperHeaderCmp } from './styled'
import { Popconfirm, Row, Col, Button } from 'antd';

type props = {
    userStore?: any,
    history: any
}

@inject('userStore')
@observer
class Header extends React.Component<props, {}> {
    constructor(props: any) {
        super(props);
    }

    logout() {
        this.props.userStore.clearUserInfo();
        this.props.history.push('/login');
    }

    changePwd = () => {

    }

    render() {
        const { userStore } = this.props;
        return (
            <WrapperHeaderCmp>
                <Row type="flex" justify="center">
                    <Col span={5}>交易平台部图书馆管理系统</Col>
                    <Col span={5} offset={8} className="userName">
                        <Popconfirm
                            title="logout"
                            onConfirm={this.logout.bind(this)}
                            okText="Yes"
                            cancelText="No"
                        >{userStore.userInfo.userName}</Popconfirm>
                    </Col>
                    {userStore.userInfo.userID ?
                        <Col span={5}><Button type="primary" onClick={this.changePwd}>修改密码</Button></Col>
                        : null
                    }
                </Row>
            </WrapperHeaderCmp>
        )
    }
}

export default withRouter(Header);
