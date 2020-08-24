import React, { Component } from 'react';
import { stores } from '@choerodon/boot';
import { Spin, Tooltip } from 'choerodon-ui';
import { withRouter } from 'react-router-dom';
import { sprintApi } from '@/api';
import LINK_URL from '@/constants/LINK_URL';
import to from '@/utils/to';
import EmptyBlockDashboard from '../../../../components/EmptyBlockDashboard';
import pic from '../EmptyPics/no_sprint.svg';
import UserHead from '../../../../components/UserHead';
import './Sprint.less';

const { AppState } = stores;
class Sprint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      sprintId: undefined,
      sprintInfo: {},
    };
  }

  componentDidMount() {
    const { sprintId } = this.props;
    this.setState({
      sprintId,
    });
    this.loadSprintInfo(sprintId);
  }

  loadSprintInfo(sprintId) {
    if (!sprintId) {
      this.setState({
        loading: false,
        sprintInfo: {},
      });
    } else {
      this.setState({ loading: true });
      sprintApi.getSprintCombineOrgId(sprintId).then((res) => {
        this.setState({
          sprintInfo: res,
          loading: false,
        });
      });
    }
  }

  renderContent() {
    const { loading, sprintInfo, sprintId } = this.state;
    if (loading) {
      return (
        <div className="c7n-loadWrap">
          <Spin />
        </div>
      );
    }
    if (!sprintId) {
      return (
        <div className="c7n-loadWrap">
          <EmptyBlockDashboard
            pic={pic}
            des="当前项目下无活跃或结束冲刺"
          />
        </div>
      );
    }
    return (
      <div>
        {this.renderUserHead()}
        <div className="count">
          {`${sprintInfo.issueCount || '0'}个问题可见`}
        </div>
        <div className="goal text-overflow-hidden">
          {`冲刺目标：${sprintInfo.sprintGoal || ''}`}
        </div>
        <div className="time">
          {`${sprintInfo.startDate} ~ ${sprintInfo.endDate}`}
        </div>
      </div>
    );
  }

  renderUserHead() {
    const { sprintInfo: { assigneeIssueVOList } } = this.state;
    return (
      <div className="users">
        {
          assigneeIssueVOList.length ? assigneeIssueVOList.slice(0, 10).map((user) => (
            <div key={user.assigneeName}>
              {
                  user.assigneeId === 0 && assigneeIssueVOList.length === 1
                    ? (<div style={{ height: 18 }} />)
                    : (
                      <Tooltip
                        placement="bottom"
                        title={(
                          <div>
                            <p style={{ margin: 0 }}>{user.assigneeName}</p>
                            <p style={{ margin: 0 }}>
                              {'故事点: '}
                              {user.totalStoryPoints || 0}
                            </p>
                            <p style={{ margin: 0 }}>
                              {'剩余预估时间: '}
                              {user.totalRemainingTime ? user.totalRemainingTime : '无'}
                            </p>
                            <p style={{ margin: 0 }}>
                              {'问题: '}
                              {user.issueCount}
                            </p>
                          </div>
                      )}
                      >
                        <div>
                          <UserHead
                            tooltip={false}
                            user={{
                              id: user.assigneeId,
                              name: user.assigneeName,
                              loginName: user.assigneeName,
                              realName: user.assigneeName,
                              avatar: user.imageUrl,
                            }}
                            hiddenText
                          />
                        </div>
                      </Tooltip>
                    )
                }
            </div>
          ))
            : <div style={{ height: 18, width: '100%' }} />
        }
        {assigneeIssueVOList.length > 10 && <a role="none" onClick={() => to(LINK_URL.workListBacklog)}>查看更多...</a>}
      </div>
    );
  }

  render() {
    return (
      <div className="c7n-sprintDashboard-sprint">
        {this.renderContent()}
      </div>
    );
  }
}

export default Sprint;
