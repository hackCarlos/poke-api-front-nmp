
export interface Weather {
    city: {
        name: string
    },
    list: {
        main: {
            temp_min: number;
            temp_max: number;
            humidity: number;
        }
        weather: {
        description: string;
    }[];
    }[];
}


export interface WeatherProps {
    location: string;
} 