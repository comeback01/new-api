/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import {
  Button,
  Dropdown,
  InputNumber,
  Modal,
  Space,
  SplitButtonGroup,
  Tag,
  Tooltip,
} from '@douyinfe/semi-ui';
import {
  timestamp2string,
  renderGroup,
  renderQuota,
  getChannelIcon,
  renderQuotaWithAmount,
  showSuccess,
  showError,
} from '../../../helpers';
import { CHANNEL_OPTIONS } from '../../../constants';
import { IconTreeTriangleDown, IconMore } from '@douyinfe/semi-icons';
import { FaRandom } from 'react-icons/fa';

// Render functions
const renderType = (type, channelInfo = undefined, t) => {
  let type2label = new Map();
  for (let i = 0; i < CHANNEL_OPTIONS.length; i++) {
    type2label[CHANNEL_OPTIONS[i].value] = CHANNEL_OPTIONS[i];
  }
  type2label[0] = { value: 0, label: t('type.unknown'), color: 'grey' };

  let icon = getChannelIcon(type);

  if (channelInfo?.is_multi_key) {
    icon =
      channelInfo?.multi_key_mode === 'random' ? (
        <div className='flex items-center gap-1'>
          <FaRandom className='text-blue-500' />
          {icon}
        </div>
      ) : (
        <div className='flex items-center gap-1'>
          <IconTreeTriangleDown className='text-blue-500' />
          {icon}
        </div>
      );
  }

  return (
    <Tag color={type2label[type]?.color} shape='circle' prefixIcon={icon}>
      {type2label[type]?.label}
    </Tag>
  );
};

const renderTagType = (t) => {
  return (
    <Tag color='light-blue' shape='circle' type='light'>
      {t('type.tagAggregation')}
    </Tag>
  );
};

const renderStatus = (status, channelInfo = undefined, t) => {
  if (channelInfo) {
    if (channelInfo.is_multi_key) {
      let keySize = channelInfo.multi_key_size;
      let enabledKeySize = keySize;
      if (channelInfo.multi_key_status_list) {
        enabledKeySize =
          keySize - Object.keys(channelInfo.multi_key_status_list).length;
      }
      return renderMultiKeyStatus(status, keySize, enabledKeySize, t);
    }
  }
  switch (status) {
    case 1:
      return (
        <Tag color='green' shape='circle'>
          {t('status.enabled')}
        </Tag>
      );
    case 2:
      return (
        <Tag color='red' shape='circle'>
          {t('status.disabled')}
        </Tag>
      );
    case 3:
      return (
        <Tag color='yellow' shape='circle'>
          {t('status.autoDisabled')}
        </Tag>
      );
    default:
      return (
        <Tag color='grey' shape='circle'>
          {t('status.unknown')}
        </Tag>
      );
  }
};

const renderMultiKeyStatus = (status, keySize, enabledKeySize, t) => {
  switch (status) {
    case 1:
      return (
        <Tag color='green' shape='circle'>
          {t('status.enabled')} {enabledKeySize}/{keySize}
        </Tag>
      );
    case 2:
      return (
        <Tag color='red' shape='circle'>
          {t('status.disabled')} {enabledKeySize}/{keySize}
        </Tag>
      );
    case 3:
      return (
        <Tag color='yellow' shape='circle'>
          {t('status.autoDisabled')} {enabledKeySize}/{keySize}
        </Tag>
      );
    default:
      return (
        <Tag color='grey' shape='circle'>
          {t('status.unknown')} {enabledKeySize}/{keySize}
        </Tag>
      );
  }
};

const renderResponseTime = (responseTime, t) => {
  let time = responseTime / 1000;
  time = time.toFixed(2) + t('common.seconds');
  if (responseTime === 0) {
    return (
      <Tag color='grey' shape='circle'>
        {t('test.untested')}
      </Tag>
    );
  } else if (responseTime <= 1000) {
    return (
      <Tag color='green' shape='circle'>
        {time}
      </Tag>
    );
  } else if (responseTime <= 3000) {
    return (
      <Tag color='lime' shape='circle'>
        {time}
      </Tag>
    );
  } else if (responseTime <= 5000) {
    return (
      <Tag color='yellow' shape='circle'>
        {time}
      </Tag>
    );
  } else {
    return (
      <Tag color='red' shape='circle'>
        {time}
      </Tag>
    );
  }
};

