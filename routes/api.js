const Router = require("koa-router");
const router = new Router();
const path = require("path");
const bluebird = require("bluebird");
const cmd = require("node-cmd");
const fs = require("fs");
const ax = require("axios");

router.get("/helloworld", (ctx) => {
  try {
    ctx.status = 200;
  } catch (err) {
    console.log("err:", err);
  }
});

router.get("/search591/black-list", (ctx) => {
  try {
    const rs = fs.readFileSync("black-list.json", "utf8");
    return (ctx.body = JSON.parse(rs));
  } catch (err) {
    console.log("err", err);
    return (ctx.status = 500);
  }
});

router.post("/search591/black-list/add", async (ctx) => {
  const { id } = ctx.request.body;
  const rs = fs.readFileSync("black-list.json", "utf8");
  const newBlackListObj = {
    ...JSON.parse(rs),
    [id]: true,
  };

  const result = await fs.writeFile(
    "black-list.json",
    JSON.stringify(newBlackListObj),
    (err) => {
      if (err) console.log(err);
      else {
        ctx.status = 200;
      }
    }
  );

  ctx.status = 200;
});

// Add Multiple
router.post("/search591/black-list/deleteAllNotProtected", async (ctx) => {
  const { ids } = ctx.request.body;
  const fileStr = fs.readFileSync("black-list.json", "utf8");
  const newBlackListObj = JSON.parse(fileStr);
  ids.forEach((id) => {
    newBlackListObj[id] = true;
  });

  const result = await fs.writeFile(
    "black-list.json",
    JSON.stringify(newBlackListObj),
    (err) => {
      if (err) console.log(err);
      else {
        ctx.status = 200;
      }
    }
  );

  ctx.status = 200;
});

// Get
router.get("/search591/protect-list", (ctx) => {
  try {
    const fileStr = fs.readFileSync("protect-list.json", "utf8");
    return (ctx.body = JSON.parse(fileStr));
  } catch (err) {
    console.log("err", err);
    return (ctx.status = 500);
  }
});

// Add
router.post("/search591/protect-list/", (ctx) => {
  const { id } = ctx.request.body;
  const fileStr = fs.readFileSync("protect-list.json", "utf8");
  const newProtectListObj = JSON.parse(fileStr)[id]
    ? JSON.parse(fileStr)
    : {
        ...JSON.parse(fileStr),
        [id]: true,
      };

  fs.writeFile(
    "protect-list.json",
    JSON.stringify(newProtectListObj),
    function (err) {
      if (err) console.log(err);
      else ctx.status = 204;
    }
  );

  return (ctx.status = 200);
});

// Delete
router.post("/search591/protect-list/delete", (ctx) => {
  const { id } = ctx.request.body;
  const fileStr = fs.readFileSync("protect-list.json", "utf8");
  const newProtectListObj = JSON.parse(fileStr);
  delete newProtectListObj[id];
  fs.writeFile(
    "protect-list.json",
    JSON.stringify(newProtectListObj),
    function (err) {
      if (err) console.log(err);
      else console.log("Write operation complete.");
    }
  );

  return (ctx.status = 200);
});

