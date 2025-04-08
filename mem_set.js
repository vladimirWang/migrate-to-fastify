import Memcached from "memcached";
var memcached = new Memcached("localhost:11211");

// memcached.connect(function (err) {
//   if (err) {
//     console.error("connect error: ", err);
//     process.exit(1);
//   } else {
//     console.log("connect success");
//   }
// });
// 设置一个键值对
memcached.set("key", "value123", 10, function (err) {
  if (err) {
    console.error("err: ", err);
  } else {
    console.log("success set");
    memcached.get("key", function (err, data) {
      if (err) {
        console.error("get err: ", err);
      } else {
        console.log("get key success: ", data);
      }
      memcached.end();
      process.exit(0);
    });
  }
});
