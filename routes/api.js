const Router = require("koa-router");
const router = new Router();
const path = require("path");
const bluebird = require("bluebird");
const cmd = require("node-cmd");
const fs = require("fs");
const ax = require("axios");

router.get("/search591/black-list", ctx => {
  try {
    const rs = fs.readFileSync("black-list.json", "utf8");
    return (ctx.body = JSON.parse(rs));
  } catch (err) {
    console.log("err", err);
    return (ctx.status = 500);
  }
});

router.post("/search591/black-list/add", ctx => {
  const { id } = ctx.request.body;
  const rs = fs.readFileSync("black-list.json", "utf8");
  const newBlackListObj = JSON.parse(rs)[id]
    ? JSON.parse(rs)
    : {
        ...JSON.parse(rs),
        [id]: true
      };

  fs.writeFile("black-list.json", JSON.stringify(newBlackListObj), function(
    err
  ) {
    if (err) console.log(err);
    else console.log("Write operation complete.");
  });
  // always success?
  return (ctx.status = 200);
});

const generateQuery = ({ startRow, priceLow, priceHigh }) => {
  const query = !startRow
    ? `
	curl -X GET \
  'https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=2&searchtype=1&region=1&section=5,3,7,4,11&rentprice=${priceLow},${priceHigh}&area=8,12&role=1&not_cover=1' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,hr;q=0.6,th;q=0.5' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: webp=1; PHPSESSID=3m71l3tsdgq7tq56pq4be1oj31; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; new_rent_list_kind_test=1; T591_TOKEN=3m71l3tsdgq7tq56pq4be1oj31; c10f3143a018a0513ebe1e8d27b5391c=1; _ga=GA1.3.1026116144.1567168982; _gid=GA1.3.1425447486.1567168982; _ga=GA1.4.1026116144.1567168982; _gid=GA1.4.1425447486.1567168982; XSRF-TOKEN=eyJpdiI6ImZhNml2Q05oK3VUc3dkRnkrdUdEaHc9PSIsInZhbHVlIjoiOVEzMldcL3dWZGNJVTdQa3hvemhFMEp6Y0M0NThFUG5hc1hqc3ZtbnNReHpXNHFaT0IrMlRPbzZFS2JOUVhxN084dTlkQTVzejFoSFdRTCtYSTNHczNRPT0iLCJtYWMiOiI5YmI2NDVjODZhMWM0ZDBiZjQ5ODUwMjYwMzY4YmJiNzY5YjAzZmI5YjgyNDRhM2MwYWU3YTNlODQyYzAyNjQ0In0%3D; 591_new_session=eyJpdiI6InZ3eEVuK3g5K09PWlRiT2pEWnJJWVE9PSIsInZhbHVlIjoiWmNXK3BmeWFHVmd4azZERk9wNTJmRFhITzEyclZNYzFSVEpucDNDSE9RdVBUYTBFa0xoNUdoME1sa3R4WW13dlBuc3YwMDRGQmlSTm9mUnlQUm0zNmc9PSIsIm1hYyI6ImIyYzI4Y2Q0MzE0NGYxNGZhYmNmMDkyYzlkYWY0NGE0YjJjZjQyODgzZjVlMGIyYTg5YmYyNzIwZmQzYmQxZTYifQ%3D%3D; _gat_UA-97423186-1=1, webp=1; PHPSESSID=3m71l3tsdgq7tq56pq4be1oj31; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; new_rent_list_kind_test=1; T591_TOKEN=3m71l3tsdgq7tq56pq4be1oj31; c10f3143a018a0513ebe1e8d27b5391c=1; _ga=GA1.3.1026116144.1567168982; _gid=GA1.3.1425447486.1567168982; _ga=GA1.4.1026116144.1567168982; _gid=GA1.4.1425447486.1567168982; XSRF-TOKEN=eyJpdiI6ImZhNml2Q05oK3VUc3dkRnkrdUdEaHc9PSIsInZhbHVlIjoiOVEzMldcL3dWZGNJVTdQa3hvemhFMEp6Y0M0NThFUG5hc1hqc3ZtbnNReHpXNHFaT0IrMlRPbzZFS2JOUVhxN084dTlkQTVzejFoSFdRTCtYSTNHczNRPT0iLCJtYWMiOiI5YmI2NDVjODZhMWM0ZDBiZjQ5ODUwMjYwMzY4YmJiNzY5YjAzZmI5YjgyNDRhM2MwYWU3YTNlODQyYzAyNjQ0In0%3D; 591_new_session=eyJpdiI6InZ3eEVuK3g5K09PWlRiT2pEWnJJWVE9PSIsInZhbHVlIjoiWmNXK3BmeWFHVmd4azZERk9wNTJmRFhITzEyclZNYzFSVEpucDNDSE9RdVBUYTBFa0xoNUdoME1sa3R4WW13dlBuc3YwMDRGQmlSTm9mUnlQUm0zNmc9PSIsIm1hYyI6ImIyYzI4Y2Q0MzE0NGYxNGZhYmNmMDkyYzlkYWY0NGE0YjJjZjQyODgzZjVlMGIyYTg5YmYyNzIwZmQzYmQxZTYifQ%3D%3D; _gat_UA-97423186-1=1; PHPSESSID=hsdm44ppoq6bde4ij4kgu19mh1; 591_new_session=eyJpdiI6InJ5RjBxclpyVFJKZVJ3XC9UTURCUCt3PT0iLCJ2YWx1ZSI6IjBhakhwV1hpOGJ0RzU0NW1BcUFEZU1xbkI1eFJtN0hQdmNzalhrbGs3UXRaaVp5REpoUWxqYXVRMUlsR0VFUVNKTnhGaVBlSUZTRVlXdVVSR2xDSWdRPT0iLCJtYWMiOiIwNzViMGRmMjg1MjQ3MWZkZWNlY2ExNWE1ZmNhYzUyMTZjMGI0MmJkMzViYTlkOTY1NWM0OGE5N2QzYmJjYTIzIn0%3D' \
  -H 'Host: rent.591.com.tw' \
  -H 'Postman-Token: 183597b3-942f-48b3-a8e9-b722a49f89c4,e62dd560-c3dd-423c-ba9a-5841415889f0' \
  -H 'Referer: https://rent.591.com.tw/?kind=2&region=1&section=5,3,7,4,11&rentprice=${priceLow},${priceHigh}&area=8,10&role=1&not_cover=1' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' \
  -H 'X-CSRF-TOKEN: fqSvifF7tLPj04NSKt1Z8MxsIFrFnObVU8nCIGWH' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache'
	`
    : `
	curl -X GET \
  'https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=2&searchtype=1&region=1&section=5,3,7,4,11&rentprice=${priceLow},${priceHigh}&area=8,12&role=1&not_cover=1&firstRow=${startRow}' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,hr;q=0.6,th;q=0.5' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: webp=1; PHPSESSID=3m71l3tsdgq7tq56pq4be1oj31; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; new_rent_list_kind_test=1; T591_TOKEN=3m71l3tsdgq7tq56pq4be1oj31; c10f3143a018a0513ebe1e8d27b5391c=1; _ga=GA1.3.1026116144.1567168982; _gid=GA1.3.1425447486.1567168982; _ga=GA1.4.1026116144.1567168982; _gid=GA1.4.1425447486.1567168982; XSRF-TOKEN=eyJpdiI6ImZhNml2Q05oK3VUc3dkRnkrdUdEaHc9PSIsInZhbHVlIjoiOVEzMldcL3dWZGNJVTdQa3hvemhFMEp6Y0M0NThFUG5hc1hqc3ZtbnNReHpXNHFaT0IrMlRPbzZFS2JOUVhxN084dTlkQTVzejFoSFdRTCtYSTNHczNRPT0iLCJtYWMiOiI5YmI2NDVjODZhMWM0ZDBiZjQ5ODUwMjYwMzY4YmJiNzY5YjAzZmI5YjgyNDRhM2MwYWU3YTNlODQyYzAyNjQ0In0%3D; 591_new_session=eyJpdiI6InZ3eEVuK3g5K09PWlRiT2pEWnJJWVE9PSIsInZhbHVlIjoiWmNXK3BmeWFHVmd4azZERk9wNTJmRFhITzEyclZNYzFSVEpucDNDSE9RdVBUYTBFa0xoNUdoME1sa3R4WW13dlBuc3YwMDRGQmlSTm9mUnlQUm0zNmc9PSIsIm1hYyI6ImIyYzI4Y2Q0MzE0NGYxNGZhYmNmMDkyYzlkYWY0NGE0YjJjZjQyODgzZjVlMGIyYTg5YmYyNzIwZmQzYmQxZTYifQ%3D%3D; _gat_UA-97423186-1=1, webp=1; PHPSESSID=3m71l3tsdgq7tq56pq4be1oj31; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; new_rent_list_kind_test=1; T591_TOKEN=3m71l3tsdgq7tq56pq4be1oj31; c10f3143a018a0513ebe1e8d27b5391c=1; _ga=GA1.3.1026116144.1567168982; _gid=GA1.3.1425447486.1567168982; _ga=GA1.4.1026116144.1567168982; _gid=GA1.4.1425447486.1567168982; XSRF-TOKEN=eyJpdiI6ImZhNml2Q05oK3VUc3dkRnkrdUdEaHc9PSIsInZhbHVlIjoiOVEzMldcL3dWZGNJVTdQa3hvemhFMEp6Y0M0NThFUG5hc1hqc3ZtbnNReHpXNHFaT0IrMlRPbzZFS2JOUVhxN084dTlkQTVzejFoSFdRTCtYSTNHczNRPT0iLCJtYWMiOiI5YmI2NDVjODZhMWM0ZDBiZjQ5ODUwMjYwMzY4YmJiNzY5YjAzZmI5YjgyNDRhM2MwYWU3YTNlODQyYzAyNjQ0In0%3D; 591_new_session=eyJpdiI6InZ3eEVuK3g5K09PWlRiT2pEWnJJWVE9PSIsInZhbHVlIjoiWmNXK3BmeWFHVmd4azZERk9wNTJmRFhITzEyclZNYzFSVEpucDNDSE9RdVBUYTBFa0xoNUdoME1sa3R4WW13dlBuc3YwMDRGQmlSTm9mUnlQUm0zNmc9PSIsIm1hYyI6ImIyYzI4Y2Q0MzE0NGYxNGZhYmNmMDkyYzlkYWY0NGE0YjJjZjQyODgzZjVlMGIyYTg5YmYyNzIwZmQzYmQxZTYifQ%3D%3D; _gat_UA-97423186-1=1; PHPSESSID=hsdm44ppoq6bde4ij4kgu19mh1; 591_new_session=eyJpdiI6InJ5RjBxclpyVFJKZVJ3XC9UTURCUCt3PT0iLCJ2YWx1ZSI6IjBhakhwV1hpOGJ0RzU0NW1BcUFEZU1xbkI1eFJtN0hQdmNzalhrbGs3UXRaaVp5REpoUWxqYXVRMUlsR0VFUVNKTnhGaVBlSUZTRVlXdVVSR2xDSWdRPT0iLCJtYWMiOiIwNzViMGRmMjg1MjQ3MWZkZWNlY2ExNWE1ZmNhYzUyMTZjMGI0MmJkMzViYTlkOTY1NWM0OGE5N2QzYmJjYTIzIn0%3D' \
  -H 'Host: rent.591.com.tw' \
  -H 'Postman-Token: 183597b3-942f-48b3-a8e9-b722a49f89c4,e62dd560-c3dd-423c-ba9a-5841415889f0' \
  -H 'Referer: https://rent.591.com.tw/?kind=2&region=1&section=5,3,7,4,11&rentprice=${priceLow},${priceHigh}&area=8,10&role=1&not_cover=1' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' \
  -H 'X-CSRF-TOKEN: fqSvifF7tLPj04NSKt1Z8MxsIFrFnObVU8nCIGWH' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache'
	`;
  return query;
};

