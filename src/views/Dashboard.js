import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Table } from "react-bootstrap";
import { beforeDashboard } from './Dashboard.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader'
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
  );
function Dashboard(props) {

	const [data, setData] = useState({
		users: 0
	})
	const [loader, setLoader] = useState(false)
	const options = {
		responsive: true,
		plugins: {
		  legend: {
			position: 'top',
		  },
		  title: {
			display: true,
			text: 'Chart.js Line Chart',
		  },
		},
	  };
	const labels = ['Fall 2000', 'Spring 2001', 'Fall 2001', 'Spring 2002', 'Fall 2002', 'Spring 2003', 'Fall 2003'];
	const lineData = {
		labels,
		datasets: [
		  {
			label: 'Allocations',
			data: ['2100000', '1100000', '4100000', '1300000', '2100000', '4100000', '1700000'],
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		  }
		],
	  };
	useEffect(() => {
	}, [])

	return (
		<div className="pt-3 pt-md-5">
			{
				loader ?
					<FullPageLoader />
					:
					<Container fluid>
						<Row>
							<Col xl={3} lg={4} sm={6}>
								<Link to="/orders/0" target="_blank" rel="noreferrer noopener">
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category"> Student </p>
													<Card.Title as="h4">1234</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<FontAwesomeIcon icon={faQuoteLeft }/>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Link to="/orders/0" target="_blank" rel="noreferrer noopener">
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category"> Interviewer </p>
													<Card.Title as="h4">1234</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<FontAwesomeIcon icon={faQuoteLeft }/>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Link to="/orders/0" target="_blank" rel="noreferrer noopener">
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category"> Semesters </p>
													<Card.Title as="h4">1234</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<FontAwesomeIcon icon={faQuoteLeft }/>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Link to="/orders/0" target="_blank" rel="noreferrer noopener">
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category"> Total Allocations </p>
													<Card.Title as="h4">1234</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<FontAwesomeIcon icon={faQuoteLeft }/>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Link to="/orders/0" target="_blank" rel="noreferrer noopener">
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex">
												<div className="numbers">
													<p className="card-category"> Refunds </p>
													<Card.Title as="h4">1234</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<FontAwesomeIcon icon={faQuoteLeft }/>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
						</Row>
						<Row className="chart-row">
							<Col xl={12} lg={12} sm={12}>
								<Line options={options} data={lineData} />
							</Col>
						</Row>
					</Container>
			}
		</div>
		
		
	);
}

const mapStateToProps = state => ({
	dashboard: state.dashboard,
	user: state.user,
	error: state.error,
});

export default connect(mapStateToProps, { beforeDashboard })(Dashboard);
