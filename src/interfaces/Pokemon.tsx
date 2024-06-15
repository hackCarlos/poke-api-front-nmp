export interface Pokemon {
    name: string;
    url: string;
    sprites:{
        front_default: string
    }
    abilities: []
  }
  
export interface PokemonListProps {
  pokemons: string[];
}