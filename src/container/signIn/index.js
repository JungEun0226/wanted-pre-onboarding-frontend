import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    Input,
    Button,
    message,
} from 'antd';

import utils from '../../utils';
import values from '../../values';

export const Wrapper = styled.div`
  width: 500px;
  
  margin: 100px auto;
  
  .wrapper-header {
    text-align: center;
    margin-bottom: 10px;
    
    font-size: 20px;
  }
  
  .wrapper-body {
    & > .ant-input {
      margin-bottom: 10px;
    }
  }
  
  .wrapper-footer {
    margin-top: 10px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    & > .ant-btn:first-child {
      margin-right: 10px;
    }
  }
`;

const SignInComponent = () => {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');

    let isValidId = true;
    if (id && id.indexOf('@') > -1) {
        isValidId = false;
    }

    let isValidPwd = true;
    if (pwd && pwd.length > 7) {
        isValidPwd = false;
    }

    return (
        <Wrapper>
            <div className="wrapper-header">
                로그인
            </div>
            <div className="wrapper-body">
                <Input
                    data-testid="email-input"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    status={isValidId ? 'error' : ''}
                    placeholder="올바른 이메일 형식으로 입력해주세요."
                />
                <Input.Password
                    data-testid="password-input"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    status={isValidPwd ? 'error' : ''}
                    placeholder="비밀번호는 8자리 이상 입력해주세요"
                />
            </div>
            <div className="wrapper-footer">
                <Button
                    data-testid="signup-button"
                    onClick={() => {
                        navigate('/signup');
                    }}
                >
                    회원가입
                </Button>
                <Button
                    data-testid="signin-button"
                    disabled={isValidId || isValidPwd}
                    onClick={async () => {
                        const response = await utils()._fetch(
                            '/auth/signin',
                            {
                                email: id,
                                password: pwd,
                            },
                            'post',
                        );
                        if (response.statusCode !== Number(values.successCode)) {
                            message.error({
                                content: response.data.message,
                            });
                            return;
                        }

                        utils().updateLocal(values.tokenKey, response.data.access_token);

                        navigate('/todo');
                    }}
                >
                    로그인
                </Button>
            </div>
        </Wrapper>
    );
};

export default SignInComponent;