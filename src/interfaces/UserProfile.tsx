export interface UserProfile {
    name: string;
    email: string;
    birthdate: string;
    location: string;
    geolocation: {lattitude: number, longitude: number};
    password: string;
    pokemons: string[];
    isAdmin: boolean;
}

