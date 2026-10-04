import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import './index.css';

const root = createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <App />
    </Provider >);

