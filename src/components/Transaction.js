import React, { useEffect, useState } from 'react';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

const Transaction = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchGraphQLData = async () => {
      try {
        // Create an Apollo Client instance pointing to your GraphQL endpoint
        const client = new ApolloClient({
          uri: 'https://query.flowgraph.co/',
          cache: new InMemoryCache(),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'no-cache', // Set fetchPolicy to 'no-cache'
            },
          },
        });

        // Define the GraphQL query
        const query = gql`
          query TransactionEventsSectionQuery($id: ID!, $first: Int) {
            checkTransaction(id: $id) {
              transaction {
                eventCount
                events(first: $first) {
                  edges {
                    node {
                      index
                      type {
                        id
                      }
                      fields
                    }
                  }
                }
              }
            }
          }
        `;

        // Execute the GraphQL query using Apollo Client
        const response = await client.query({
          query,
          variables: {
            id: '',
            first: 20,
          },
        });

        // Extract the data from the GraphQL response
        const data = response.data.checkTransaction.transaction;
        setData(data);
      } catch (error) {
        console.error('Error fetching GraphQL data:', error);
      }
    };

    fetchGraphQLData();
  }, []);

  return (
    <div>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Transaction;
