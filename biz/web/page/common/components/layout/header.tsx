import * as React from 'react'
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { WrapperHeaderCmp } from './styled'
import { Popconfirm, Row, Col, Select } from 'antd';
const { Option } = Select;
import Constants from 'webConstants';
const { supportedLang } = Constants;

declare var intl: any;

type props = {
    userStore? : any,
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

    render() {
        const { userStore } = this.props;
        return (
            <WrapperHeaderCmp>
                <Row type="flex" justify="center">
                    <Col span={5}>图书馆管理系统</Col>
                    <Col span={5} offset={8} className="userName">
                        <Popconfirm
                            title="logout"
                            onConfirm={this.logout.bind(this)}
                            okText="Yes"
                            cancelText="No"
                        >{userStore.userInfo.userName}</Popconfirm>
                    </Col>
                </Row>
            </WrapperHeaderCmp>
        )
    }
}

export default withRouter(Header);
