import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Select, Button, message, Flex } from 'antd';
import Weathers from '../components/WeatherCard';
import PokemonList from '../components/PokemonList';
import type { FormProps } from 'antd';
import { UserProfile } from '../interfaces/UserProfile';
import { Pokemon } from '../interfaces/Pokemon';
import { ProfileForm } from '../interfaces/ProfileForm';
import { REACT_APP_BACKEND_SERVER, REACT_APP_POKE_API_URL } from '../config/config';
import { USER_INFO_NOT_GOTTEN } from '../config/messages';

const { Option } = Select;

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userName, setUserName] = useState<string>();
  const [pokemons, setPokemons] = useState<string[]>([]);
  const [pokemonsForm, setPokemonsForm] = useState<Pokemon[]>([]);
  const [geolocation, setGeolocation] = useState<any>();
  const win: Window = window;
  const access_token = localStorage.getItem('access_token')
  const idUser = localStorage.getItem('idUser')

  useEffect(() => {
    axios.get<UserProfile>(
      `${REACT_APP_BACKEND_SERVER}/users/${idUser}`,
      { headers: { Authorization: `Bearer ${access_token}`}}
    )
    .then(response => {
      setUser(response.data);
      const { lattitude, longitude } = response.data.geolocation
      setGeolocation(`${lattitude}, ${longitude}`)
      localStorage.setItem('location', `${lattitude},${longitude}`) 

      setPokemons(response.data.pokemons);
    })
    .catch(error => {
      console.error(error.stack)
      message.error(USER_INFO_NOT_GOTTEN)
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
  }, [access_token, idUser]);

  const onFinish: FormProps<ProfileForm>['onFinish'] = async() => {
    try{
      const data: any = {pokemons}
      if(userName){
        data.name = userName
      }
    
      await axios.patch<UserProfile>(
        `${REACT_APP_BACKEND_SERVER}/users/${idUser}`, 
        data, { headers: { Authorization: `Bearer ${access_token}`}}
      )
    
      win.location.reload();
    } catch(error: any) {
      message.error(
        error.request.response 
        ? JSON.parse(error.request.response).message 
        : error.message
      );
    };
  };

  const onFinishFailed: FormProps<ProfileForm>['onFinishFailed'] = (errorInfo) => {
      console.log('Failed:', errorInfo);
  };

  if (!user) return <div>Cargando...</div>;

  const handleChange = (value: string[]) => {
    if (pokemons.length > value.length ){
        setPokemons( [...value] )
    }else{
      const pokemon = value.pop() 
      if(pokemon){
        setPokemons( [...pokemons, pokemon] )
      }
    }
  };
  return (
    <Flex gap="middle" justify={'center'} align={'center'} vertical>
      <Form 
        style={{padding: '100px 0px 0px 0px'}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item<UserProfile> 
          label="nombre" 
          name={"name"}
        >
          <Input defaultValue={user.name} onChange={(e => setUserName(e.target.value))}/>
        </Form.Item>
        <Form.Item<UserProfile> label="Pokémon" >
          <Select 
            mode="multiple"  
            maxCount={6}
            defaultValue={user.pokemons} 
            onChange={handleChange}>
              {pokemonsForm.map(pokemon => (
                <Option key={pokemon.name} value={pokemon.name} >{pokemon.name} </Option>
              ))}
          </Select>  
        </Form.Item>
        <Flex  justify={'center'} vertical={false}  >
                <Form.Item>
                    <Button                    
                        size='large' 
                        type="primary"
                        htmlType="submit">Actualizar datos</Button>
                </Form.Item>
            </Flex>
        </Form>

        <Weathers location={geolocation}></Weathers>
        <PokemonList pokemons={user.pokemons}></PokemonList>
    </Flex>
  );
};

export default Profile;