const generateQuery = ({
  firstRow,
  priceLow,
  priceHigh,
  cookie,
  csrftoken,
}) => {
  // const query = !firstRow
  const query = false
    ? `
		curl -X GET \
  'https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=2&searchtype=1&region=1&section=5,3,7,4,1&rentprice=${priceLow},${priceHigh}&area=8,13&not_cover=1&role=1' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,hr;q=0.6,th;q=0.5' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Cookie:  user_index_role=1; T591_TOKEN=7a0d709af5a2c98338ad937f213058b5; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; _ga=GA1.4.237250086.1567346615; _ga=GA1.3.237250086.1567346615; __auc=e68d1f0b16ced236665272b380e; userLoginHttpReferer=https%253A%252F%252Frent.591.com.tw%252F%253Fkind%253D2%2526region%253D1%2526section%253D5%252C3%252C7%252C4%2526rentprice%253D11000%252C15000%2526area%253D8%252C12%2526not_cover%253D1%2526role%253D1; u_info=%2FLVTN%2BgX%2FehhHOKrlmvb9wFWJvbEe6YYc6n6; 561c38c1115322c4bad3e8dea3a18f82=1; 591equipment=01197720015675218372414258; new_rent_list_kind_test=0; cookie_login_user_id=2414258; c10f3143a018a0513ebe1e8d27b5391c=1; _gid=GA1.3.237482403.1567701692; _gid=GA1.4.237482403.1567701692; user_browse_recent=a%3A5%3A%7Bi%3A0%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228174414%22%3B%7Di%3A1%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228163292%22%3B%7Di%3A2%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228153355%22%3B%7Di%3A3%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228137302%22%3B%7Di%3A4%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%228163138%22%3B%7D%7D; ba_cid=a%3A5%3A%7Bs%3A6%3A%22ba_cid%22%3Bs%3A32%3A%220f936da15c1584ac71db9673406c7afb%22%3Bs%3A7%3A%22page_ex%22%3Bs%3A48%3A%22https%3A%2F%2Frent.591.com.tw%2Frent-detail-8163292.html%22%3Bs%3A4%3A%22page%22%3Bs%3A48%3A%22https%3A%2F%2Frent.591.com.tw%2Frent-detail-8174414.html%22%3Bs%3A7%3A%22time_ex%22%3Bi%3A1567605809%3Bs%3A4%3A%22time%22%3Bi%3A1567701854%3B%7D; webp=1; PHPSESSID=h862l3mck9u9n636o2ogntmmp7; _gat=1; _dc_gtm_UA-97423186-1=1; XSRF-TOKEN=eyJpdiI6ImQ1OExobGNHSXNyXC9rRlMyUllcL0xVZz09IiwidmFsdWUiOiJ0RUpicjF6TEFUNXlpT3VPV3pEY2xsMUw3cXlpSE5aUWFjSWRFcVFaK25IK0REUkNoaG9Xbm5RaU1QVUU2VUxFY3RURjkwUjVFT3o3K1RZZjZDS3hsZz09IiwibWFjIjoiZWI3NTNiMTYyZjJjMWRkZWRmNTUxZjE2MGUyZmNiYjRjNmMzYWEzMzE0MjMxZjg2MGJjMzY3YWY5YzlkMjY0MCJ9; 591_new_session=eyJpdiI6ImdLdmZsM1hCU25KSnNtTlVMNzNtWmc9PSIsInZhbHVlIjoiRklDdlFaUXcrcE1ITEFZRkxOc2c3ZXBWRlwvZFBuOCtDam1tRnNXbU5CTFQreDdjeWtMclRneWJcL1NsckxSRTJqdkE1M1Q5bW5OMm13NkRnclBXeTVodz09IiwibWFjIjoiMzllZjAxNzExNTk1ZGNmYmE0OTk2OTQ1ZmFhYjdjZGJmYWY1N2FkMjY0YTFlMTMzZGZhZTk1OWNiMWNmNmViNiJ9; _gat_UA-97423186-1=1; PHPSESSID=hsdm44ppoq6bde4ij4kgu19mh1; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; new_rent_list_kind_test=0; 591_new_session=eyJpdiI6Im1rZ05TRlZvbmgxQzhHVjlSWDhMbWc9PSIsInZhbHVlIjoiTk45Y3dtYUdHYlFZS0ZwT2t4bjQ2Yjh5YlVKdldoblpjOURhd2xrYlQzZ0FoMFZcL1hiU3E5WHBGU25XMUtOWDZrbUZCd3VaZnl2ZDlXbFdrWkJVMVV3PT0iLCJtYWMiOiI3ZTQ1MDIzMzBhYjY3MzJmYjRkYTcyMzNmYzQzNTlmOTVjYWI4N2E3YTA3YTc0NDFmZDgxMTUxNWJkYzBhMzcwIn0%3D' \
  -H 'Host: rent.591.com.tw' \
  -H 'Postman-Token: 5c4dfa85-d813-4b4c-be3f-cbbc585742af,322dbb33-cf4c-4429-ba37-16d8556840e2' \
  -H 'Referer: https://rent.591.com.tw/?kind=2&region=1&section=5,3,7,4,1&rentprice=${priceLow},${priceHigh}&area=8,13&not_cover=1&role=1' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' \
  -H 'X-CSRF-TOKEN: jAtrA6t9MrORlRPc2BcyaGLq3FiekgN05rRAD48K' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache'
	`
    : `
  curl -X GET \
  'https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=2&searchtype=1&region=1&section=5,3,7,4,1&rentprice=${priceLow},${priceHigh}&area=8,12&not_cover=1&role=1&firstRow=0' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,hr;q=0.6,th;q=0.5' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: T591_TOKEN=mer8v0anq7gg81m2pm70fnoce7; _ga=GA1.3.2094551628.1589443656; _ga=GA1.4.2094551628.1589443656; tw591__privacy_agree=0; user_index_role=1; __auc=567bb630172123a9528342d5c5d; user_browse_recent=a%3A5%3A%7Bi%3A0%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%229172659%22%3B%7Di%3A1%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%229285910%22%3B%7Di%3A2%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%227621298%22%3B%7Di%3A3%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%229247783%22%3B%7Di%3A4%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%229219722%22%3B%7D%7D; webp=1; PHPSESSID=1evujj7f81f3be0n065u26omt1; new_rent_list_kind_test=0; c10f3143a018a0513ebe1e8d27b5391c=1; _gid=GA1.3.1377007579.1590594512; _gid=GA1.4.1377007579.1590594512; userLoginHttpReferer=https%253A%252F%252Frent.591.com.tw%252F%253Fkind%253D2%2526region%253D8%2526section%253D5%252C3%252C7%252C4%252C1%2526rentprice%253D11000%252C15000%2526area%253D8%252C12%2526not_cover%253D1%2526role%253D1; __asc=44efb29117256d2c65e79d65c5e; cookie_login_user_id=2414258; u_info=%2FLVTN%2BgX%2FehhHOKrlmvb9wFWJvbEe6YYc6n6; bindUserInfo=%2FLVTN%2BgX%2FehhHOKrlmvb9wFWJvbEe6YYc6n6; bid[pc][27.242.103.213]=563164; 561c38c1115322c4bad3e8dea3a18f82=1; 591equipment=04569280015905945862414258; ba_cid=a%3A5%3A%7Bs%3A6%3A%22ba_cid%22%3Bs%3A32%3A%225f4da7f00414ad4220a5220c8b249dd2%22%3Bs%3A7%3A%22page_ex%22%3Bs%3A38%3A%22https%3A%2F%2Fwww.591.com.tw%2Fuser-login.html%22%3Bs%3A4%3A%22page%22%3Bs%3A66%3A%22https%3A%2F%2Fwww.591.com.tw%2Findex.php%3Fmodule%3DuserCenter%26action%3DnewGuest%22%3Bs%3A7%3A%22time_ex%22%3Bi%3A1590594552%3Bs%3A4%3A%22time%22%3Bi%3A1590594588%3B%7D; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; XSRF-TOKEN=eyJpdiI6IjB5NzNrQzlFVyt1RUduXC9oSU9CMXBBPT0iLCJ2YWx1ZSI6ImlUWm9xXC9JRllBVGVvMWJXZTJYdSt0RU9yb1JLRTVEdG1ERk9GdmF3a0NCXC80NGVsV0hcLzRVcngyUHdCU3ZtUnNONzdWNHk2ODJNaGJseXlBYXp4T3V3PT0iLCJtYWMiOiI1M2JlZDAwNTNiNDQ0OTkzMzc1ZWUzOTk0Mzg1OGJjM2NhMjdiZDdhMjQ5ZmY4NjkzYTc2ZGI4NzAyZjc5MDM4In0%3D; 591_new_session=eyJpdiI6IjJSRFVieDJSMnFJc3h1eUU5SnAyYmc9PSIsInZhbHVlIjoiM21Vd1Q0ZmdBYmNHNkFrK013KzlVOVNyU1ZDV25UNWVRQ2FHXC9uK2c2ZjIxRFZINEdDRlJ4V2pnTHg4bEtoVE1BczJjcTVxckFtY2N2RjRYV0NtRUhBPT0iLCJtYWMiOiIwZTYyMWJjMDZlOWZlODY1M2M0ZjFiYTIxMWY3ZTU3Zjg5YThjMGIzY2FlMDNhMGEzYzc4OWQwODVjNjYzZWUzIn0%3D; _gat_UA-97423186-1=1,T591_TOKEN=mer8v0anq7gg81m2pm70fnoce7; _ga=GA1.3.2094551628.1589443656; _ga=GA1.4.2094551628.1589443656; tw591__privacy_agree=0; user_index_role=1; __auc=567bb630172123a9528342d5c5d; user_browse_recent=a%3A5%3A%7Bi%3A0%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%229172659%22%3B%7Di%3A1%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%229285910%22%3B%7Di%3A2%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%227621298%22%3B%7Di%3A3%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%229247783%22%3B%7Di%3A4%3Ba%3A2%3A%7Bs%3A4%3A%22type%22%3Bi%3A1%3Bs%3A7%3A%22post_id%22%3Bs%3A7%3A%229219722%22%3B%7D%7D; webp=1; PHPSESSID=1evujj7f81f3be0n065u26omt1; new_rent_list_kind_test=0; c10f3143a018a0513ebe1e8d27b5391c=1; _gid=GA1.3.1377007579.1590594512; _gid=GA1.4.1377007579.1590594512; userLoginHttpReferer=https%253A%252F%252Frent.591.com.tw%252F%253Fkind%253D2%2526region%253D8%2526section%253D5%252C3%252C7%252C4%252C1%2526rentprice%253D11000%252C15000%2526area%253D8%252C12%2526not_cover%253D1%2526role%253D1; __asc=44efb29117256d2c65e79d65c5e; cookie_login_user_id=2414258; u_info=%2FLVTN%2BgX%2FehhHOKrlmvb9wFWJvbEe6YYc6n6; bindUserInfo=%2FLVTN%2BgX%2FehhHOKrlmvb9wFWJvbEe6YYc6n6; bid[pc][27.242.103.213]=563164; 561c38c1115322c4bad3e8dea3a18f82=1; 591equipment=04569280015905945862414258; ba_cid=a%3A5%3A%7Bs%3A6%3A%22ba_cid%22%3Bs%3A32%3A%225f4da7f00414ad4220a5220c8b249dd2%22%3Bs%3A7%3A%22page_ex%22%3Bs%3A38%3A%22https%3A%2F%2Fwww.591.com.tw%2Fuser-login.html%22%3Bs%3A4%3A%22page%22%3Bs%3A66%3A%22https%3A%2F%2Fwww.591.com.tw%2Findex.php%3Fmodule%3DuserCenter%26action%3DnewGuest%22%3Bs%3A7%3A%22time_ex%22%3Bi%3A1590594552%3Bs%3A4%3A%22time%22%3Bi%3A1590594588%3B%7D; urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; XSRF-TOKEN=eyJpdiI6IjB5NzNrQzlFVyt1RUduXC9oSU9CMXBBPT0iLCJ2YWx1ZSI6ImlUWm9xXC9JRllBVGVvMWJXZTJYdSt0RU9yb1JLRTVEdG1ERk9GdmF3a0NCXC80NGVsV0hcLzRVcngyUHdCU3ZtUnNONzdWNHk2ODJNaGJseXlBYXp4T3V3PT0iLCJtYWMiOiI1M2JlZDAwNTNiNDQ0OTkzMzc1ZWUzOTk0Mzg1OGJjM2NhMjdiZDdhMjQ5ZmY4NjkzYTc2ZGI4NzAyZjc5MDM4In0%3D; 591_new_session=eyJpdiI6IjJSRFVieDJSMnFJc3h1eUU5SnAyYmc9PSIsInZhbHVlIjoiM21Vd1Q0ZmdBYmNHNkFrK013KzlVOVNyU1ZDV25UNWVRQ2FHXC9uK2c2ZjIxRFZINEdDRlJ4V2pnTHg4bEtoVE1BczJjcTVxckFtY2N2RjRYV0NtRUhBPT0iLCJtYWMiOiIwZTYyMWJjMDZlOWZlODY1M2M0ZjFiYTIxMWY3ZTU3Zjg5YThjMGIzY2FlMDNhMGEzYzc4OWQwODVjNjYzZWUzIn0%3D; _gat_UA-97423186-1=1; XSRF-TOKEN=eyJpdiI6IkRFNlprQmxTTEpqeldWYXMxQ0lrb1E9PSIsInZhbHVlIjoiOElBemhOOWM3SGpUNlBmSkl6TDgrRHhsa0VHVWJqV243VDNISE9Ld3Yzdk84VWEzb3hheXFXZzROeHptSHVST3ViNnlsa3lxMlJseGRnN1wvVnZabzBBPT0iLCJtYWMiOiJlMTdlMmQ4ZWEzNzEwYzcxNTFiZmIzZDg3ZjgyYzc1MWM1YmE4NzNkN2EyNDBiMmZhY2Y1MmMzNTRjNTc5YTQwIn0%3D; 591_new_session=eyJpdiI6InQrYmF5WE5vdTdpTUdcL21HRFQ1TXRRPT0iLCJ2YWx1ZSI6Ijc1T0QxcWI1dTZQM1ZzM1ZsWE1rQndFMWZERThIcWZFWmt3UHBQVjRwdGc4NEJvbFRtSzRWa1N4RUEyQ0FZQlwvY2loa2dyZk1VdHg4YjNoK1wvZEtcL29BPT0iLCJtYWMiOiJlZDIwZmZhZGNkNDk1MjY1YjkwZTA1NGFkYTNkMjRkNzVhY2Q3ZTNkMjQ5MWNmODE5NWU2OWYxNTlkYzZiOTdiIn0%3D' \
  -H 'Host: rent.591.com.tw' \
  -H 'Postman-Token: c5545af0-c8b8-449a-a2eb-8fc280f8d757,aa4245f4-6bf7-4db9-af2f-d5036b5e8393' \
  -H 'Pragma: no-cache' \
  -H 'Referer: https://rent.591.com.tw/?kind=2&region=1&section=5,3,7,4,1&rentprice=${priceLow},${priceHigh}&area=8,12&not_cover=1&role=1' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36' \
  -H 'X-CSRF-TOKEN: zu4VVdmtLKheX8L43Jphlkj33fldFT8Ku6R0Z6ZU' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'cache-control: no-cache'
  `;
  return query;
};

router.get("/search591", async (ctx) => {
  try {
    const priceLow = ctx.query.priceLow;
    const priceHigh = ctx.query.priceHigh;
    const cookie = ctx.query.cookie;
    const csrftoken = ctx.query.csrftoken;
    const getTotalQuery = (firstRow) => {
      const query = generateQuery({
        firstRow,
        priceLow,
        priceHigh,
        csrftoken,
        cookie,
      });
      return query;
    };

    const getAsync = bluebird.promisify(cmd.get, {
      multiArgs: true,
      context: cmd,
    });

    const getHouseData = async () => {
      let total = 0,
        houseData = [];

      await getAsync(getTotalQuery())
        .then((data) => {
          const parsedData = JSON.parse(data[0]);
          total = +parseInt(parsedData.records);
        })
        .catch((err) => {
          console.log("cmd error", err);
        });

      const requestChain = [];
      for (let i = 0; i < (total || 150); i += 30) {
        const command = getTotalQuery(i);
        requestChain.push(
          getAsync(command)
            .then((data) => {
              const parsedData = JSON.parse(data[0]).data.data;
              houseData = [...houseData, ...parsedData];
            })
            .catch((err) => {
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

module.exports = router;