export const getChannelsColumns = ({
  t,
  COLUMN_KEYS,
  updateChannelBalance,
  manageChannel,
  manageTag,
  submitTagEdit,
  testChannel,
  setCurrentTestChannel,
  setShowModelTestModal,
  setEditingChannel,
  setShowEdit,
  setShowEditTag,
  setEditingTag,
  copySelectedChannel,
  refresh,
  activePage,
  channels,
  setShowMultiKeyManageModal,
  setCurrentMultiKeyChannel,
}) => {
  return [
    {
      key: COLUMN_KEYS.ID,
      title: t('common.id'),
      dataIndex: 'id',
    },
    {
      key: COLUMN_KEYS.NAME,
      title: t('common.name'),
      dataIndex: 'name',
      render: (text, record, index) => {
        if (record.remark && record.remark.trim() !== '') {
          return (
            <Tooltip
              content={
                <div className='flex flex-col gap-2 max-w-xs'>
                  <div className='text-sm'>{record.remark}</div>
                  <Button
                    size='small'
                    type='primary'
                    theme='outline'
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard
                        .writeText(record.remark)
                        .then(() => {
                          showSuccess(t('common.copySuccess'));
                        })
                        .catch(() => {
                          showError(t('common.copyFail'));
                        });
                    }}
                  >
                    {t('common.copy')}
                  </Button>
                </div>
              }
              trigger='hover'
              position='topLeft'
            >
              <span>{text}</span>
            </Tooltip>
          );
        }
        return text;
      },
    },
    {
      key: COLUMN_KEYS.GROUP,
      title: t('common.group'),
      dataIndex: 'group',
      render: (text, record, index) => (
        <div>
          <Space spacing={2}>
            {text
              ?.split(',')
              .sort((a, b) => {
                if (a === 'default') return -1;
                if (b === 'default') return 1;
                return a.localeCompare(b);
              })
              .map((item, index) => renderGroup(item))}
          </Space>
        </div>
      ),
    },
    {
      key: COLUMN_KEYS.TYPE,
      title: t('common.type'),
      dataIndex: 'type',
      render: (text, record, index) => {
        if (record.children === undefined) {
          if (record.channel_info) {
            if (record.channel_info.is_multi_key) {
              return <>{renderType(text, record.channel_info, t)}</>;
            }
          }
          return <>{renderType(text, undefined, t)}</>;
        } else {
          return <>{renderTagType(t)}</>;
        }
      },
    },
    {
      key: COLUMN_KEYS.STATUS,
      title: t('common.status'),
      dataIndex: 'status',
      render: (text, record, index) => {
        if (text === 3) {
          if (record.other_info === '') {
            record.other_info = '{}';
          }
          let otherInfo = JSON.parse(record.other_info);
          let reason = otherInfo['status_reason'];
          let time = otherInfo['status_time'];
          return (
            <div>
              <Tooltip
                content={
                  t('common.reason') +
                  reason +
                  t('common.time') +
                  timestamp2string(time)
                }
              >
                {renderStatus(text, record.channel_info, t)}
              </Tooltip>
            </div>
          );
        } else {
          return renderStatus(text, record.channel_info, t);
        }
      },
    },
    {
      key: COLUMN_KEYS.RESPONSE_TIME,
      title: t('common.responseTime'),
      dataIndex: 'response_time',
      render: (text, record, index) => <div>{renderResponseTime(text, t)}</div>,
    },
    {
      key: COLUMN_KEYS.BALANCE,
      title: t('common.usedAndRemaining'),
      dataIndex: 'expired_time',
      render: (text, record, index) => {
        if (record.children === undefined) {
          return (
            <div>
              <Space spacing={1}>
                <Tooltip content={t('quota.used')}>
                  <Tag color='white' type='ghost' shape='circle'>
                    {renderQuota(record.used_quota)}
                  </Tag>
                </Tooltip>
                <Tooltip
                  content={
                    t('quota.remainingWithDollar') +
                    record.balance +
                    t('quota.clickToUpdate')
                  }
                >
                  <Tag
                    color='white'
                    type='ghost'
                    shape='circle'
                    onClick={() => updateChannelBalance(record)}
                  >
                    {renderQuotaWithAmount(record.balance)}
                  </Tag>
                </Tooltip>
              </Space>
            </div>
          );
        } else {
          return (
            <Tooltip content={t('quota.used')}>
              <Tag color='white' type='ghost' shape='circle'>
                {renderQuota(record.used_quota)}
              </Tag>
            </Tooltip>
          );
        }
      },
    },
    {
      key: COLUMN_KEYS.PRIORITY,
      title: t('common.priority'),
      dataIndex: 'priority',
      render: (text, record, index) => {
        if (record.children === undefined) {
          return (
            <div>
              <InputNumber
                style={{ width: 70 }}
                name='priority'
                onBlur={(e) => {
                  manageChannel(record.id, 'priority', record, e.target.value);
                }}
                keepFocus={true}
                innerButtons
                defaultValue={record.priority}
                min={-999}
                size='small'
              />
            </div>
          );
        } else {
          return (
            <InputNumber
              style={{ width: 70 }}
              name='priority'
              keepFocus={true}
              onBlur={(e) => {
                Modal.warning({
                  title: t('channel.changeSubChannelPriority'),
                  content: t('channel.confirmChangePriority', {
                    value: e.target.value,
                  }),
                  onOk: () => {
                    if (e.target.value === '') {
                      return;
                    }
                    submitTagEdit('priority', {
                      tag: record.key,
                      priority: e.target.value,
                    });
                  },
                });
              }}
              innerButtons
              defaultValue={record.priority}
              min={-999}
              size='small'
            />
          );
        }
      },
    },
    {
      key: COLUMN_KEYS.WEIGHT,
      title: t('common.weight'),
      dataIndex: 'weight',
      render: (text, record, index) => {
        if (record.children === undefined) {
          return (
            <div>
              <InputNumber
                style={{ width: 70 }}
                name='weight'
                onBlur={(e) => {
                  manageChannel(record.id, 'weight', record, e.target.value);
                }}
                keepFocus={true}
                innerButtons
                defaultValue={record.weight}
                min={0}
                size='small'
              />
            </div>
          );
        } else {
          return (
            <InputNumber
              style={{ width: 70 }}
              name='weight'
              keepFocus={true}
              onBlur={(e) => {
                Modal.warning({
                  title: t('channel.changeSubChannelWeight'),
                  content: t('channel.confirmChangeWeight', {
                    value: e.target.value,
                  }),
                  onOk: () => {
                    if (e.target.value === '') {
                      return;
                    }
                    submitTagEdit('weight', {
                      tag: record.key,
                      weight: e.target.value,
                    });
                  },
                });
              }}
              innerButtons
              defaultValue={record.weight}
              min={-999}
              size='small'
            />
          );
        }
      },
    },
    {
      key: COLUMN_KEYS.OPERATE,
      title: '',
      dataIndex: 'operate',
      fixed: 'right',
      render: (text, record, index) => {
        if (record.children === undefined) {
          const moreMenuItems = [
            {
              node: 'item',
              name: t('common.delete'),
              type: 'danger',
              onClick: () => {
                Modal.confirm({
                  title: t('common.confirmDelete'),
                  content: t('common.irreversible'),
                  onOk: () => {
                    (async () => {
                      await manageChannel(record.id, 'delete', record);
                      await refresh();
                      setTimeout(() => {
                        if (channels.length === 0 && activePage > 1) {
                          refresh(activePage - 1);
                        }
                      }, 100);
                    })();
                  },
                });
              },
            },
            {
              node: 'item',
              name: t('common.copy'),
              type: 'tertiary',
              onClick: () => {
                Modal.confirm({
                  title: t('common.confirmCopy'),
                  content: t('common.copyAllInfo'),
                  onOk: () => copySelectedChannel(record),
                });
              },
            },
          ];

          return (
            <Space wrap>
              <SplitButtonGroup
                className='overflow-hidden'
                aria-label={t('test.testChannelGroup')}
              >
                <Button
                  size='small'
                  type='tertiary'
                  onClick={() => testChannel(record, '')}
                >
                  {t('common.test')}
                </Button>
                <Button
                  size='small'
                  type='tertiary'
                  icon={<IconTreeTriangleDown />}
                  onClick={() => {
                    setCurrentTestChannel(record);
                    setShowModelTestModal(true);
                  }}
                />
              </SplitButtonGroup>

              {record.status === 1 ? (
                <Button
                  type='danger'
                  size='small'
                  onClick={() => manageChannel(record.id, 'disable', record)}
                >
                  {t('common.disable')}
                </Button>
              ) : (
                <Button
                  size='small'
                  onClick={() => manageChannel(record.id, 'enable', record)}
                >
                  {t('common.enable')}
                </Button>
              )}

              {record.channel_info?.is_multi_key ? (
                <SplitButtonGroup aria-label={t('channel.multiKeyChannelGroup')}>
                  <Button
                    type='tertiary'
                    size='small'
                    onClick={() => {
                      setEditingChannel(record);
                      setShowEdit(true);
                    }}
                  >
                    {t('common.edit')}
                  </Button>
                  <Dropdown
                    trigger='click'
                    position='bottomRight'
                    menu={[
                      {
                        node: 'item',
                        name: t('channel.manageMultiKey'),
                        onClick: () => {
                          setCurrentMultiKeyChannel(record);
                          setShowMultiKeyManageModal(true);
                        },
                      },
                    ]}
                  >
                    <Button
                      type='tertiary'
                      size='small'
                      icon={<IconTreeTriangleDown />}
                    />
                  </Dropdown>
                </SplitButtonGroup>
              ) : (
                <Button
                  type='tertiary'
                  size='small'
                  onClick={() => {
                    setEditingChannel(record);
                    setShowEdit(true);
                  }}
                >
                  {t('common.edit')}
                </Button>
              )}

              <Dropdown
                trigger='click'
                position='bottomRight'
                menu={moreMenuItems}
              >
                <Button icon={<IconMore />} type='tertiary' size='small' />
              </Dropdown>
            </Space>
          );
        } else {
          // 标签操作按钮
          return (
            <Space wrap>
              <Button
                type='tertiary'
                size='small'
                onClick={() => manageTag(record.key, 'enable')}
              >
                {t('common.enableAll')}
              </Button>
              <Button
                type='tertiary'
                size='small'
                onClick={() => manageTag(record.key, 'disable')}
              >
                {t('common.disableAll')}
              </Button>
              <Button
                type='tertiary'
                size='small'
                onClick={() => {
                  setShowEditTag(true);
                  setEditingTag(record.key);
                }}
              >
                {t('common.edit')}
              </Button>
            </Space>
          );
        }
      },
    },
  ];
};