const output: Record<string, Function> = {};
module.exports = output;

output.success = function (data: any) {
  const res = {
    success: true,
    data: data,
    status: 200,
  };
  return res;
};

output.error = function (error: string, status: Number) {
  const res = {
    success: false,
    error: error,
    status: status,
  };
  return res;
};

output.redirect = function (url: string) {
  const res = {
    success: true,
    redirect: url,
    status: 302,
  };
  return res;
};

output.parse = function (ret: any) {
  if (ret.redirect !== undefined) {
    return Response.redirect(ret.redirect, ret.status);
  }

  if (ret.success) {
    return Response.json(
      {
        success: true,
        data: ret.data,
      },
      {
        status: ret.status,
      }
    );
  } else {
    return Response.json(
      {
        success: false,
        error: ret.error,
      },
      {
        status: ret.status,
      }
    );
  }
};
