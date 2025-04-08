import Memcached from "memcached";
var memcached = new Memcached("localhost:11211");

// 获取键的值
memcached.get("key", function (err, data) {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
  // 关闭连接
  memcached.end();
  process.exit(0);
});
