import * as React from "react";
import { Row, Col, Button, Table } from 'antd';
import { observer, inject } from 'mobx-react';
import { WrapperHomeCmp } from './styled';

type props = {
    history: any,
    userStore?: any
}

@inject("userStore")
@observer
export default class Home extends React.Component<props> {
    constructor(props: props) {
        super(props);
    }

    gotoBookList = () => {
        this.props.history.push("/bookList");
    }

    gotoBookMgr = () => {
        this.props.history.push("/bookMgr");
    }

    render() {
        const { userInfo } = this.props.userStore;
        return (
            <WrapperHomeCmp>
                <Row type="flex" justify="center" className="pageFrame">
                    <Col span={18}>
                        <Row className="ops" type="flex" justify="space-around">
                            <Button type="primary" onClick={this.gotoBookList}>查询当前书籍情况</Button>
                            {userInfo.type == "super" ?
                                <Button type="primary" onClick={this.gotoBookMgr}>管理书籍</Button>
                                : null}
                        </Row>
                    </Col>
                </Row>
            </WrapperHomeCmp>
        );
    }
}