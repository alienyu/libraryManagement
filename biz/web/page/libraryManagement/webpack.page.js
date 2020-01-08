let webpack = require('webpack');
let path =require("path");
console.log("this is bizA page")
module.exports = {
    resolve: {
        alias: {
            '@webLibraryManagementRoutes': `${path.resolve(__dirname, 'routes')}`,
            '@webLibraryManagementHoc': `${path.resolve(__dirname, 'hoc')}`,
            'webLibraryManagementRenderRoutes': `${path.resolve(__dirname, 'routes.tsx')}`
        }
    }
}