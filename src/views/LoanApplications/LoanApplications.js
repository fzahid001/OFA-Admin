import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import { beforeApplication, getApplications } from './LoanApplications.action'
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import queryString from 'query-string';
const LoanApplications = (props) => {
    const dispatch = useDispatch()
    const [Page, setPage] = useState(1)
    //General
    const [pagination, setPagination] = useState(null)
    const [applications, setApplications] = useState(null)
    const [loader, setLoader] = useState(false)
    const [applicationModal, setApplicationModal] = useState(false)
    const [application, setApplication] = useState(null)
    const [permissions, setPermissions] = useState({})


    useEffect(() => {
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
      
        window.scroll(0, 0)
        props.getApplications(qs, {})
        props.beforeApplication()
    }, [])

    useEffect(() => {
        if (props.application.getApplicationsAuth) {
            let { applications, pagination } = props.application
            setApplications(applications)
            setPagination(pagination)
            props.beforeApplication()
        }
    }, [props.application.getApplicationsAuth])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    }, [props.getRoleRes])
    const onPageChange = async (page) => {
        const filter = {}
        
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
    }


    const setModal = (applicationId) => {
        setApplicationModal(true)
        setApplication(applications.filter(app => app._id === applicationId)[0])
    }
   
    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className='d-flex justify-content-end mb-2 pr-3'>
                                            <span style={{ color: 'white', fontWeight: 'bold' }}>{`Total : ${pagination?.total}`}</span>
                                        </div>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Loan Applications</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th>Student</th>
                                                        <th>Semester</th>
                                                        <th>Amount (Expectations) PKR </th>
                                                        <th>Amount (Interviewer) PKR </th>
                                                        <th>Amount (Actual) PKR </th>
                                                        <th>Status </th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        applications && applications.map((application,index)=> {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                    <td>
                                                                        {application?.student?.name}<br/>
                                                                        {application?.student?.rollno}<br/>
                                                                        {application?.student?.email}<br/>
                                                                    </td>
                                                                    <td className="text-center">{application?.semester?.semesterName}</td>
                                                                    <td className="text-center">{application?.expectaion ?? 'N/A'} </td>
                                                                    <td className="text-center">{application?.interviewerAllocation ?? 'N/A'} </td>
                                                                    <td className="text-center">{application?.finalAllocation ?? 'N/A'} </td>
                                                                    <td className="text-center">{application?.status} </td>
                                                                    <td className="td-actions">
                                                                        <ul className="list-unstyled mb-0 d-flex">
                                                                            <li className="d-inline-block align-top">
                                                                                    <a
                                                                                        className="btn-action btn-primary"
                                                                                        type="button"
                                                                                        title="View"
                                                                                        variant="info"
                                                                                        onClick={() => setModal(application._id)}
                                                                                    >
                                                                                        <i className="fas fa-eye"></i>
                                                                                    </a>
                                                                            </li>
                                                                        </ul>
                                                                    </td>
                                                                </tr>

                                                            )
                                                        })
                                                    }
                                                    
                                                </tbody>
                                            </Table>
                                            <div className="pb-4">
                                                {pagination &&
                                                    <Pagination
                                                        className="m-3"
                                                        defaultCurrent={1}
                                                        pageSize // items per page
                                                        current={Page > pagination.pages ? pagination.pages : Page} // current active page
                                                        total={pagination.pages} // total pages
                                                        onChange={onPageChange}
                                                        locale={localeInfo}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {
                            application && applicationModal &&
                            <Modal className="modal-primary" onHide={() => setApplicationModal(!applicationModal)} show={applicationModal}
                                backdrop="static" 
                                keyboard={false} 
                                centered 
                                size={'xl'}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                Loan Application for {application?.semester?.semesterName}
                                            </h4>
                                            <h4>
                                                Status: {application.status}
                                                {
                                                    {
                                                        '': 'Pending',
                                                        0: 'Pending',
                                                        1: 'Interviewed',
                                                        2: 'Allocation Done',
                                                        3: 'Rejected'
                                                    }[application.status]
                                                }
                                            </h4> 
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Container fluid>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="flex-fill d-flex align-items-center mb-0">
                                                   <label><h4 className='mt-0'>Student Information</h4></label>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Student Name: </label><span className="field-value"> &nbsp;{application.student.name}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Student Roll #: </label><span className="field-value"> &nbsp;{application.student.rollno}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Father / Guardian Name: </label><span className="field-value"> &nbsp;{application.student.fatherGuardianName}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Father / Guardian Mobile: </label><span className="field-value"> &nbsp;{application.student.fatherGuardianMobile}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Father / Guardian Occupation: </label><span className="field-value"> &nbsp;{application.student.fatherGuardianOccupation}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Current CGPA: </label><span className="field-value"> &nbsp;{application.cgpa}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Academic Record: </label><span className="field-value"> &nbsp;{application.academicDetails}</span>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="flex-fill d-flex align-items-center mb-0">
                                                   <label><h4 className='mt-0'>Previous Loan Information</h4></label>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Total Loan taken from OSAF: </label><span className="field-value"> &nbsp;{application.totalLoanTakenByOsaf}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Last semester Loan taken forom OSAF : </label><span className="field-value"> &nbsp;{application.lastAllocationSemester}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Amount taken last time from OSAF: </label><span className="field-value"> &nbsp;{application.lastAllocationAmount}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">FAST Loan Percentage: </label><span className="field-value"> &nbsp;{application.fastLoanPercentage}</span>
                                                </Form.Group>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Current Expectation From OSAF: </label><span className="field-value"> &nbsp;{application.expectation}</span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="text-center">
                                                    <label><h4>Family Income Sources / Amounts</h4></label>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Father / Guardian Income: </label><span className="field-value"> &nbsp;{application.fatherIncome}</span>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Mother Income: </label><span className="field-value"> &nbsp;{application.motherIncome}</span>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Siblings Income: </label><span className="field-value"> &nbsp;{application.siblingIncome}</span>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Other Relative Income: </label><span className="field-value"> &nbsp;{application.otherRelativeIncome}</span>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Family Property: </label><span className="field-value"> &nbsp;{application.familyProperty}</span>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="flex-fill d-flex align-items-center">
                                                    <label className="label-font PhoneMr-2">Other Sources: </label><span className="field-value"> &nbsp;{application.otherIncomeSources}</span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="text-center">
                                                    <label><h4>Expenses / Assets Details</h4></label>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Nature of Accomodation: </label>
                                                    <p className="field-value"> &nbsp;{application.natureOfAccomodation}</p>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Vehicles: </label>
                                                    <p className="field-value"> &nbsp;{application.vehiclesOwned}</p>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Educational cost of family members: </label>
                                                    <p className="field-value"> &nbsp;{application.educationCostOtherFamilyMembers}</p>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Other significant expenses: </label>
                                                    <p className="field-value"> &nbsp;{application.educationExpensePerMonth}</p>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Annual Electricity Bill: </label>
                                                    <p className="field-value"> &nbsp;{application.annualElectricityBill}</p>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Annual Other Bill: </label>
                                                    <p className="field-value"> &nbsp;{application.annualOtherBill}</p>
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Notes from Student: </label>
                                                    <p className="field-value"> &nbsp;{application.additionalNotes}</p>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="text-center">
                                                    <label><h4>Interviewer Details</h4></label>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Name: </label>
                                                    <p className="field-value"> &nbsp;{application?.interviewer?.name}</p>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Allocation: </label>
                                                    <p className="field-value"> &nbsp;{application?.interviewerAllocation}</p>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Final Allocation: </label>
                                                    {
                                                    ['', 0, 1].includes(application.status) ? 
                                                    <p>{application?.finalAllocation}</p>
                                                    :
                                                    <Form.Control value={application?.finalAllocation} type="number" placeholder="100000" onChange={(e) => setApplication({...application,finalAllocation: e.target.value})} /*onKeyDown={} */ />
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="align-items-center">
                                                    <label className="label-font PhoneMr-2">Comments: </label>
                                                    <p className="field-value"> &nbsp;{application?.interviewerComments}</p>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="success"  onClick={() => console.log('Submit')}>Submit Final Allocation</Button>
                                                
                                    <Button className="btn btn-info" onClick={() => setApplicationModal(!applicationModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
        }

const mapStateToProps = state => ({
    application: state.application,
    error: state.error,
    getRoleRes: state.role.getRoleRes,

});

export default connect(mapStateToProps, {beforeApplication, getApplications})(LoanApplications);