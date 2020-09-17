import React from 'react';
import { Route, Switch, RouteChildrenProps } from 'react-router-dom';
import { nomatch } from '@choerodon/boot';
import { setGetOptionalCharts, defaultCharts } from './create-report/components/add-chart';

const ReportList = React.lazy(() => import('./report-list'));
const CreateReport = React.lazy(() => import('./create-report'));

const ProjectReport: React.FC<RouteChildrenProps> = ({ match }) => (
  <Switch>
    <Route exact path={match?.url} component={ReportList} />
    <Route exact path={`${match?.url}/create`} component={CreateReport} />
    <Route exact path={`${match?.url}/edit/:id`} component={CreateReport} />
    <Route path="*" component={nomatch} />
  </Switch>
);
export { setGetOptionalCharts, defaultCharts };
export default ProjectReport;
