import values from './values';

const utils = () => {
    // local storage 관련 utils
    const readLocal = (key) => {
        if (!key) {
            return;
        }

        return window.localStorage.getItem(key);
    };

    const updateLocal = (key, value) => {
        if (!key || !value) {
            return;
        }

        return window.localStorage.setItem(key, String(value));
    };

    const removeLocal = (key) => {
        if (!key) {
            return;
        }

        return window.localStorage.removeItem(key);
    };

    // 로그인 되어있는지 확인
    const isLoggedIn = () => {
        const token = readLocal(values.tokenKey);

        return token;
    };

    // fetch
    const _fetch = async (url, body, method, isBearer, notUseContentType) => {
        try {
            // const apiHost = 'https://pre-onboarding-selection-task.shop';
            const apiHost = 'http://localhost:8000';

            const opt = {
                method: method || 'get',
                headers: {
                    // 'Content-Type': 'application/json',
                },
            };
            if (body && Object.keys(body).length > 0) {
                opt.body = JSON.stringify(body);
            }
            if (isBearer) {
                opt.headers.Authorization = `Bearer ${utils().readLocal(values.tokenKey)}`;
            }
            if (!notUseContentType) {
                opt.headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(
                `${apiHost}${url}`,
                opt,
            );

            if (response.status === 201 || response.status === 204) {
                try {
                    const res = await response.json();
                    return {
                        statusCode: Number(values.successCode),
                        data: res,
                    };
                } catch (err) {
                    console.log('no response data');
                    return {
                        statusCode: Number(values.successCode),
                    };
                }
            }

            if (response.status === 200) {
                const res = await response.json();
                return {
                    data: res,
                    statusCode: Number(values.successCode),
                };
            }

            const res = await response.json();
            return {
                data: res,
                statusCode: 404,
            };
        } catch (err) {
            console.error('[utils-_fecth] error', err);
            return {
                data: {
                    message: '네트워크 오류입니다.',
                },
                statusCode: 404,
            };
        }
    };

    return {
        readLocal,
        updateLocal,
        removeLocal,
        isLoggedIn,
        _fetch,
    };
};

export default utils;