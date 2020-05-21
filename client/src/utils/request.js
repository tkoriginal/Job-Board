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

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
`;
const loadJobQuery = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

const loadCompanyQuery = gql`
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

const loadJobsQuery = gql`
  {
    jobs {
      title
      id
      description
      company {
        id
        name
      }
    }
  }
`;

const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: API_URL })]),
  cache: new InMemoryCache(),
});

// This is how we sent request prior to migrating to Apollo Client
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
  const {
    data: { jobs },
  } = await client.query({ query: loadJobsQuery, fetchPolicy: 'no-cache' });
  return jobs;
};

export const loadJob = async (id) => {
  const {
    data: { job },
  } = await client.query({ query: loadJobQuery, variables: { id } });
  return job;
};

export const loadCompany = async (id) => {
  const {
    data: { company },
  } = await client.query({ query: loadCompanyQuery, variables: { id } });
  return company;
};

export const createJob = async (input) => {
  const {
    data: { job },
  } = await client.mutate({
    mutation: createJobMutation,
    variables: input,
    update: (cache, mutationResult) => {
      const { data } = mutationResult;
      console.log(data);
      cache.writeQuery({
        query: loadJobQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return job;
};
