import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Form, Row, Col, Input, Select, Button, Space, Table, Modal, Tag, Descriptions, message, DatePicker, Upload, Popconfirm, Alert, Progress } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, FileOutlined, HistoryOutlined, AlertOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import archiveData from '../../../mock/security/archiveData.json';
import stationData from '../../../mock/station/stationData.json';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ArchiveManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('archives');
  const [form] = Form.useForm();
  const [archiveForm] = Form.useForm();
  
  // 数据状态
  const [archiveList, setArchiveList] = useState([]);
  const [changeRecords, setChangeRecords] = useState([]);
  
  // 弹窗状态
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalType, setModalType] = useState('add'); // add, edit, view

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setArchiveList(archiveData.archives);
      setChangeRecords(archiveData.changeRecords);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (values) => {
    console.log('搜索条件:', values);
    message.success('搜索功能已触发');
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    message.info('搜索条件已重置');
  };

  // 新增档案
  const handleAddArchive = () => {
    setModalType('add');
    archiveForm.resetFields();
    setArchiveModalVisible(true);
  };

  // 编辑档案
  const handleEditArchive = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    archiveForm.setFieldsValue({
      ...record,
      expiryDate: record.expiryDate ? moment(record.expiryDate) : null,
      issueDate: record.issueDate ? moment(record.issueDate) : null
    });
    setArchiveModalVisible(true);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  // 查看修改记录
  const handleViewChanges = () => {
    setChangeModalVisible(true);
  };

  // 删除记录
  const handleDelete = (record) => {
    message.success(`删除档案"${record.documentName}"成功`);
  };

  // 下载文件
  const handleDownload = (record) => {
    message.success(`正在下载文件：${record.documentName}`);
  };

  // 保存档案
  const handleSaveArchive = async (values) => {
    try {
      console.log('保存档案:', values);
      message.success(modalType === 'add' ? '档案创建成功' : '档案更新成功');
      setArchiveModalVisible(false);
      loadData();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 获取状态颜色和文本
  const getStatusInfo = (record) => {
    const { daysToExpiry, status } = record;
    if (status === '已过期') {
      return { color: 'error', text: '已过期', desc: `已过期 ${Math.abs(daysToExpiry)} 天` };
    } else if (status === '即将到期') {
      return { color: 'warning', text: '即将到期', desc: `${daysToExpiry} 天后到期` };
    } else {
      return { color: 'success', text: '有效', desc: `${daysToExpiry} 天后到期` };
    }
  };

  // 档案表格列
  const archiveColumns = [
    {
      title: '档案名称',
      dataIndex: 'documentName',
      key: 'documentName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '组织信息',
      key: 'orgInfo',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.orgName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.orgType}</div>
        </div>
      )
    },
    {
      title: '证件类型',
      dataIndex: 'documentType',
      key: 'documentType',
      width: 120,
      render: (text) => {
        const colorMap = {
          '营业执照': 'blue',
          '职业健康文件': 'green',
          '事故评估报告': 'red'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '证件编号',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
      width: 180,
      render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
    },
    {
      title: '颁发机构',
      dataIndex: 'issuingAuthority',
      key: 'issuingAuthority',
      width: 180
    },
    {
      title: '有效期',
      key: 'validity',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.issueDate} ~ {record.expiryDate}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const statusInfo = getStatusInfo(record);
        return (
          <div>
            <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
              {statusInfo.desc}
            </div>
          </div>
        );
      }
    },
    {
      title: '提醒设置',
      key: 'alertSettings',
      width: 120,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          <div>提前 {record.alertDays} 天</div>
          <div style={{ color: '#666' }}>
            邮件 + 短信
          </div>
        </div>
      )
    },
    {
      title: '上传人',
      dataIndex: 'uploadPerson',
      key: 'uploadPerson',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditArchive(record)}>
            编辑
          </Button>
          <Button type="primary" size="small" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>
            下载
          </Button>
          <Popconfirm title="确定要删除这个档案吗？" onConfirm={() => handleDelete(record)}>
            <Button type="primary" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 修改记录表格列
  const changeColumns = [
    {
      title: '变更时间',
      dataIndex: 'changeTime',
      key: 'changeTime',
      width: 150,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (text) => {
        const colorMap = {
          '新增': 'success',
          '修改': 'warning',
          '删除': 'error'
        };
        const iconMap = {
          '新增': <PlusOutlined />,
          '修改': <EditOutlined />,
          '删除': <DeleteOutlined />
        };
        return <Tag color={colorMap[text]} icon={iconMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '变更对象',
      dataIndex: 'changeObject',
      key: 'changeObject',
      width: 120
    },
    {
      title: '变更描述',
      dataIndex: 'changeDescription',
      key: 'changeDescription',
      width: 250
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      render: (text) => {
        const colorMap = {
          '已审批': 'success',
          '审批中': 'processing',
          '已拒绝': 'error'
        };
        return <Tag color={colorMap[text]}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      )
    }
  ];

  // 上传属性
  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'Bearer token',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  // 获取到期提醒统计
  const getExpiryStats = () => {
    const expired = archiveList.filter(item => item.status === '已过期').length;
    const expiringSoon = archiveList.filter(item => item.status === '即将到期').length;
    const valid = archiveList.filter(item => item.status === '有效').length;
    
    return { expired, expiringSoon, valid, total: archiveList.length };
  };

  const expiryStats = getExpiryStats();

  const tabItems = [
    {
      key: 'archives',
      label: (
        <span>
          <FileOutlined />
          档案维护
        </span>
      ),
      children: (
        <div>
          {/* 到期提醒统计 */}
          <Alert
            message="档案状态统计"
            description={`总档案数：${expiryStats.total} | 有效：${expiryStats.valid} | 即将到期：${expiryStats.expiringSoon} | 已过期：${expiryStats.expired}`}
            type={expiryStats.expired > 0 ? 'error' : expiryStats.expiringSoon > 0 ? 'warning' : 'success'}
            showIcon
            style={{ marginBottom: 16 }}
          />

          {/* 筛选区域 */}
          <Card style={{ marginBottom: 16 }}>
            <Form form={form} layout="inline" onFinish={handleSearch}>
              <Row gutter={16} style={{ width: '100%', marginBottom: 16 }}>
                <Col span={5}>
                  <Form.Item name="orgName" label="组织名称">
                    <Select placeholder="请选择组织" allowClear>
                      <Option value="all">全部组织</Option>
                      {stationData.branches.map(branch => (
                        <Option key={branch.id} value={branch.id}>{branch.name}</Option>
                      ))}
                      {stationData.stations.map(station => (
                        <Option key={station.id} value={station.id}>{station.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="documentType" label="档案类型">
                    <Select placeholder="请选择类型" allowClear>
                      <Option value="营业执照">营业执照</Option>
                      <Option value="职业健康文件">职业健康文件</Option>
                      <Option value="事故评估报告">事故评估报告</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="status" label="档案状态">
                    <Select placeholder="请选择状态" allowClear>
                      <Option value="有效">有效</Option>
                      <Option value="即将到期">即将到期</Option>
                      <Option value="已过期">已过期</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name="dateRange" label="到期时间">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddArchive}>
                      新增档案
                    </Button>
                    <Button icon={<HistoryOutlined />} onClick={handleViewChanges}>
                      修改记录
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* 档案列表 */}
          <Card>
            <Table
              columns={archiveColumns}
              dataSource={archiveList}
              rowKey="id"
              scroll={{ x: 1500 }}
              pagination={{
                total: archiveList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: 'changes',
      label: (
        <span>
          <HistoryOutlined />
          修改记录
        </span>
      ),
      children: (
        <div>
          <Card>
            <Table
              columns={changeColumns}
              dataSource={changeRecords}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                total: changeRecords.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="archive-management-container">
      <Card>
        <Spin spinning={loading}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: '16px' }}
            items={tabItems}
          />
        </Spin>
      </Card>

      {/* 档案表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增档案' : '编辑档案'}
        open={archiveModalVisible}
        onCancel={() => setArchiveModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setArchiveModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => archiveForm.submit()}>
            保存
          </Button>
        ]}
      >
        <Form
          form={archiveForm}
          layout="vertical"
          onFinish={handleSaveArchive}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="orgType" label="组织类型" rules={[{ required: true, message: '请选择组织类型' }]}>
                <Select placeholder="请选择组织类型">
                  <Option value="分公司">分公司</Option>
                  <Option value="服务区">服务区</Option>
                  <Option value="油站">油站</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="orgId" label="所属组织" rules={[{ required: true, message: '请选择组织' }]}>
                <Select placeholder="请选择组织">
                  {stationData.branches.map(branch => (
                    <Option key={branch.id} value={branch.id}>{branch.name}</Option>
                  ))}
                  {stationData.stations.map(station => (
                    <Option key={station.id} value={station.id}>{station.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="documentType" label="档案类型" rules={[{ required: true, message: '请选择档案类型' }]}>
                <Select placeholder="请选择档案类型">
                  <Option value="营业执照">营业执照</Option>
                  <Option value="职业健康文件">职业健康文件</Option>
                  <Option value="事故评估报告">事故评估报告</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="documentName" label="档案名称" rules={[{ required: true, message: '请输入档案名称' }]}>
                <Input placeholder="请输入档案名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="documentNumber" label="证件编号" rules={[{ required: true, message: '请输入证件编号' }]}>
                <Input placeholder="请输入证件编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="issuingAuthority" label="颁发机构" rules={[{ required: true, message: '请输入颁发机构' }]}>
                <Input placeholder="请输入颁发机构" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="issueDate" label="颁发日期" rules={[{ required: true, message: '请选择颁发日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expiryDate" label="到期日期" rules={[{ required: true, message: '请选择到期日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="alertDays" label="提前提醒天数" rules={[{ required: true, message: '请输入提醒天数' }]}>
                <Input type="number" placeholder="请输入提醒天数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="alertEmail" label="提醒邮箱" rules={[{ required: true, type: 'email', message: '请输入正确的邮箱地址' }]}>
                <Input placeholder="请输入提醒邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="alertPhone" label="提醒手机号" rules={[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]}>
                <Input placeholder="请输入提醒手机号" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="file" label="上传文件">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>点击上传档案文件</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看详情弹窗 */}
      <Modal
        title="档案详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        {currentRecord && (
          <div>
            <Descriptions title="基本信息" column={2} bordered>
              <Descriptions.Item label="档案名称">{currentRecord.documentName}</Descriptions.Item>
              <Descriptions.Item label="组织信息">{currentRecord.orgName} ({currentRecord.orgType})</Descriptions.Item>
              <Descriptions.Item label="档案类型">
                <Tag color={currentRecord.documentType === '营业执照' ? 'blue' : currentRecord.documentType === '职业健康文件' ? 'green' : 'red'}>
                  {currentRecord.documentType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="证件编号">{currentRecord.documentNumber}</Descriptions.Item>
              <Descriptions.Item label="颁发机构">{currentRecord.issuingAuthority}</Descriptions.Item>
              <Descriptions.Item label="颁发日期">{currentRecord.issueDate}</Descriptions.Item>
              <Descriptions.Item label="到期日期">{currentRecord.expiryDate}</Descriptions.Item>
              <Descriptions.Item label="档案状态">
                {(() => {
                  const statusInfo = getStatusInfo(currentRecord);
                  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
                })()}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="提醒设置" column={2} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="提前提醒天数">{currentRecord.alertDays} 天</Descriptions.Item>
              <Descriptions.Item label="提醒邮箱">{currentRecord.alertEmail}</Descriptions.Item>
              <Descriptions.Item label="提醒手机号">{currentRecord.alertPhone}</Descriptions.Item>
              <Descriptions.Item label="文件信息">
                <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(currentRecord)}>
                  {currentRecord.documentName}.pdf ({currentRecord.fileSize})
                </Button>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="操作信息" column={2} bordered style={{ marginTop: 16 }}>
              <Descriptions.Item label="上传人">{currentRecord.uploadPerson}</Descriptions.Item>
              <Descriptions.Item label="上传时间">{currentRecord.uploadTime}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{currentRecord.remark}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 修改记录弹窗 */}
      <Modal
        title={<><HistoryOutlined /> 修改记录</>}
        open={changeModalVisible}
        onCancel={() => setChangeModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setChangeModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
      >
        <Table
          columns={changeColumns}
          dataSource={changeRecords}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Modal>

      {/* 备注信息 */}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: '#f6f8fa', 
        borderRadius: 4, 
        border: '1px solid #e1e8ed',
        fontSize: 12,
        color: '#666'
      }}>
        <strong>功能演示说明：</strong>
        <br />
        1. 档案维护：列表方式管理不同层级机构的营业执照、职业健康文件和事故评估报告
        <br />
        2. 有效期管理：维护证照的有效期，并设置过期前多少天提示
        <br />
        3. 提醒设置：支持邮件和短信提醒方式，可填写对应的手机号和邮箱
        <br />
        4. 文件管理：支持档案文件的上传和下载功能
        <br />
        5. 状态监控：自动计算到期状态，分为有效、即将到期、已过期三种状态
        <br />
        6. 修改记录：完整记录所有档案的变更历史，包括新增、修改、删除操作
        <br />
        * 所有功能均支持筛选查询和权限控制，确保档案管理的安全性和规范性
      </div>
    </div>
  );
};

export default ArchiveManagement; 