import { combineReducers } from "redux";
import { auth } from "./reducers/auth";
import { admin } from "./reducers/admin";
import { data } from "./reducers/data";

export default combineReducers({
    auth: auth.reducer,
    admin: admin.reducer,
    data: data.reducer,
});
