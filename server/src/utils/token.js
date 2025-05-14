export const generateToken = (id) => {
  const timestamp = Date.now();
  const combined = `${id}|${timestamp}`;
  const encoded = Buffer.from(combined).toString("base64");
  return encoded;
};
//解析token，返回{id:1,time:1677777777777}
export const parseToken = (token) => {
  const decoded = Buffer.from(token, "base64").toString("utf8");
  const [id, time] = decoded.split("|");
  return { id: parseInt(id), time: parseInt(time) };
};
