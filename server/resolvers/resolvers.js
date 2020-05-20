const db = require('../db');

const Query = {
  company: (root, { id }) => db.companies.get(id),
  job: (root, { id }) => db.jobs.get(id),
  jobs: () => db.jobs.list(),
};

const Mutation = {
  createJob: (root, { input }, { user }) => {
    if (!user) {
      throw new Error('Unauthorized');
    }
    const jobId = db.jobs.create({ ...input, companyId: user.companyId });
    return db.jobs.get(jobId);
  },
};

const Job = {
  company: (job, args) => db.companies.get(job.companyId),
};

const Company = {
  jobs: (company, arg) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};

module.exports = { Query, Mutation, Job, Company };
