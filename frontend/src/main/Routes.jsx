import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";

import Home from '../components/home/Home';
import UserCrud from '../components/user/UserCrud';
import LoginForm from '../components/user/LoginForm';
import RegisterForm from '../components/user/RegisterForm';

export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/home" element={<Home />}/>
            <Route path="/users" element={<UserCrud />}/>
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/register" element={<RegisterForm />}/>
            <Route path="/*" element={<Navigate to="/login" replace/>}/>
        </Routes>
    );
}