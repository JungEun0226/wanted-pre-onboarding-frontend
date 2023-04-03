import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import SignInComponent from '../container/signIn';
import SignUpComponent from '../container/signUp';
import TodoComponent from '../container/todo';

import utils from '../utils';

const App = () => {
    return (
        <Routes>
            <Route
                path={'/' || ''}
                Component={() => {
                    const isLogin = !!utils().isLoggedIn();

                    if (isLogin) {
                        return <Navigate to="/todo" replace />;
                    }
                    return <Navigate to="/signin" replace />;
                }}
            />
            <Route
                path={'/signin'}
                Component={() => {
                    const isLogin = !!utils().isLoggedIn();

                    if (isLogin) {
                        return <Navigate to="/todo" replace />;
                    }
                    return <SignInComponent />;
                }}
            />
            <Route
                path={'/signup'}
                Component={() => {
                    const isLogin = !!utils().isLoggedIn();

                    if (isLogin) {
                        return <Navigate to="/todo" replace />;
                    }
                    return <SignUpComponent />;
                }}
            />
            <Route
                path={'/todo'}
                Component={() => {
                    const isLogin = !!utils().isLoggedIn();

                    if (isLogin) {
                        return <TodoComponent />;
                    }
                    return <Navigate to="/signin" replace />;
                }}
            />
            {/* default router */}
            <Route
                path={'*'}
                Component={() => {
                    const isLogin = !!utils().isLoggedIn();

                    if (isLogin) {
                        return <Navigate to="/todo" replace />;
                    }
                    return <Navigate to="/signin" replace />;
                }}
            />
        </Routes>
    );
};

export default App;