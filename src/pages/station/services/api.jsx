import { get,post,put,del } from '../../../utils/http';

// 获取字典
export const getDict = async () => {

  const res = await get('/microservice-station/api/dict/types');
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取字典成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}

// 获取法人主体列表
export const getLegalEntities = async () => {

  const res = await get('/merchant/api/dictionary/model/legal_entity_type');
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取法人主体成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}

// 获取组织树数据
export const getOrgTree = async (id) => {
  console.log('id');

  const res = await del(`/microservice-station/api/stations/${id}`);
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取组织架构成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
};

// 获取油站列表
export const getStationList = async (params) => {
  const res = await get('/microservice-station/api/stations',params);
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取油站列表成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
};

// 新增油站
export const addStation = async (params) => {
    console.log('params',params);
    
  const res = await post('/microservice-station/api/stations',params);
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '新增油站成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
};

// 更新油站
export const updateStation = async (id,params) => {
  const res = await put(`/microservice-station/api/stations/${id}`,params);
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '更新油站成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
};

// 删除油站
// 获取组织树数据
export const delStation = async (id) => {
  console.log('id');

  const res = await del(`/microservice-station/api/stations/${id}`,{
    
      reason: '删除'
    
  });
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取组织架构成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
};

// 获取油罐列表
export const getOilTankList = async (params) => {
  const res = await get('/microservice-station/api/tanks',params);
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取油罐列表成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}

// 添加油罐
export const addOilTank = async (params) => {
  params.oilTypeCode = "GA92"
  var data = {
    tankName: params.tankName,
    oilTypeCode: params.oilTypeCode,
    oilTankCapacity: params.oilTankCapacity,
    oilTankStatus: params.oilTankStatus,
    stationId: params.stationId,
    oilType: params.oilType,
    maxCapacity: params.maxCapacity,
    designCapacity: params.designCapacity,
    defaultDensity: params.defaultDensity,
    levelMeterInterface: params.levelMeterInterface,
    levelMeterBrand: params.levelMeterBrand,
    status: params.status
  }
  const res = await post('/microservice-station/api/tanks',data);
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '添加油罐成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}

// 更新油罐
export const updateOilTank = async (params) => {
    params.oilTypeCode = "GA92"
  var data = {
    tankName: params.tankName,
    oilTypeCode: params.oilTypeCode,
    oilTankCapacity: params.oilTankCapacity,
    oilTankStatus: params.oilTankStatus,
    stationId: params.stationId,
    oilType: params.oilType,
    maxCapacity: params.maxCapacity,
    designCapacity: params.designCapacity,
    defaultDensity: params.defaultDensity,
    levelMeterInterface: params.levelMeterInterface,
    levelMeterBrand: params.levelMeterBrand,
    status: params.status
  }
  const res = await put(`/microservice-station/api/tanks/${params.id}`,data);
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '更新油罐成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}

// 删除油罐
export const delOilTank = async (params) => {
  const res = await del(`/microservice-station/api/tanks/${params.id}`,params);
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '删除油罐成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  } 

}


// 获取油枪列表
export const getOilGunList = async (params) => {
  const res = await get('/microservice-station/api/guns',params);
  console.log(res);

  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取油枪列表成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}