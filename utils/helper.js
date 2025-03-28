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
