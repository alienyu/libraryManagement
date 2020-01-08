import * as React from "react";
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import renderRoutes from "webLibraryManagementRenderRoutes";

declare const intl: any;


export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <Router basename="/web/libraryManagement">
                {renderRoutes()}
         </Router>
        );
    }
}