router.get("/search591", async ctx => {
  try {
    const priceLow = ctx.query.priceLow;
    const priceHigh = ctx.query.priceHigh;
    const getTotalQuery = startRow => {
      const query = generateQuery({
        startRow,
        priceLow,
        priceHigh
      });
      return query;
    };

    const getAsync = bluebird.promisify(cmd.get, {
      multiArgs: true,
      context: cmd
    });

    const getHouseData = async () => {
      let total = 0,
        houseData = [];

      await getAsync(getTotalQuery())
        .then(data => {
          const parsedData = JSON.parse(data[0]);
          total = +parseInt(parsedData.records);
        })
        .catch(err => {
          console.log("cmd error", err);
        });

      const requestChain = [];
      for (let i = 0; i < total; i += 30) {
        const command = getTotalQuery(i);
        requestChain.push(
          getAsync(command)
            .then(data => {
              const parsedData = JSON.parse(data[0]).data.data;
              houseData = [...houseData, ...parsedData];
            })
            .catch(err => {
              console.log("cmd error", err);
            })
        );
      }

      await Promise.all(requestChain);

      return houseData;
    };

    const combinedHouseData = await getHouseData();
    ctx.body = combinedHouseData;
  } catch (error) {
    console.log("error:", error);
    ctx.status = 401;
    ctx.body = JSON.stringify({ error: error.code });
  }
});

