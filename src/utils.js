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
    const _fetch = async (url, body, method) => {
        try {
            const apiHost = 'https://pre-onboarding-selection-task.shop';
            const response = await fetch(
                `${apiHost}${url}`,
                {
                    method: method || 'get',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: body ? JSON.stringify(body) : '',
                }
            );

            if (response.status === 201) {
                return {
                    statusCode: Number(values.successCode),
                };
            }

            if (response.status === 200) {
                const res = await response.json();
                return {
                    ...res,
                    statusCode: Number(values.successCode),
                };
            }

            return await response.json();
        } catch (err) {
            console.error('[utils-_fecth] error', err);
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