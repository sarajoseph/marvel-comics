import React, { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5';
import { useParams, Link } from "react-router-dom";
import { format } from 'date-fns';
import '../scss/comic.scss';

function Comic(){
	const {comicID} = useParams();
	const baseURL = 'https://gateway.marvel.com/v1/public/comics';
	const publicKey = 'd04852c70e9161deb93006ce23bc3b4b';
	const privateKey = '189d0b8aa937678a000294da5d730fe3bca9d69d';	
	const ts = Number(new Date());	
	const hash = md5(ts + privateKey + publicKey);
	const [comic, setComic] = useState([]);
	
	useEffect(() => {
		axios.get(baseURL, { params: { ts: ts, apikey: publicKey, hash: hash } }).then(res => {
			setComic(res.data.data.results.filter(comic => comic.id === parseInt(comicID))[0]);
		}).catch(error => console.log(error))
	}, [])
	
	function openLink(url){
		axios.get(url, { params: { ts: ts, apikey: publicKey, hash: hash } }).then(res => {
			window.location.href = res.data.data.results[0].urls[0].url;
		}).catch(error => console.log(error))
	}

	if(comic.length !== 0){

		if(comic.dates.filter(date => date.type === 'onsaleDate')[0].date !== undefined){
			var onSaleDate = new Date(comic.dates.filter(date => date.type === 'onsaleDate')[0].date);
			onSaleDate = format(onSaleDate, 'dd/MM/yyyy');
		}

		if(comic.modified !== undefined){
			let date = new Date(comic.modified);
			var modifiedDate = 'Unknown';
			if(Object.prototype.toString.call(date) === '[object Date]'){
				if(!isNaN(date)){ 
					modifiedDate = format(date, 'dd/MM/yyyy');
				}
			}
		}

		var creatorsByRole = [];
		if(comic.creators.items.length > 0){
			comic.creators.items.forEach( creatorItem => {
				if(!creatorsByRole.hasOwnProperty(creatorItem.role)){
					creatorsByRole[creatorItem.role] = [];
				}
				creatorsByRole[creatorItem.role].push({
					name: creatorItem.name,
					resourceURI: creatorItem.resourceURI
				})
			})
		}

		return (
			<div className="comic-page">
				<div className="back-button">
					<Link to='/' className="back-button--link" alt="home">
						<div className="back-button--icon"><i className="fa-solid fa-house"></i></div>
						<div className="back-button--text">Home</div>
					</Link>
				</div>

				<div className="comic-container">
					<div className="comic__image">
						{comic.thumbnail.path !== undefined && <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title}/>}
					</div>

					<div className="comic__info">
						<div className="comic__title">{comic.title}</div>
						
						<div className="comic__info--items">
							{onSaleDate !== undefined &&
							<div className="comic__info--item comic__onsaledate">
								<label>On sale date:</label>
								<div>{onSaleDate}</div>
							</div>
							}

							{modifiedDate !== undefined &&
							<div className="comic__info--item comic__modifieddate">
								<label>Modified date:</label>
								<div>{modifiedDate}</div>
							</div>
							}

							{comic.prices[0].price !== undefined && 
							<div className="comic__info--item comic__price">
								<label>Price:</label>
								<div>{comic.prices[0].price} €</div>
							</div>
							}

							{comic.pageCount !== undefined && 
							<div className="comic__info--item comic__pages">
								<label>Pages:</label>
								<div>{comic.pageCount} pages</div>
							</div>
							}
						</div>
						
						{creatorsByRole !== undefined &&
							<div className="comic__info--items comic__authors">
							{
								Object.keys(creatorsByRole).map(function(key){
									return(
										<div key={key} className="comic__info--item comic__author">
											<label>{key}:</label>
											<ul>
											{
												creatorsByRole[key].map(function(item, k){
													return(
														<li key={k}><div onClick={() => openLink(item.resourceURI)} href={item.resourceURI} className="comic__author--name">{item.name}</div></li>
													)
												})
											}
											</ul>
										</div>
									)
								})
							}
							</div>
						}

						{comic.description !== undefined && 
						<div className="comic__info--item comic__description">
							<label>Description:</label>
							<div>{comic.description}</div>
						</div>
						}

						<a href={comic.urls[0].url} className="comic__button">More information</a>

					</div>
				</div>
			</div>		
		);
	}
}

export default Comic;