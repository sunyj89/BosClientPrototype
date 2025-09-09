import { get,post,put,del } from '../../../utils/http';

// 获取油站分类列表
export const getOilCategoryList = async () => {
  const res = await get('/oil/api/oil-categories/list');
  console.log(res);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取油站分类列表成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}

// 获取油品列表
export const getOilList = async (params) => {
    console.log(params)
  const res = await get('/oil/api/oil',params);
  console.log(res);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取油品列表成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}

// 查询油品标准
export const getOilStandardList = async () => {
  const res = await get('/oil/api/oil-standard/list');
  console.log(res);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取油品标准列表成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}

// 查询字典
export const getDictList = async (params) => {
  const res = await get('/merchant/api/dictionary/model/'+params);
  console.log(res);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '获取字典列表成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}

// 新增油品
export const addOil = async (params) => {
    console.log('params',params);
  const res = await post('/oil/api/oil',params);
  console.log(res);
  if (res.code === 0) {
    return {
      success: true,
      data: res.data,
      message: '新增油品成功'
    };
  }else{
    return {
      success: false,
      data: null,
      message: res.msg
    };
  }
}


