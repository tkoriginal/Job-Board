import React, { useState } from 'react';
import { createJob } from '../utils/request';

export const JobForm = (props) => {
  const [jobInfo, setJobInfo] = useState({ title: '', description: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setJobInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClick = (event) => {
    event.preventDefault();
    const companyId = 'SJV0-wdOM';
    createJob({ ...jobInfo, companyId }).then((job) => {
      props.history.push(`/jobs/${job.id}`);
    });
  };
  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="title"
                value={jobInfo.title}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="input"
                style={{ height: '10em' }}
                name="description"
                value={jobInfo.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" onClick={handleClick}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
