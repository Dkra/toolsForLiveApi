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

router.post("/search591/black-list/add", async ctx => {
  const { id } = ctx.request.body;
  const rs = fs.readFileSync("black-list.json", "utf8");
  const newBlackListObj = {
    ...JSON.parse(rs),
    [id]: true
  };

  const result = await fs.writeFile(
    "black-list.json",
    JSON.stringify(newBlackListObj),
    err => {
      if (err) console.log(err);
      else {
        ctx.status = 200;
      }
    }
  );

  ctx.status = 200;
});

// Add Multiple
router.post("/search591/black-list/deleteAllNotProtected", async ctx => {
  const { ids } = ctx.request.body;
  const fileStr = fs.readFileSync("black-list.json", "utf8");
  const newBlackListObj = JSON.parse(fileStr);
  ids.forEach(id => {
    newBlackListObj[id] = true;
  });

  const result = await fs.writeFile(
    "black-list.json",
    JSON.stringify(newBlackListObj),
    err => {
      if (err) console.log(err);
      else {
        ctx.status = 200;
      }
    }
  );

  ctx.status = 200;
});

router.get("/search591/protect-list", ctx => {
  try {
    const fileStr = fs.readFileSync("protect-list.json", "utf8");
    return (ctx.body = JSON.parse(fileStr));
  } catch (err) {
    console.log("err", err);
    return (ctx.status = 500);
  }
});

// Add
router.post("/search591/protect-list/", ctx => {
  const { id } = ctx.request.body;
  const fileStr = fs.readFileSync("protect-list.json", "utf8");
  const newProtectListObj = JSON.parse(fileStr)[id]
    ? JSON.parse(fileStr)
    : {
        ...JSON.parse(fileStr),
        [id]: true
      };

  fs.writeFile("protect-list.json", JSON.stringify(newProtectListObj), function(
    err
  ) {
    if (err) console.log(err);
    else console.log("Write operation complete.");
  });

  return (ctx.status = 200);
});

// Delete
router.post("/search591/protect-list/delete", ctx => {
  const { id } = ctx.request.body;
  const fileStr = fs.readFileSync("protect-list.json", "utf8");
  const newProtectListObj = JSON.parse(fileStr);
  delete newProtectListObj[id];
  fs.writeFile("protect-list.json", JSON.stringify(newProtectListObj), function(
    err
  ) {
    if (err) console.log(err);
    else console.log("Write operation complete.");
  });

  return (ctx.status = 200);
});

