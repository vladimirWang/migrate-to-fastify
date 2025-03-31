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
