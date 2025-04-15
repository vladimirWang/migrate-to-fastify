import _ from "lodash";

export function trueType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

export const getSuccessResp = (data, msg = "操作成功") => {
  return {
    code: 200,
    msg,
    data,
  };
};

export const getErrorResp = (msg = "操作失败", code = 500) => {
  return {
    code,
    msg,
  };
};

export const responseError = (res, error) => {
  res.code(500).send(getErrorResp(error.message));
};

export const getValidNumber = (numberStr) => {
  const num = Number(numberStr);
  return isNaN(num) ? undefined : num;
};

export const getBaseUrl = (req) => {
  return `${req.protocol}://${req.host}`;
};

export const isEqual = (value1, value2) => {
  return Math.abs(value1 - value2) < Number.EPSILON;
};

export const generateGroupsByVendorId = (data) => {
  const obj = data.reduce((a, c) => {
    const vendorId = c.product?.vendor?.id;
    if (vendorId === undefined || vendorId === null) return a;
    if (a[vendorId]) {
      a[vendorId] = {
        ...a[vendorId],
        children: a[vendorId].children.concat(c),
      };
    } else {
      a[vendorId] = {
        vendor: c.product.vendor,
        children: [c],
      };
    }
    return a;
  }, {});

  const result = Object.keys(obj).reduce((a, c) => {
    const { vendor, children } = obj[c];
    a.push({
      children,
      vendor,
    });
    return a;
  }, []);
  return result;
};

// 商品增加，修改，删除时，对应修改总金额
export const getNewTotalValue = (values) => {
  const { cost, count, increment, operation } = values;

  return new Promise((resolve, reject) => {
    let newTotalValue;
    if (operation === "delete") {
      newTotalValue = cost * count;
    } else if (operation === "create") {
      newTotalValue = cost * count;
    } else if (operation === "update") {
      if (increment === undefined) {
        reject(new Error("参数错误: operation为update时，必传incrementOne"));
        return;
      }
      newTotalValue = cost * increment;
    }

    resolve(newTotalValue);
  });
};

// 比较两个对象键值对，返回obj1的键值对
export const diffObject = (obj1, obj2) => {
  if (trueType(obj1) !== "Object" || trueType(obj2) !== "Object") {
    throw new Error("diffObject方法的两个参数都应为对象");
  }
  return _.pickBy(obj1, (value, key) => !_.isEqual(value, obj2[key]));
};

// 实现两数相加
export const sum = (value1, value2) => {
  // 获取第一个输入框的值，并转换为数字类型
  const num1 = parseFloat(value1);
  // 获取第二个输入框的值，并转换为数字类型
  const num2 = parseFloat(value2);

  // 检查输入是否为有效的数字
  if (!isNaN(num1) && !isNaN(num2)) {
    // 计算两个数的小数位数
    const decimalPlaces1 = (num1.toString().split(".")[1] || "").length;
    const decimalPlaces2 = (num2.toString().split(".")[1] || "").length;

    // 取最大的小数位数
    const maxDecimalPlaces = Math.max(decimalPlaces1, decimalPlaces2);
    // 将小数转换为整数进行计算
    const multiplier = Math.pow(10, maxDecimalPlaces);

    const sum = (num1 * multiplier + num2 * multiplier) / multiplier;
    // 使用 toFixed() 方法控制结果的小数位数
    const formattedSum = sum.toFixed(maxDecimalPlaces);

    // 将结果显示在页面上
    return parseFloat(formattedSum);
  } else {
    // 如果输入无效，显示错误信息
    throw new Error("输入的数据不是有效数字");
  }
};

// 对采购车按供应商分组
export function groupsByVendorId(data) {
  const obj = data.reduce((a, c) => {
    const vendorId = c.vendor.id;

    if (a[vendorId]) {
      a[vendorId] = {
        ...a[vendorId],
        children: a[vendorId].children.concat(c),
      };
    } else {
      a[vendorId] = {
        vendor: c.vendor,
        children: [c],
      };
    }
    return a;
  }, {});
  const result = Object.keys(obj).reduce((a, c) => {
    const { vendor, children } = obj[c];
    a.push({
      children,
      vendor,
    });

    return a;
  }, []);

  return result;
}
