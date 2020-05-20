import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  gql,
} from 'apollo-boost';
import { isLoggedIn, getAccessToken } from './auth';

const API_URL = 'http://localhost:9000/graphql';

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        authorization: 'Bearer ' + getAccessToken(),
      },
    });
  }
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: API_URL })]),
  cache: new InMemoryCache(),
});

// This is how we sent request prior to migratinng to Apollo Client
// const gqlRequest = async (query, variables = {}) => {
//   const request = {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json',
//     },
//     body: JSON.stringify({ query, variables }),
//   };
//   const response = await fetch(API_URL, request);
//   const responseBody = await response.json();
//   if (responseBody.errors) {
//     const message = responseBody.errors
//       .map((error) => error.message)
//       .join('\n');
//     throw new Error(message);
//   }
//   return responseBody.data;
// };

export const loadJobs = async () => {
  const query = gql`
    {
      jobs {
        title
        id
        company {
          id
          name
        }
      }
    }
  `;
  const {
    data: { jobs },
  } = await client.query({ query });
  return jobs;
};

export const loadJob = async (id) => {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;
  const {
    data: { job },
  } = await client.query({ query, variables: { id } });
  return job;
};

export const loadCompany = async (id) => {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        name
        description
        jobs {
          title
          id
        }
      }
    }
  `;
  const {
    data: { company },
  } = await client.query({ query, variables: { id } });
  return company;
};

export const createJob = async (input) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        description
        title
        id
      }
    }
  `;
  const {
    data: { job },
  } = await client.mutate({ mutation, variables: input });
  return job;
};