const generateQuery = ({ firstRow, priceLow, priceHigh }) => {
  // const query = !firstRow
  const query = false
    ? `
		curl -X GET \
  'https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=2&searchtype=1&region=1&section=5,3,7,4&rentprice=${priceLow},${priceHigh}&area=8,12&not_cover=1&role=1' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,hr;q=0.6,th;q=0.5' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: webp=1; PHPSESSID=2gih5b73srm7ad3ae0stf3lco1; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; T591_TOKEN=2gih5b73srm7ad3ae0stf3lco1; _ga=GA1.3.302521306.1566998252; _ga=GA1.4.302521306.1566998252; user_index_role=1; __auc=d1d47e5816cd860b0a33664fa16; imgClick=8101942; localTime=2; new_rent_list_kind_test=0; c10f3143a018a0513ebe1e8d27b5391c=1; _gid=GA1.3.1180729329.1567233668; _gid=GA1.4.1180729329.1567233668; user_browse_recent=a%3A5%3A%7Bi%3A0%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%227931455%22%3B%7Di%3A1%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228151111%22%3B%7Di%3A2%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228100710%22%3B%7Di%3A3%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228021886%22%3B%7Di%3A4%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228028150%22%3B%7D%7D; ba_cid=a%3A5%3A%7Bs%3A6%3A%22ba_cid%22%3Bs%3A32%3A%2205218b9356ee12f8efb7da02ead5c23a%22%3Bs%3A7%3A%22page_ex%22%3Bs%3A48%3A%22https%3A%2F%2Frent.591.com.tw%2Frent-detail-8100710.html%22%3Bs%3A4%3A%22page%22%3Bs%3A48%3A%22https%3A%2F%2Frent.591.com.tw%2Frent-detail-7931455.html%22%3Bs%3A7%3A%22time_ex%22%3Bi%3A1567234432%3Bs%3A4%3A%22time%22%3Bi%3A1567268840%3B%7D; _gat_UA-97423186-1=1; XSRF-TOKEN=eyJpdiI6Ik1oOE9McFl5N1FINnpXeGpiQ25Benc9PSIsInZhbHVlIjoidjc0RVFjY2tmUk1NK09IRmlReU4xV2plaDNzZHdOXC9HYkdQNmtYNHdsMGFmSVg5V2F3NWFQcUV0andtUUF2SVRmSDlydURVODhsOG1VMytZczFMOGFRPT0iLCJtYWMiOiJmNmQwNjZlNTYwMGY0OWFiMDIzOTNmNGQyNWQ3YmQ4YzNlZmY3ZWZlYzM1MTNkYThmMWNhMDNlZWI1YmIzN2I0In0%3D; _gat=1; _dc_gtm_UA-97423186-1=1; 591_new_session=eyJpdiI6IjNMYkFFQ2FCV0Z1NmhwOFc2K1dLd2c9PSIsInZhbHVlIjoiR204cEhWMFwvRzNqK01rVVRXSFA2d0IrdjZnTkxLeUtZc3dwY1JqSFhjc3UrQ2VYelJpa2NUbDRRYzNqME5OZk5lb0dVQ0VPZGhNXC9adjBBV2Yrc0hCZz09IiwibWFjIjoiZmRjZTlhMGM2MTM2NjdlZDNlMzdkMWY1N2M1NmQwN2M0OGMyNWIwMTgyMzYwNDE1MGIwZjJjNDkyNjQzZmI2MyJ9, webp=1; PHPSESSID=2gih5b73srm7ad3ae0stf3lco1; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; T591_TOKEN=2gih5b73srm7ad3ae0stf3lco1; _ga=GA1.3.302521306.1566998252; _ga=GA1.4.302521306.1566998252; user_index_role=1; __auc=d1d47e5816cd860b0a33664fa16; imgClick=8101942; localTime=2; new_rent_list_kind_test=0; c10f3143a018a0513ebe1e8d27b5391c=1; _gid=GA1.3.1180729329.1567233668; _gid=GA1.4.1180729329.1567233668; user_browse_recent=a%3A5%3A%7Bi%3A0%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%227931455%22%3B%7Di%3A1%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228151111%22%3B%7Di%3A2%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228100710%22%3B%7Di%3A3%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228021886%22%3B%7Di%3A4%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228028150%22%3B%7D%7D; ba_cid=a%3A5%3A%7Bs%3A6%3A%22ba_cid%22%3Bs%3A32%3A%2205218b9356ee12f8efb7da02ead5c23a%22%3Bs%3A7%3A%22page_ex%22%3Bs%3A48%3A%22https%3A%2F%2Frent.591.com.tw%2Frent-detail-8100710.html%22%3Bs%3A4%3A%22page%22%3Bs%3A48%3A%22https%3A%2F%2Frent.591.com.tw%2Frent-detail-7931455.html%22%3Bs%3A7%3A%22time_ex%22%3Bi%3A1567234432%3Bs%3A4%3A%22time%22%3Bi%3A1567268840%3B%7D; _gat_UA-97423186-1=1; XSRF-TOKEN=eyJpdiI6Ik1oOE9McFl5N1FINnpXeGpiQ25Benc9PSIsInZhbHVlIjoidjc0RVFjY2tmUk1NK09IRmlReU4xV2plaDNzZHdOXC9HYkdQNmtYNHdsMGFmSVg5V2F3NWFQcUV0andtUUF2SVRmSDlydURVODhsOG1VMytZczFMOGFRPT0iLCJtYWMiOiJmNmQwNjZlNTYwMGY0OWFiMDIzOTNmNGQyNWQ3YmQ4YzNlZmY3ZWZlYzM1MTNkYThmMWNhMDNlZWI1YmIzN2I0In0%3D; _gat=1; _dc_gtm_UA-97423186-1=1; 591_new_session=eyJpdiI6IjNMYkFFQ2FCV0Z1NmhwOFc2K1dLd2c9PSIsInZhbHVlIjoiR204cEhWMFwvRzNqK01rVVRXSFA2d0IrdjZnTkxLeUtZc3dwY1JqSFhjc3UrQ2VYelJpa2NUbDRRYzNqME5OZk5lb0dVQ0VPZGhNXC9adjBBV2Yrc0hCZz09IiwibWFjIjoiZmRjZTlhMGM2MTM2NjdlZDNlMzdkMWY1N2M1NmQwN2M0OGMyNWIwMTgyMzYwNDE1MGIwZjJjNDkyNjQzZmI2MyJ9; PHPSESSID=hsdm44ppoq6bde4ij4kgu19mh1; webp=1; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; new_rent_list_kind_test=0; XSRF-TOKEN=eyJpdiI6IjNIc0d5SHNzeUFvYXlsaFArWTRNRGc9PSIsInZhbHVlIjoibHhzVVBnY0JreHhicmVhQllMbENmVzRIWG1qUU1cL3Rod1JRN1JMMnFIY0FTRVByS3pXSk5LTE5Ta2FYZFFQNElSZnQrM2VtOHU0N0RhM0NHclwvNHE2dz09IiwibWFjIjoiZWFlYzNiZGY4ZGJiNjc1ZmE4ZmI0ZmZiNDc2NjhlN2VhOGE0ZmJkMGEzNTRmMzZmNjE0NTZhNGZkY2RlZGVmNiJ9; 591_new_session=eyJpdiI6IktValZDeUhSWm4wRDVBODBFMFB5ZWc9PSIsInZhbHVlIjoid3BHY240emt5VXZpcHA3N3htMHp6Q2luMzQ2VGF5WGxCbHpXbWFHdHRJV0hoeXBWZGtLdmp1SWVxOWVsRWJUT05CYjlaVEhqdkNrSUt6ZkVMNHJNN0E9PSIsIm1hYyI6Ijk1NjRkMDM0M2VjNzNiMjFjZjJlMjk4OGNhMzFhYzczZjYzYjM3M2FiNWE0YjZlOGJhOTBhOGM0OGMxNTZlNGEifQ%3D%3D' \
  -H 'Host: rent.591.com.tw' \
  -H 'Postman-Token: 5c4dfa85-d813-4b4c-be3f-cbbc585742af,322dbb33-cf4c-4429-ba37-16d8556840e2' \
  -H 'Referer: https://rent.591.com.tw/?kind=2&region=1&section=5,3,7,4&rentprice=${priceLow},${priceHigh}&area=8,12&not_cover=1&role=1' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' \
  -H 'X-CSRF-TOKEN: jAtrA6t9MrORlRPc2BcyaGLq3FiekgN05rRAD48K' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache'
	`
    : `
		curl -X GET \
  'https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=2&searchtype=1&region=1&section=5,3,7,4&rentprice=${priceLow},${priceHigh}&area=8,12&not_cover=1&role=1&firstRow=${firstRow}' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,hr;q=0.6,th;q=0.5' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: webp=1; PHPSESSID=dte3mtfrqddnfvqaso7680soj1; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; T591_TOKEN=dte3mtfrqddnfvqaso7680soj1; c10f3143a018a0513ebe1e8d27b5391c=1; _ga=GA1.3.222640372.1567345398; _gid=GA1.3.706517101.1567345398; _ga=GA1.4.222640372.1567345398; _gid=GA1.4.706517101.1567345398; userLoginHttpReferer=https%253A%252F%252Frent.591.com.tw%252F%253Fkind%253D2%2526region%253D1%2526section%253D5%252C3%252C7%252C4%2526rentprice%253D11000%252C15000%2526area%253D8%252C12%2526not_cover%253D1%2526role%253D1; __asc=c2b1fc9316ced10e75c7742908f; __auc=c2b1fc9316ced10e75c7742908f; cookie_login_user_id=2414258; u_info=8LpWNrpArLw8COiql2%2FZ%2BwlNa%2BTTeaEKZKs; bindUserInfo=8LpWNrpArLw8COiql2%2FZ%2BwlNa%2BTTeaEKZKs; bid[pc][27.52.1.92]=426884; 561c38c1115322c4bad3e8dea3a18f82=1; 591equipment=05964920015673454342414258; ba_cid=a%3A5%3A%7Bs%3A6%3A%22ba_cid%22%3Bs%3A32%3A%2215eccaaba1a49dcdb2e5f030a77a09fa%22%3Bs%3A7%3A%22page_ex%22%3Bs%3A38%3A%22https%3A%2F%2Fwww.591.com.tw%2Fuser-login.html%22%3Bs%3A4%3A%22page%22%3Bs%3A66%3A%22https%3A%2F%2Fwww.591.com.tw%2Findex.php%3Fmodule%3DuserCenter%26action%3DnewGuest%22%3Bs%3A7%3A%22time_ex%22%3Bi%3A1567345403%3Bs%3A4%3A%22time%22%3Bi%3A1567345436%3B%7D; new_rent_list_kind_test=0; XSRF-TOKEN=eyJpdiI6IkFqWjNWRnYrNmIrVW1mZWpMc2lMVFE9PSIsInZhbHVlIjoidUhwbGxNaXRnSHlCMzVXK2R0a20wSkFpMjYraDZvenNqM2YyNGV6TnFsSElPZVA3Zlo0TEJVVmV0VnpmbElyWUFtUG9oRk91TVV4NTI4SWQ3TG1uVHc9PSIsIm1hYyI6IjM2NzdmOTg4ZGUyNTJhZTc0M2VhODA5M2E1NzZiYjI0ZDEwNTFmNmI2ZmFjNTIwMGFlYmI4OTM3NGE1MmQyMjQifQ%3D%3D; 591_new_session=eyJpdiI6Im5EZzRFek8xaExSZ1RHYkZKakxCVVE9PSIsInZhbHVlIjoiVUVUT3FyRGdZU2Y4Wko0bFZJMExZTVdLUW1nTlRDS3JGTnRhbzFmWTFpdlpXTWNVV2UrVnAzWFpWUVJET0VkXC95MTF3czliVXBhZmxnMHNEendRNllRPT0iLCJtYWMiOiIzOTVlZDM5ZWE4YTM1YmQzYTU4ZjcxOGEyY2FiOWM1NTQyYmFjNjk4MjczYzQzNTQ2ODYwM2EyNGJjOWE1YjU2In0%3D; _gat_UA-97423186-1=1, webp=1; PHPSESSID=dte3mtfrqddnfvqaso7680soj1; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; T591_TOKEN=dte3mtfrqddnfvqaso7680soj1; c10f3143a018a0513ebe1e8d27b5391c=1; _ga=GA1.3.222640372.1567345398; _gid=GA1.3.706517101.1567345398; _ga=GA1.4.222640372.1567345398; _gid=GA1.4.706517101.1567345398; userLoginHttpReferer=https%253A%252F%252Frent.591.com.tw%252F%253Fkind%253D2%2526region%253D1%2526section%253D5%252C3%252C7%252C4%2526rentprice%253D11000%252C15000%2526area%253D8%252C12%2526not_cover%253D1%2526role%253D1; __asc=c2b1fc9316ced10e75c7742908f; __auc=c2b1fc9316ced10e75c7742908f; cookie_login_user_id=2414258; u_info=8LpWNrpArLw8COiql2%2FZ%2BwlNa%2BTTeaEKZKs; bindUserInfo=8LpWNrpArLw8COiql2%2FZ%2BwlNa%2BTTeaEKZKs; bid[pc][27.52.1.92]=426884; 561c38c1115322c4bad3e8dea3a18f82=1; 591equipment=05964920015673454342414258; ba_cid=a%3A5%3A%7Bs%3A6%3A%22ba_cid%22%3Bs%3A32%3A%2215eccaaba1a49dcdb2e5f030a77a09fa%22%3Bs%3A7%3A%22page_ex%22%3Bs%3A38%3A%22https%3A%2F%2Fwww.591.com.tw%2Fuser-login.html%22%3Bs%3A4%3A%22page%22%3Bs%3A66%3A%22https%3A%2F%2Fwww.591.com.tw%2Findex.php%3Fmodule%3DuserCenter%26action%3DnewGuest%22%3Bs%3A7%3A%22time_ex%22%3Bi%3A1567345403%3Bs%3A4%3A%22time%22%3Bi%3A1567345436%3B%7D; new_rent_list_kind_test=0; XSRF-TOKEN=eyJpdiI6IkFqWjNWRnYrNmIrVW1mZWpMc2lMVFE9PSIsInZhbHVlIjoidUhwbGxNaXRnSHlCMzVXK2R0a20wSkFpMjYraDZvenNqM2YyNGV6TnFsSElPZVA3Zlo0TEJVVmV0VnpmbElyWUFtUG9oRk91TVV4NTI4SWQ3TG1uVHc9PSIsIm1hYyI6IjM2NzdmOTg4ZGUyNTJhZTc0M2VhODA5M2E1NzZiYjI0ZDEwNTFmNmI2ZmFjNTIwMGFlYmI4OTM3NGE1MmQyMjQifQ%3D%3D; 591_new_session=eyJpdiI6Im5EZzRFek8xaExSZ1RHYkZKakxCVVE9PSIsInZhbHVlIjoiVUVUT3FyRGdZU2Y4Wko0bFZJMExZTVdLUW1nTlRDS3JGTnRhbzFmWTFpdlpXTWNVV2UrVnAzWFpWUVJET0VkXC95MTF3czliVXBhZmxnMHNEendRNllRPT0iLCJtYWMiOiIzOTVlZDM5ZWE4YTM1YmQzYTU4ZjcxOGEyY2FiOWM1NTQyYmFjNjk4MjczYzQzNTQ2ODYwM2EyNGJjOWE1YjU2In0%3D; _gat_UA-97423186-1=1; PHPSESSID=hsdm44ppoq6bde4ij4kgu19mh1; webp=1; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; new_rent_list_kind_test=0; XSRF-TOKEN=eyJpdiI6InFcLzQ0NTJ4N1lZUTg0NWdrdndmNVlBPT0iLCJ2YWx1ZSI6Im1SQzlhTlwvNlFoYUVCcXFNMWVrYXVoV3VvTlZ5b1k1RUVETjUrTnpNdGVBYTA3NzJTR1BYYVRlRHhqTEh1T1NrR1hQSE1nNEdZcWpTb0VBVjh4VzZMZz09IiwibWFjIjoiMWJjYzkyMGE4OWQwMTQwZmY3YWZhMmE3M2I1Nzg4N2RlYzQ3NzMyYTUyYThjYzg3OTk5ZmQwZTk0Y2EzZDcxNSJ9; 591_new_session=eyJpdiI6IlQyQUs2RnNrbE16Y1wvY3N0RE80M3F3PT0iLCJ2YWx1ZSI6IjFkWCt0TUw3NmtQcmNwNVNkSDBFMU16RzUya3Z2OGhlMUlyV2REN2duUWZrUWZOdWwzUHhwOG1TbnZwcDdWcjdaRExLTzRadjUrbEV4OE0zdTVmK1d3PT0iLCJtYWMiOiJhOWMwZGM2MDA5YWE2NzNlNzc3NWYxMmJhMGRlNTBkN2ExMjBkYzI0YjI0OGFlMDE5NDA1ZmM2YzVjZjdmMWQxIn0%3D' \
  -H 'Host: rent.591.com.tw' \
  -H 'Postman-Token: 3b7d3180-b6ee-4f01-bb38-e8bab77d669c,9c3a822f-cda1-4c3f-bc7a-39251c651f54' \
  -H 'Pragma: no-cache' \
  -H 'Referer: https://rent.591.com.tw/?kind=2&region=1&section=5,3,7,4&rentprice=${priceLow},${priceHigh}&area=8,12&not_cover=1&role=1' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' \
  -H 'X-CSRF-TOKEN: 8IUNGz8pzXuuzBdoIak2bsl3p4n6RHzlYohKlj5e' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache'
	`;
  return query;
};

router.get("/search591", async ctx => {
  try {
    const priceLow = ctx.query.priceLow;
    const priceHigh = ctx.query.priceHigh;
    const getTotalQuery = firstRow => {
      const query = generateQuery({
        firstRow,
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
      for (let i = 0; i < (total || 150); i += 30) {
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