// router.get("/search104", async ctx => {
//   try {
//     // area either "tpe" or "tch" 台北/台中
//     const tpeAreaGroup = "2C6001001000";
//     const tchAreaGroup = "6001008000";
//     const { area } = ctx.query;
//     const encodedArea = area === "tpe" ? tpeAreaGroup : tchAreaGroup;
//     const combineJobRequest = (maxPageSize, area) => {
//       const combineArr = [];
//       const getUrl = pageNum =>
//         `https://www.104.com.tw/jobs/search/list?ro=0&jobcat=2001001003%2C2004001005%2C2004001007%2C2004001006%2C2005003005&area=${area}&order=2&asc=0&page=${pageNum}&mode=s&jobsource=n104bank1`;
//       for (let i = 1; i <= maxPageSize; i++) {
//         combineArr.push(ax.get(getUrl(i)));
//       }
//       return ax.all(combineArr);
//     };

//     const combinedJobData = await combineJobRequest(50, encodedArea);

//     // re-structure job data
//     const returnData = combinedJobData.reduce(
//       (combinedArr, pageData) => [...combinedArr, ...pageData.data.data.list],
//       []
//     );

//     ctx.body = returnData;
//   } catch (err) {
//     console.log("err:", err);
//   }
// });

module.exports = router;
