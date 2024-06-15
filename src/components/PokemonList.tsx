
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Card, Flex } from 'antd';
import { REACT_APP_POKE_API_URL } from '../config/config';
import { Pokemon, PokemonListProps } from '../interfaces/Pokemon';

const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  const [pokemonDetails, setPokemonDetails] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const details = await Promise.all(
        pokemons.map(pokemon => axios.get(`${REACT_APP_POKE_API_URL}/${pokemon}`))
      );
      setPokemonDetails(details.map(response => response.data));
    };

    fetchPokemonDetails();
  }, [pokemons]);

  return (
    <div>
      <Flex gap="middle" vertical={false} wrap>
        {pokemonDetails.map(pokemon => (
          <Card key={pokemon.name} title={pokemon.name} >
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p>Habilidades: {pokemon.abilities.map((ability: any) => ability.ability.name).join(', ')}</p>
          </Card>
        ))}
      </Flex>
    </div>
  );
};

export default PokemonList;