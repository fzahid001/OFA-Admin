import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeSemester, getSemesters, deleteSemester, createSemester, editSemester} from './Semesters.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import userDefaultImg from '../../assets/img/placeholder.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, } from '@fortawesome/free-solid-svg-icons'
import validator from 'validator';
import queryString from 'query-string';
const Semesters = (props) => {
    const { userId } = queryString.parse(location.search);
    const dispatch = useDispatch()
    const [Page, setPage] = useState(1)
    const [permissions, setPermissions] = useState(1)
    ///Msg
    const [semesterNameMsg, setSemesterNameMsg] = useState('')
    //semester properties
    const [semesterName, setSemesterName] = useState('')
    const [semesterAllocation, setSemesterAllocation] = useState('')
    const [totalAllocation, setTotalAllocation] = useState('')
    const [semesterId, setSemesterId] = useState('')

    //General
    const [pagination, setPagination] = useState(null)
    const [semesterModal, setSemesterModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [semesters, setSemesters] = useState(null)
    const [semester, setSemester] = useState(null)
    
    const [loader, setLoader] = useState(true)
    const [searchName, setSearchName] = useState('')



    useEffect(() => {
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        const filter = {}
        if (searchName !== undefined && searchName !== null && searchName !== '')
            filter.semesterName = searchName
        window.scroll(0, 0)
        props.getSemesters(qs, filter)
        const qs1 = ENV.objectToQueryString({ all: 1 })
    }, [])

    useEffect(() => {
        if (props.semester.getSemesterAuth) {
            let { semesters, pagination } = props.semester
            setSemesters(semesters)
            setPagination(pagination)
            props.beforeSemester()
        }
    }, [props.semester.getSemesterAuth])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    }, [props.getRoleRes])
 
    useEffect(() => {
        if (props.semester.upsertSemesterAuth) {
            setLoader(true)
            let filtered = semesters.filter((item) => {
                if (item._id !== props.semester.semesterId)
                    return item
            })
            setSemesters([...filtered, props.semester.semester])
            setLoader(false)
            const filter = {}
            if (searchName) {
                filter.semesterName = searchName
            }

            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            props.getSemesters(qs, filter)

            props.beforeSemester()
            setLoader(false)
            
        }
    }, [props.semester.upsertSemesterAuth])

    useEffect(() => {
        if (props.semester.deleteSemesterAuth) {
            const filter = {}
            if (searchName) {
                filter.semesterName = searchName
            }
            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            window.scroll(0, 0)
            props.getSemesters(qs, filter)
            props.beforeSemester()
        }
    }, [props.semester.deleteSemesterAuth])

    useEffect(() => {
        if (semesters) {
            setLoader(false)
            if (userId) {
                setModal(3, userId)
            }
            if (semesterModal) {
                getSemester(semesterId)
            }
        }
    }, [semesters])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // semester Modal Settings Start
    const initalizeStates = () => {
        setSemesterName('')
        setTotalAllocation('')
        
        setSemesterNameMsg('')
    }
    // set modal type
    const setModal = (type = 0, semesterId = null) => {
        initalizeStates()
        setSemesterModal(!semesterModal)
        setModalType(type)
        setLoader(false)
        // add semester
        if (type === 1) {
            let semester = {
                semesterName: '', totalAllocation: ''
            }
            setSemester(semester)
        }
        // edit or view semester
        else if ((type === 2 || type === 3) && semesterId) {
            setSemesterId(semesterId)
            getSemester(semesterId)
        }
    }
    
    const getSemester = async (semesterId) => {
        setLoader(true)
        const semesterData = await semesters.find((elem) => String(elem._id) === String(semesterId))
        if (semesterData) {
            setSemester({ ...semesterData })
            setSemesterName(semesterData.semesterName)
            setTotalAllocation(semesterData.totalAllocation)
        }
        setLoader(false)
    }

    const submit = (Id) => {
        let check = true
        if (validator.isEmpty(semesterName)) {
            setSemesterNameMsg('Semester Name is required')
            check = false
        } else setSemesterNameMsg('')

        if (check) {
            let payload = { 
                semesterName, 
                totalAllocation 
            }
            if (modalType === 3) { // add modal type
                setLoader(true)
                dispatch(editSemester(Id, payload));
            }

            if (modalType === 1) { // add modal type
                setLoader(true)
                dispatch(createSemester(payload));
            }
            setSemesterModal(!semesterModal)
        }
        else {
        }

    }

    const updateSemesterStatus = async (status, Id) => {
        console.log('aaaaaa')
        console.log(status, Id)
        dispatch(editSemester(Id, {hasEnded: !status}));
    }

    const onPageChange = async (page) => {
        const filter = {}
        if (searchName) {
            filter.semesterName = searchName
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        props.getSemesters(qs, filter, true)
    }

    const deleteSemester = (semesterId) => {
        Swal.fire({
            title: 'Are you sure you want to delete?',
            html: 'If you delete an item, it would be permanently lost.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.deleteSemester(semesterId)
            }
        })
    }
    const applyFilters = () => {
        const filter = {}
        if (searchName) {
            filter.semesterName = searchName
        }
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getSemesters(qs, filter)
        setLoader(true)
    }

    const reset = () => {
        setSearchName('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getSemesters(qs)
        setLoader(true)
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row className="pb-3">
                            <Col sm={12}>
                                <Card className="filter-card">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Filters</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Semester Name</label>
                                                    <Form.Control value={searchName} type="text" placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" disabled={!searchName} onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchName} onClick={reset}>Reset</Button>
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className='d-flex justify-content-end mb-2 pr-3'>
                                            <span style={{ color: 'white', fontWeight: 'bold' }}>{`Total : ${pagination?.total}`}</span>
                                        </div>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Semesters</Card.Title>
                                            {
                                                permissions && permissions.addSemester &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right"
                                                    onClick={() => setModal(1)}
                                                >
                                                    Add Semester
                                                </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th>Name</th>
                                                        <th>Status</th>
                                                        <th>Allocation</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        semesters && semesters.length ?
                                                            semesters.map((semester, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td>
                                                                            {semester.semesterName}
                                                                        </td>
                                                                        <td>
                                                                        <Form.Check 
                                                                            type="switch"
                                                                            id={'check'+semester._id}
                                                                            checked={semester.hasEnded ? '': 'checked'}
                                                                            onChange={(e) => updateSemesterStatus(e.target.checked, semester._id) }
                                                                        />
                                                                        </td>
                                                                        <td>
                                                                            {semester.totalAllocation}
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex">
                                                                                <li className="d-inline-block align-top">
                                                                                        <a
                                                                                            className="btn-action btn-primary"
                                                                                            type="button"
                                                                                            title="View"
                                                                                            variant="info"
                                                                                            onClick={() => setModal(2, semester._id)}
                                                                                        >
                                                                                            <i className="fas fa-eye"></i>
                                                                                        </a>
                                                                                </li>
                                                                                <li className="d-inline-block align-top">
                                                                                    {
                                                                                        permissions && permissions.editSemester &&
                                                                                            <a
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                title="Edit"
                                                                                                variant="info"
                                                                                                onClick={() => setModal(3, semester._id)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </a>
                                                                                    }
                                                                                    <div className="d-inline-block align-top">
                                                                                        {
                                                                                            permissions && permissions.deleteSemester &&
                                                                                                <a
                                                                                                    className="btn-action btn-danger"
                                                                                                    type="button"
                                                                                                    title="Delete"
                                                                                                    variant="info"
                                                                                                    onClick={() => deleteSemester(semester._id)}
                                                                                                >
                                                                                                    <i className="fas fa-trash"></i>
                                                                                                </a>
                                                                                        }
                                                                                    </div>
                                                                                </li>
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Semester Found</div>
                                                                </td>
                                                            </tr>
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
                        {/*  */}
                        {/*Semester View Model*/}
                        {/*  */}
                        {
                            modalType === 2 && semester &&
                            <Modal className="modal-primary" onHide={() => setSemesterModal(!semesterModal)} show={semesterModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                View
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font PhoneMr-2">Semester Name: </label><span className="field-value">{semester.semesterName ? semester.semesterName : "N/A"}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font PhoneMr-2">Total Allocation: </label><span className="field-value">{semester.totalAllocation ? semester.totalAllocation : "N/A"}</span>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-info" onClick={() => setSemesterModal(!semesterModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                        {/*  */}
                        {/*Semester Add/Edit Model*/}
                        {/*  */}
                        {
                            (modalType === 1 || modalType === 3) && semester &&
                            <Modal className="modal-primary" onHide={() => setSemesterModal(!semesterModal)} show={semesterModal}>
                                {/* {
                                    formValid ?
                                        <div className="text-danger">Please fill the required fields</div> : null
                                } */}
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add ' : modalType === 3 ? 'Edit ' : ''}
                                                Semester Information
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <Form.Group>
                                            <Row>
                                                <Col md={12}>
                                                    <label>Semester Name <span className="text-danger">*</span></label>
                                                    <Form.Control
                                                        // placeholder="Enter Game Name"
                                                        disabled={props.modalType === 2}
                                                        type="text"
                                                        name="name"
                                                        onChange={(e) => setSemesterName(e.target.value)}
                                                        value={semesterName}
                                                        required
                                                    />
                                                    <span className={semesterNameMsg ? `` : `d-none`}>
                                                        {(semesterName === '' || semesterName === null) && <label className="pl-1 text-danger">{semesterNameMsg}</label>}
                                                    </span>
                                                </Col>
                                                <Col md={12}>
                                                    <label>Semester Allocation <span className="text-danger">*</span></label>
                                                    <Form.Control
                                                        // placeholder="Enter Game Name"
                                                        disabled={props.modalType === 2}
                                                        type="number"
                                                        name="name"
                                                        onChange={(e) => setTotalAllocation(e.target.value)}
                                                        value={totalAllocation}
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning"
                                        onClick={() => setSemesterModal(!semesterModal)}
                                    >Close</Button>
                                    {
                                        modalType === 3 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(semester._id)} /* disabled={isLoader} */>Save</Button>
                                    }
                                    {
                                        modalType === 1 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(semester._id)} /* disabled={isLoader} */>Update</Button>
                                    }

                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
        }

const mapStateToProps = state => ({
    semester: state.semester,
    countries: state.countries,
    error: state.error,
    getRoleRes: state.role.getRoleRes,

});

export default connect(mapStateToProps, { beforeSemester, getSemesters, deleteSemester, createSemester, editSemester })(Semesters);