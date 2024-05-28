import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient('https://rickandmortyapi.com/graphql');

export const fetchData = async (query: string) => {
    try {
        return await client.request(query);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error('Failed to fetch data');
    }
};