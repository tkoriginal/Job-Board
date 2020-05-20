import React, { useEffect, useState } from 'react';
import { loadCompany } from '../utils/request';
import { JobList } from './JobList';

export const CompanyDetail = (props) => {
  const [company, setCompany] = useState(null);
  const { companyId } = props.match.params;
  console.log(props.match.params);
  useEffect(() => {
    loadCompany(companyId).then((company) => setCompany(company));
  }, [companyId]);

  if (!company) return <h1>Loading Company...</h1>;

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h5 className="title is-5">Jobs At {company.name}</h5>
      <JobList jobs={company.jobs} />
    </div>
  );
};
