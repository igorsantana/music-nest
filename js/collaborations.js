const artist = (id, offset) => `http://musicbrainz.org/ws/2/recording?artist=${id}&fmt=json&limit=100&inc=artist-credits&offset=${offset}`
const promisify = (v) => new Promise((res, _) => res(v))

const extract = (id) => {
		return fetch(artist(id, 0))
		.then(res => res.json())
		.then(response => {
			let listings = response.recordings
			const requestToFullfil = Math.floor(response['recording-count'] / 100)

			if(requestToFullfil == 0)
				return promisify(listings)

			const promises = []
			let i  = 0, incOffset = 100;
			
			while(i < requestToFullfil){
				promises.push(fetch(artist(id, incOffset)).then(res => res.json()))
				i++; incOffset += 100
			} 


			return Promise.all(promises)
				.then(res => promisify(listings.concat(res.reduce((p, v) => p.concat(v.recordings), []))))
				.catch(err => console.log(err))
		})
		.then(songs => {
				const seen = {}
				const collabs = songs.reduce((p, n) => p.concat(n['artist-credit']),[])
															.filter(credit => credit.artist.id != id)
															
				return promisify(collabs.filter(item => seen.hasOwnProperty(item.name) ? false : (seen[item.name] = true)))
		})
		
}


module.exports = { extract }