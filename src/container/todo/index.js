import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    Input,
    Button,
    message,
    Checkbox,
} from 'antd';

import utils from '../../utils';
import values from '../../values';

export const Wrapper = styled.div`
  width: 500px;

  margin: 100px auto;

  .wrapper-header {
    margin-bottom: 10px;

    font-size: 20px;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .wrapper-body {
    .wrapper-body-top {
      display: flex;
      align-items: center;

      & > .ant-input {
        margin-right: 10px;
      }
      & > .ant-btn {
        width: 100px;
      }
    }
    
    .wrapper-body-bottom {
      list-style: none;
      padding: 0;
      
      .list-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .ant-checkbox-wrapper {
          margin-right: 10px;
        }
        
        .list-row-name {
          width: 100%;
        }
        
        & > .ant-btn {
          margin-left: 10px;
        }
        
        &:last-child {
          margin-bottom: 0;
        }
      }
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

const handleChangeData = (list, item, key, value) => (
    list.map((row) => item.id === row.id ? { ...row, [key]: value } : row)
);

const handleCreateTodo = async (newTodo) => {
    const response = await utils()._fetch(
        '/todos',
        {
            todo: newTodo,
        },
        'post',
        true,
    );
    if (response.statusCode !== Number(values.successCode)) {
        message.error({
            content: response.message,
        });
        return {
            succ: false,
        };
    }
    message.success({
        content: '등록되었습니다.',
    });
    return {
        succ: true,
        data: response.data,
    };
};

const handleUpdateTodo = async (item, newTodo, checked) => {
    const body = {
        todo: item.todo,
        isCompleted: item.isCompleted,
    };
    if (newTodo) {
        body.todo = newTodo;
    }
    if (checked) {
        body.isCompleted = checked;
    }
    const response = await utils()._fetch(
        `/todos/${item.id}`,
        body,
        'put',
        true,
    );
    if (response.statusCode !== Number(values.successCode)) {
        message.error({
            content: response.message,
        });
        return {
            succ: false,
        };
    }
    message.success({
        content: '수정되었습니다.',
    });
    return {
        succ: true,
        data: response.data,
    };
};

const handleDeleteTodo = async (id) => {
    const response = await utils()._fetch(
        `/todos/${id}`,
        null,
        'delete',
        true,
    );
    if (response.statusCode !== Number(values.successCode)) {
        message.error({
            content: response.message,
        });
        return {
            succ: false,
        };
    }
    message.success({
        content: '삭제되었습니다.',
    });
    return {
        succ: true,
        data: response.data,
    };
};

const TodoComponent = () => {
    const navigate = useNavigate();

    const [newTodo, setNewTodo] = useState('');
    const [list, setList] = useState([]);
    // const list = [
    //     {
    //         id: '',
    //         todo: '',
    //         origTodo: '',
    //         isEdit: false,
    //         isCompleted: false,
    //     },
    // ];

    // get list data
    useEffect(() => {
        const getList = async () => {
            const response = await utils()._fetch(
                '/todos',
                null,
                'get',
                true,
                true,
            );
            if (response.statusCode !== Number(values.successCode)) {
                message.error({
                    content: response.data.message,
                });
                return;
            }

            const newList = [];
            response.data.forEach((item) => {
                newList.push({
                    ...item,
                    isEdit: false,
                    origTodo: item.todo,
                });
            });

            newList.sort((a, b) => b - a);
            setList(newList);
        };
        getList();
    }, []);

    return (
        <Wrapper>
            <div className="wrapper-header">
                <div className="wrapper-header-title">
                    TODO
                </div>
                <Button
                    onClick={() => {
                        utils().removeLocal(values.tokenKey);
                        navigate('/signin');
                    }}
                >
                    로그아웃
                </Button>
            </div>
            <div className="wrapper-body">
                <div className="wrapper-body-top">
                    <Input
                        data-testid="new-todo-input"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="TODO 항목을 입력해주세요"
                    />
                    <Button
                        data-testid="new-todo-add-button"
                        disabled={!newTodo}
                        onClick={async () => {
                            const response = await handleCreateTodo(newTodo);
                            if (response.succ) {
                                setList([
                                    response.data,
                                    ...list,
                                ]);
                                setNewTodo('');
                            }
                        }}
                    >
                        추가
                    </Button>
                </div>
                <ul className="wrapper-body-bottom">
                    {
                        list.map((item) => (
                            <li
                                key={item.id}
                                className="list-row"
                            >
                                <Checkbox
                                    checked={item.isCompleted}
                                    onChange={async (e) => {
                                        const _checked = e.target.checked;
                                        const response = await handleUpdateTodo(item, '', _checked);
                                        if (response.succ) {
                                            setList(
                                                handleChangeData(list, item, 'isCompleted', _checked)
                                            );
                                        }
                                    }}
                                />
                                <div className="list-row-name">
                                    {
                                        item.isEdit ? (
                                            <Input
                                                data-testid="modify-input"
                                                value={item.todo}
                                                placeholder={item.origTodo}
                                                onChange={(e) => {
                                                    const _value = e.target.value;
                                                    setList(
                                                        handleChangeData(list, item, 'todo', _value)
                                                    );
                                                }}
                                            />
                                        ) : item.todo
                                    }
                                </div>
                                {
                                    item.isEdit ? (
                                        <>
                                            <Button
                                                data-testid="submit-button"
                                                onClick={async () => {
                                                    const response = await handleUpdateTodo(item, item.todo);
                                                    if (response.succ) {
                                                        setList(
                                                            list.map((row) => item.id === row.id ? {
                                                                ...row,
                                                                todo: row.todo,
                                                                origTodo: row.todo,
                                                                isEdit: false,
                                                            } : row)
                                                        );
                                                    }
                                                }}
                                            >
                                                제출
                                            </Button>
                                            <Button
                                                data-testid="cancel-button"
                                                onClick={() => {
                                                    setList(
                                                        list.map((row) => item.id === row.id ? {
                                                            ...row,
                                                            todo: row.origTodo,
                                                            isEdit: false,
                                                        } : row)
                                                    );
                                                }}
                                            >
                                                취소
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                data-testid="modify-button"
                                                onClick={() => {
                                                    setList(
                                                        handleChangeData(list, item, 'isEdit', true)
                                                    );
                                                }}
                                            >
                                                수정
                                            </Button>
                                            <Button
                                                data-testid="delete-button"
                                                onClick={async () => {
                                                    const response = await handleDeleteTodo(item.id);
                                                    if (response.succ) {
                                                        const newList = list.filter((row) => row.id !== item.id);
                                                        setList(newList);
                                                    }
                                                }}
                                            >
                                                삭제
                                            </Button>
                                        </>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            </div>
        </Wrapper>
    );
};

export default TodoComponent;