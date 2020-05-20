import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadJob } from '../utils/request';

export const JobDetail = (props) => {
  const [job, setJob] = useState(null);
  const { jobId } = props.match.params;
  useEffect(() => {
    loadJob(jobId).then((job) => setJob(job));
  }, [jobId]);

  if (!job) return <p>Loading Job...</p>;
  return (
    <div>
      <h1 className="title">{job.title}</h1>
      <h2 className="subtitle">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">{job.description}</div>
    </div>
  );
};
