import axios from 'axios';
import { Form, Input, Button, message, Flex } from 'antd';
import type { FormProps } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { REACT_APP_BACKEND_SERVER } from '../config/config';
import { ROUTES } from '../config/constants';
import { LoginForm } from '../interfaces/LoginForm';
import { LoginResponse } from '../interfaces/LoginResponse';

const Login: React.FC = () => {
    const win: Window = window;

    const onFinish: FormProps<LoginForm>['onFinish'] = async(data) => {
        try{
            let  response = await axios.post<LoginResponse>(`${REACT_APP_BACKEND_SERVER}/auth/login`, data)
                    
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('idUser', response.data.idUser);

            win.location = ROUTES.PROFILE;
        } catch(error: any) {
            console.error(error)
            message.error(
                error.request.response 
                ? JSON.parse(error.request.response).message 
                : error.message
            )
        };
    };

    const onFinishFailed: FormProps<LoginForm>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Flex gap="middle" justify={'center'} align={'center'} vertical>
            <Form  name="basic"
            style={{padding: '100px 0px'}}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            >
                <Form.Item<LoginForm>
                    name="email"
                    rules={[{ required: true, message: 'Ingresa tu correo' }]}
                >
                    <Input 
                        size='large' 
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Correo" 
                    />
                </Form.Item>
                <Form.Item<LoginForm>
                    name="password"
                    rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
                >
                    <Input  
                        size='large' 
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Contraseña" />
                </Form.Item>
                <Flex  justify={'center'} vertical={false}  >
                    <Form.Item>
                        <Button                    
                            size='large' 
                            type="primary"
                            htmlType="submit">Iniciar sesión</Button>
                    </Form.Item>
                </Flex>
                <Flex  justify={'center'} vertical={false}  >
                    <Button size= "large" type='default' onClick={() => win.location = ROUTES.REGISTER}>Registrar</Button>
                </Flex>
            </Form>
        </Flex>
)};

export default Login;