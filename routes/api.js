const Router = require('koa-router')
const router = new Router()
const path = require('path')
const bluebird = require('bluebird')
const cmd = require('node-cmd')
const fs = require('fs')
const ax = require('axios')

router.get('/search591/black-list', ctx => {
	try {
		const rs = fs.readFileSync('black-list.json', 'utf8')
		return (ctx.body = JSON.parse(rs))
	} catch (err) {
		console.log('err', err)
		return (ctx.status = 500)
	}
})

router.post('/search591/black-list/add', ctx => {
	const { id } = ctx.request.body
	const rs = fs.readFileSync('black-list.json', 'utf8')
	const newBlackList = [...JSON.parse(rs), id]

	fs.writeFile('black-list.json', JSON.stringify(newBlackList), function(err) {
		if (err) console.log(err)
		else console.log('Write operation complete.')
	})
	// always success?
	return (ctx.status = 200)
})

router.get('/search591', async ctx => {
	// check 591 rsList Api request url
	const url =
		'https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=2&searchtype=1&region=8&section=102,103,101&rentprice=7999,10000&area=10,17'
	try {
		const getCommand = firstRow => {
			return `curl -X GET '${url}&firstRow=${firstRow}' -H 'cookie: PHPSESSID=rgnmg9mnfa9gu5chdco1ds9ci7; new_rent_list_kind_test=1; c10f3143a018a0513ebe1e8d27b5391c=1; _ga=GA1.3.2085218089.1509093321; _gid=GA1.3.215660181.1509093321; urlJumpIp=8; urlJumpIpByTxt=%E5%8F%B0%E4%B8%AD%E5%B8%82; 591_new_session=eyJpdiI6Ik5UaUhZcUhaajl2b201ZFRiOW5VZ2c9PSIsInZhbHVlIjoidHg3TWFwNFJUK1kwRFlJOHBZV1lhUkxYYjhobk1yV05INHJqNFFUMWpySTlWXC9HVVRSbFU4Z1p0Ryt6RlNcL1ZMdFwvZG9FaEFuYXRwcnZ0OERvamI4QXc9PSIsIm1hYyI6IjY0Nzc5ZDFkNTNmMGQyODg2ZDVjMzYzMjVjNWVhNDRhZjlkYTE4ZjkxNTg3ODU5YzFmY2U5MjdhMWM4YmUxNjEifQ%3D%3D; _ga=GA1.4.2085218089.1509093321; _gid=GA1.4.215660181.1509093321; _gat_UA-97423186-1=1'`
		}

		const getHouseData = async () => {
			const getAsync = bluebird.promisify(cmd.get, {
				multiArgs: true,
				context: cmd
			})
			let houseData = [],
				total

			await getAsync(getCommand())
				.then(data => {
					total = parseInt(JSON.parse(data[0]).records)
				})
				.catch(err => {
					console.log('cmd error', err)
				})

			const requestChain = []

			for (let i = 0; i < total; i += 30) {
				const command = getCommand(i)
				requestChain.push(
					getAsync(command)
						.then(data => {
							houseData = [...houseData, ...JSON.parse(data[0]).data.data]
						})
						.catch(err => {
							console.log('cmd error', err)
						})
				)
			}

			await Promise.all(requestChain)

			return houseData
		}

		const combinedHouseData = await getHouseData()
		ctx.body = combinedHouseData
	} catch (error) {
		console.log('error:', error)
		ctx.status = 401
		ctx.body = JSON.stringify({ error: error.code })
	}
})

router.get('/search104', async ctx => {
	try {
		// area either "tpe" or "tch" 台北/台中
		const tpeAreaGroup = '2C6001001000'
		const tchAreaGroup = '6001008000'
		const { area } = ctx.query
		const encodedArea = area === 'tpe' ? tpeAreaGroup : tchAreaGroup
		const combineJobRequest = (maxPageSize, area) => {
			const combineArr = []
			const getUrl = pageNum =>
				`https://www.104.com.tw/jobs/search/list?ro=0&jobcat=2001001003%2C2004001005%2C2004001007%2C2004001006%2C2005003005&area=${area}&order=2&asc=0&page=${pageNum}&mode=s&jobsource=n104bank1`
			for (let i = 1; i <= maxPageSize; i++) {
				combineArr.push(ax.get(getUrl(i)))
			}
			return ax.all(combineArr)
		}

		const combinedJobData = await combineJobRequest(50, encodedArea)

		// re-structure job data
		const returnData = combinedJobData.reduce(
			(combinedArr, pageData) => [...combinedArr, ...pageData.data.data.list],
			[]
		)

		ctx.body = returnData
	} catch (err) {
		console.log('err:', err)
	}
})

module.exports = router
