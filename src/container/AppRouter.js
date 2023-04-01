import React from 'react';
import { Route, Routes } from 'react-router-dom';

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
                    if (utils().isLoggedIn()) {
                        return <TodoComponent />;
                    }
                    return <SignInComponent />;
                }}
            />
            <Route
                path={'/signin'}
                Component={() => {
                    if (utils().isLoggedIn()) {
                        return <TodoComponent />;
                    }
                    return <SignInComponent />;
                }}
            />
            <Route
                path={'/signup'}
                Component={() => {
                    if (utils().isLoggedIn()) {
                        return <TodoComponent />;
                    }
                    return <SignUpComponent />;
                }}
            />
            <Route
                path={'/todo'}
                Component={() => {
                    if (utils().isLoggedIn()) {
                        return <TodoComponent />;
                    }
                    return <SignInComponent />;
                }}
            />
        </Routes>
    );
};

export default App;