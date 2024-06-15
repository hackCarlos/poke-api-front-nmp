import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { FormProps } from 'antd';
import { Form, Input, DatePicker, Select, Button, message, Flex, Checkbox } from 'antd';
import { REACT_APP_BACKEND_SERVER, REACT_APP_POKE_API_URL } from '../config/config';
import { MINIMUN_AGE_REGISTER, ROUTES } from '../config/constants';
import { NOT_ENOUGH_POKEMON_SELECTED_ERROR, YOUNGER_TO_REGISTER_ERROR } from '../config/messages';
import { LoginResponse } from '../interfaces/LoginResponse';
import { UserProfile } from '../interfaces/UserProfile';
import { Pokemon } from '../interfaces/Pokemon';

const { Option } = Select;

const Register: React.FC = () => {
  const [location, setLocation] = useState('');
  const [pokemonsForm, setPokemonsForm] = useState<Pokemon[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const win: Window = window;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
    });

    axios.get(`${REACT_APP_POKE_API_URL}?limit=12`)
      .then(response => {
        setPokemonsForm(response.data.results);
      })
      .catch(error => 
        message.error(
          error.request.response 
          ? JSON.parse(error.request.response).message 
          : error.message
        )
      );
  }, []);

  const onFinish: FormProps<UserProfile>['onFinish'] = async(data) => {
    try{
        if( pokemons.length <2){
          message.error(NOT_ENOUGH_POKEMON_SELECTED_ERROR)
          return
        }
        const [lattitude, longitude] = location.split(',')
        let  response = await axios.post<LoginResponse>(`${REACT_APP_BACKEND_SERVER}/users`, {
          email: data.email,
          name: data.name,
          password: data.password,
          pokemons,
          geolocation: {
            lattitude: Number.parseFloat(lattitude),
            longitude: Number.parseFloat(longitude),
          },
          isAdmin
        })
                
        localStorage.setItem('access_token', response.data.access_token);
        win.location = ROUTES.LOGIN;
    } catch(error: any) {
        console.error(error)
        message.error(
          error.request.response 
          ? JSON.parse(error.request.response).message 
          : error.message
        )
    };
};

const onFinishFailed: FormProps<UserProfile>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};


  const calculateAge = (birthdate: any) => 
    new Date().getFullYear() - new Date(birthdate).getFullYear()

  const handleChange = (values: Pokemon[]) => {
    if (pokemons.length > values.length ){
        setPokemons( [...values] )
    }else{
      const pokemon = values.pop() 
      if(pokemon){
        setPokemons( [...pokemons, pokemon] )
      }
    }
  };

  return (
    <Flex gap="middle" justify={'center'} align={'center'} vertical>
      <Form style={{padding: '100px 0px'}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item<UserProfile>
          name="name"
          label="Nombre"
          rules={[{ required: true, message: 'Ingresa tu nombre' }]}
        >
          <Input 
            size='large' 
            placeholder="Nombre" 
          />
        </Form.Item>
        <Form.Item<UserProfile>
          name="email"
          label="Correo"
          rules={[{ required: true, message: 'Ingresa tu correo' }]}
        >
          <Input 
            size='large' 
            placeholder="Correo" 
          />
        </Form.Item>
        <Form.Item<UserProfile>
          name="password"
          label="Contraseña"
          rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
        >
          <Input 
            size='large' 
            placeholder="Contraseña" 
          />
        </Form.Item>
        <Form.Item<UserProfile>
          name="birthdate"
          label="Fecha de nacimiento"
          rules={[
            { required: true, message: 'Ingresa tu fecha' },
            {
              validator: (_, value) =>
                value && calculateAge(value.$d) >=  MINIMUN_AGE_REGISTER
                ? Promise.resolve()
                : Promise.reject(new Error(YOUNGER_TO_REGISTER_ERROR)),
            },
          ]}
        >
          <DatePicker 
            size='large' 
            placeholder="Dia/Mes/Año" 
            format="DD/MM/YYYY"
          />
        </Form.Item>
        <Form.Item<UserProfile>
          label="Locación"
        >
          <Input 
            size='large' 
            value={location} 
            readOnly
          />
        </Form.Item>

        <Form.Item<UserProfile> label="Pokémon" >
          <Select 
            mode="multiple"  
            maxCount={6}
            onChange={handleChange}>
              {pokemonsForm.map(pokemon => (
                <Option key={pokemon.name} value={pokemon.name} >{pokemon.name} </Option>
              ))}
          </Select>  
        </Form.Item>
        <Form.Item<UserProfile>
          name="isAdmin"
          label="Administrador"
        >
          <Checkbox onChange={e=> setIsAdmin(e.target.checked)}/>
        </Form.Item>
        <Flex  justify={'center'} vertical={false}  >
                <Form.Item>
                    <Button                    
                        size='large' 
                        type="primary"
                        htmlType="submit">Registrarte</Button>
                </Form.Item>
            </Flex>
      </Form>
    </Flex>
  );
};

export default Register;