import React, { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5';
import { Link } from 'react-router-dom';
import '../scss/comics.scss';

window.addEventListener('click', function(e){
	
	if(document.getElementById('sortfilter') !== null){
		if(!document.getElementById('sortfilter').contains(e.target)){
			document.getElementById('sortfilterIcon').classList.remove('fa-angle-up');
			document.getElementById('sortfilterIcon').classList.add('fa-angle-down');
			document.getElementById('sortfilterItems').classList.add('hide');
		}
	}
	if(document.getElementById('fieldfilter') !== null){
		if(!document.getElementById('fieldfilter').contains(e.target)){
			document.getElementById('fieldfilterIcon').classList.remove('fa-angle-up');
			document.getElementById('fieldfilterIcon').classList.add('fa-angle-down');
			document.getElementById('fieldfilterItems').classList.add('hide');
		}
	}

});

function Comics() {

	const baseURL = 'https://gateway.marvel.com/v1/public/comics';
	const publicKey = 'd04852c70e9161deb93006ce23bc3b4b';
	const privateKey = '189d0b8aa937678a000294da5d730fe3bca9d69d';	
	const ts = Number(new Date());	
	const hash = md5(ts + privateKey + publicKey);
	const [comicsOriginal, setComicsOriginal] = useState([]);
	const [comics, setComics] = useState([]);
	
	useEffect(() => {
		axios.get(baseURL, { params: { ts: ts, apikey: publicKey, hash: hash } }).then(res => {
			setComicsOriginal(res.data.data.results);
			setComics(res.data.data.results);
		}).catch(error => console.log(error))
	}, [])

	function handleSort(sortBy){

		let selectedItem = document.getElementById(sortBy);
		let items = document.querySelectorAll('.sortfilter__item--circle');

		Array.prototype.forEach.call(items, function(e){
			if(e.id !== sortBy){
				e.classList.remove('fa-circle-check');
			}
		});

		if(!selectedItem.classList.contains('fa-circle-check')){
			selectedItem.classList.add('fa-circle-check');
		}

		const sortedComics = [...comics].sort((a,b) => {
			if(sortBy === 'sortfilterTitle'){
				return a.title > b.title ? 1 : -1
			}else if(sortBy === 'sortfilterPrice'){
				return a.prices[0].price > b.prices[0].price ? 1 : -1
			}else if(sortBy === 'sortfilterPages'){
				return a.pageCount > b.pageCount ? 1 : -1
			}
			return null;
		})

		setComics(sortedComics);

	}

	function toggleFilterMenu(filter){

		let filterIcon, filterItems;

		if(filter === 'sort'){
			filterIcon = document.getElementById('sortfilterIcon');
			filterItems = document.getElementById('sortfilterItems');
			
		}else if(filter === 'field'){
			filterIcon = document.getElementById('fieldfilterIcon');
			filterItems = document.getElementById('fieldfilterItems');
		}

		// Show menu
		if(filterIcon.classList.contains('fa-angle-down')){
			filterIcon.classList.remove('fa-angle-down');
			filterIcon.classList.add('fa-angle-up');
			filterItems.classList.remove('hide');

		// Hide menu
		}else if(filterIcon.classList.contains('fa-angle-up')){
			filterIcon.classList.remove('fa-angle-up');
			filterIcon.classList.add('fa-angle-down');
			filterItems.classList.add('hide');
		}

	}

	function handleField(field){

		let selectedItem = document.getElementById(field);
		let filteredComics = comicsOriginal;

		if(!selectedItem.classList.contains('fa-square-check')){
			selectedItem.classList.add('fa-square-check');
		}else{
			selectedItem.classList.remove('fa-square-check');	
		}

		if(document.getElementById('fieldfilterCreators').classList.contains('fa-square-check')){
			filteredComics = filteredComics.filter(comic => comic.creators.items.length > 0);
		}
		if(document.getElementById('fieldfilterPrice').classList.contains('fa-square-check')){
			filteredComics = filteredComics.filter(comic => comic.prices[0].price > 0);
		}
		if(document.getElementById('fieldfilterPages').classList.contains('fa-square-check')){
			filteredComics = filteredComics.filter(comic => comic.pageCount > 0);
		}

		setComics(filteredComics);

	}
	
	function openLink(url){
		axios.get(url, { params: { ts: ts, apikey: publicKey, hash: hash } }).then(res => {
			window.location.href = res.data.data.results[0].urls[0].url;
		}).catch(error => console.log(error))
	}

	return (
		<div className="comics-page">
			<div className="filters">
				<div className="sortfilter" id="sortfilter">
					<div className="sortfilter__header">
						<i className="sortfilter__icon fa-solid fa-angle-down" id="sortfilterIcon" onClick={() => toggleFilterMenu('sort')}></i>
						<div className="sortfilter__title">Sort by</div>
					</div>
					<div className="sortfilter__items hide" id="sortfilterItems">
						<div className="sortfilter__item">
							<i className="fa-regular fa-circle sortfilter__item--circle" id="sortfilterTitle" onClick={() => handleSort('sortfilterTitle')}></i>
							<div className="sortfilter__item--text">Title</div>
						</div>
						<div className="sortfilter__item">
							<i className="fa-regular fa-circle sortfilter__item--circle" id="sortfilterPrice" onClick={() => handleSort('sortfilterPrice')}></i>
							<div className="sortfilter__item--text">Price</div>
						</div>
						<div className="sortfilter__item">
							<i className="fa-regular fa-circle sortfilter__item--circle" id="sortfilterPages" onClick={() => handleSort('sortfilterPages')}></i>
							<div className="sortfilter__item--text">Pages</div>
						</div>
					</div>
				</div>

				<div className="fieldfilter" id="fieldfilter">				
					<div className="fieldfilter__header">
						<i className="fieldfilter__icon fa-solid fa-angle-down" id="fieldfilterIcon" onClick={() => toggleFilterMenu('field')}></i>
						<div className="fieldfilter__title">Filter by</div>
					</div>
					<div className="fieldfilter__items hide" id="fieldfilterItems">
						<div className="fieldfilter__item">
							<i className="fa-regular fa-square fieldfilter__item--square" id="fieldfilterCreators" onClick={() => handleField('fieldfilterCreators')}></i>
							<div className="fieldfilter__item--text">Creators</div>
						</div>
						<div className="fieldfilter__item">
							<div className="fa-regular fa-square fieldfilter__item--square" id="fieldfilterPrice" onClick={() => handleField('fieldfilterPrice')}></div>
							<div className="fieldfilter__item--text">Price</div>
						</div>
						<div className="fieldfilter__item">
							<div className="fa-regular fa-square fieldfilter__item--square" id="fieldfilterPages" onClick={() => handleField('fieldfilterPages')}></div>
							<div className="fieldfilter__item--text">Pages</div>
						</div>
					</div>
				</div>
			</div>

			<div key="comics" className="comics">
			{
				comics.map( comic =>(
					<div key={comic.id} className="comic">
						<div className="comic__header">
							<img className="comic__image" src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title}></img>
							<div className="comic__title">{comic.title}</div>
						</div>
						<div className="comic__info">
							{comic.prices[0].price !== undefined && <div className="comic__price">{comic.prices[0].price} €</div>}
							{comic.pageCount !== undefined && <div className="comic__pages">{comic.pageCount} pages</div>}
							{comic.creators.items.length > 0 &&
							<div className="comic__authors">
								{
									comic.creators.items.map( (creatorItem, index) =>(
										<div key={index} className="comic__author">
											<div onClick={() => openLink(creatorItem.resourceURI)} className="comic__author--name">{creatorItem.name}</div>
											{ (comic.creators.items.length !== index+1 ? ', ' : '') }
										</div>
									))
								}
							</div>
							}
							<Link to={'/comic/'+comic.id} className='comic__button'>More information</Link>
						</div>
					</div>
				))
			}
			</div>
		</div>
	);
}

export default Comics;