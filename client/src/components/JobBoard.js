import React, { useState, useEffect } from 'react';
import { JobList } from './JobList';
import { loadJobs } from '../utils/request';

export const JobBoard = (props) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs().then((data) => setJobs(data));
  }, []);

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
};
