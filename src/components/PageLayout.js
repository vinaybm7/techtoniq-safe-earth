import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from "./Header";
import Footer from "./Footer";
const PageLayout = ({ children }) => {
    return (_jsxs("div", { className: "flex min-h-screen flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1", children: children }), _jsx(Footer, {})] }));
};
export default PageLayout;
