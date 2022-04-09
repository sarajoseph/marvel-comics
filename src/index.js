import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import './fontawesome/css/all.css';
import './scss/index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './js/Header';
import Comics from './js/Comics';
import Comic from './js/Comic';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Header/>
		<Routes>
			<Route path="/" element={<Comics/>} />
			<Route exact path='/comic/:comicID' element={<Comic/>}></Route>
		</Routes>
	</BrowserRouter>
);