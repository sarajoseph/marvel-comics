import { Link } from 'react-router-dom';

function Header(){
	return (		
		<div className="header">
			<h1 className="title"><Link to="/">Marvel Comics</Link></h1>
		</div>
	);
}
export default Header;