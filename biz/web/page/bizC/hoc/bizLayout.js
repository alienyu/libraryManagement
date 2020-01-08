import React from "react";
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import WebHeader from 'web-headerCmp';
import WebMenuBar from 'web-menuBarCmp';
import WebFooter from 'web-footerCmp';

const bizLayout = (WrappedComponent) => {
    return (props) => {
        return (
            <Layout>
                <Header><WebHeader /></Header>
                <Layout>
                    <Sider><WebMenuBar /></Sider>
                    <Content style={{ height: 'calc(100vh - 156px)' }}>
                        <WrappedComponent {...props} />
                    </Content>
                </Layout>
                <Footer style={{ background: '#d8d9da' }}><WebFooter /></Footer>
            </Layout >
        )
    }
}

export default bizLayout;
