import 'whatwg-fetch'
import { extract } from './collaborations'

const queryAPI = (query) => `http://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(query)}&fmt=json&method=indexed`


const input 	= document.getElementById('search')
const button 	= document.getElementById('search-button')
const matches = document.getElementById('matches')

const selectedOption 	= (e) => {
	const id = e.target.getAttribute('artist')

	extract(id)
		.then(collabs => console.log(collabs))
	matches.innerHTML = ''
}

const fetchArtists = () => {
	document.getElementById('search-box').className = ""
	return
	// if(input.value == '') return
	
	try {
		fetch(queryAPI(input.value))
			.then(res 	=> res.json())
			.then(value => {
				const top5matches = value.artists.sort((s1, s2) => parseInt(s2.score) - parseInt(s1.score)).slice(0, 5)
				matches.innerHTML = top5matches.reduce((p, n, i) => p.concat(`<li artist="${n.id}"  id="option-${i}"> ${n.name}</li>`) , ' ');
				[0, 1, 2 ,3 , 4].forEach(i => document.getElementById(`option-${i}`).addEventListener('click', selectedOption))
				input.value = ''
			})
			.catch(err 	=> fetchArtists())	
	} catch(e) {}
}

button.addEventListener('click', fetchArtists)
input.addEventListener('keydown', (e) => e.keyCode == 13 ? fetchArtists() : null)


