import React from "react";
import { Link } from 'react-router-dom';
// react-bootstrap components
import { Container } from "react-bootstrap";

function AdminFooter() {
	return (
		<>
			<footer className="footer">
				<Container fluid className="pl-4 ml-2">
					<nav>
						<p className="copyright text-center">  Copyright © <script>document.write(new Date().getFullYear())</script>  <Link to="/">Attivita GmbH.</Link> All Rights Reserved</p>
					</nav>
				</Container>
			</footer>
		</>
	);
}

export default AdminFooter;
