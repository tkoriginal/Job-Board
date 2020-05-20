import { isLoggedIn, getAccessToken } from './auth';

const API_URL = 'http://localhost:9000/graphql';

const gqlRequest = async (query, variables = {}) => {
  const request = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  };
  if (isLoggedIn()) {
    request.headers['authorization'] = 'Bearer ' + getAccessToken();
  }
  const response = await fetch(API_URL, request);
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors
      .map((error) => error.message)
      .join('\n');
    throw new Error(message);
  }
  return responseBody.data;
};

export const loadJobs = async () => {
  const query = `
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
  const { jobs } = await gqlRequest(query);
  return jobs;
};

export const loadJob = async (id) => {
  const query = `query JobQuery($id: ID!) {
    job(id: $id){
      id
      title
      description
      company {
        id
        name
      }
    }
  }`;
  const variables = { id };
  const { job } = await gqlRequest(query, variables);
  return job;
};

export const loadCompany = async (id) => {
  const query = `query CompanyQuery($id: ID!) {
    company(id: $id){
      name
      description
      jobs {
        title
        id
      }
    }
  }`;
  const variables = { id };
  const { company } = await gqlRequest(query, variables);
  return company;
};

export const createJob = async (input) => {
  const mutation = `mutation CreateJob($input: CreateJobInput){
    job: createJob(input: $input){
      description
      title
      id
    }
  }`;
  const { job } = await gqlRequest(mutation, { input });
  return job;
};
