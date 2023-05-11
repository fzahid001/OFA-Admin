import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeInterviewer, getInterviewers, deleteInterviewer, createInterviewer, editInterviewer, addAddress, deleteInterviewerAddress, sendVerificationEmail, uploadExtract } from './Interviewers.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import userDefaultImg from '../../assets/img/placeholder.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faUserSecret, faUsers, faCheckCircle, } from '@fortawesome/free-solid-svg-icons'
import validator from 'validator';
import queryString from 'query-string';

const Interviewers = (props) => {
    const { userId } = queryString.parse(location.search);
    const dispatch = useDispatch()
    const [Page, setPage] = useState(1)
    ///Msg
    const [profileImageMsg, setProfileImageMsg] = useState('')
    const [usernameMsg, setUsernameMsg] = useState('')
    const [emailMsg, setEmailMsg] = useState('')
    const [phoneMsg, setPhoneMsg] = useState('')
    const [formValid, setFormValid] = useState('')
    
    
    const [passwordMsg, setPasswordMsg] = useState('')
    const [confirmPasswordMsg, setConfirmPasswordMsg] = useState('')
    //interviewer properties
    const [profileImage, setProfileImage] = useState('')
    
    const [name, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [status, setStatus] = useState(false)
    const [batch, setBatch] = useState('')
    
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [interviewerId, setInterviewerId] = useState('')

    //General
    const [pagination, setPagination] = useState(null)
    const [userModal, setUserModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [interviewers, setInterviewers] = useState(null)
    const [interviewer, setInterviewer] = useState(null)
    const [loader, setLoader] = useState(true)
    const [searchName, setSearchName] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
    const [permissions, setPermissions] = useState({})

    const [countries, setCountries] = useState()


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword2] = useState(false);

    const showPasswordMethod = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword)
    }
    const showConfirmPasswordMethod = (e) => {
        e.preventDefault();
        setConfirmPassword2(!showConfirmPassword)
    }

    useEffect(() => {
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        const filter = {}
        if (searchName !== undefined && searchName !== null && searchName !== '')
            filter.name = searchName
        if (searchEmail !== undefined && searchEmail !== null && searchEmail !== '')
            filter.email = searchEmail
        window.scroll(0, 0)
        props.getInterviewers(qs, filter)
        const qs1 = ENV.objectToQueryString({ all: 1 })
    }, [])


    useEffect(() => {
        if (props.interviewer.getInterviewerAuth) {
            let { interviewers, pagination } = props.interviewer
            setInterviewers(interviewers)
            setPagination(pagination)
            props.beforeInterviewer()
        }
    }, [props.interviewer.getInterviewerAuth])


    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    }, [props.getRoleRes])
 

    useEffect(() => {
        if (props.interviewer.upsertExtractAuth) {
            setCompanyRegistrationExtact(ENV.extractPath+props.interviewer.extractPath)
            props.beforeInterviewer()
            setLoader(false)
            
        }
    }, [props.interviewer.upsertExtractAuth])
    useEffect(() => {
        if (props.interviewer.upsertInterviewerAuth) {
            setLoader(true)
            let filtered = interviewers.filter((item) => {
                if (item._id !== props.interviewer.interviewerId)
                    return item
            })
            setInterviewers([...filtered, props.interviewer.interviewer])
            setLoader(false)
            const filter = {}
            if (searchName) {
                filter.name = searchName
            }
            if (searchEmail) {
                filter.email = searchEmail
            }

            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            props.getInterviewers(qs, filter)

            props.beforeInterviewer()
            setLoader(false)
            
        }
    }, [props.interviewer.upsertInterviewerAuth])

    useEffect(() => {
        if (props.interviewer.verificationAuth) {
            props.beforeInterviewer()
        }
    }, [props.interviewer.verificationAuth])
    useEffect(() => {
        if (props.interviewer.deleteInterviewerAuth) {
            const filter = {}
            if (searchName) {
                filter.name = searchName
            }
            if (searchEmail) {
                filter.email = searchEmail
            }
            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            window.scroll(0, 0)
            props.getInterviewers(qs, filter)
            props.beforeInterviewer()
        }
    }, [props.interviewer.deleteInterviewerAuth])

    useEffect(() => {
        if (interviewers) {
            setLoader(false)
            if (userId) {
                setModal(3, userId)
            }
            if (userModal) {
                getInterviewer(interviewerId)
            }
        }
    }, [interviewers])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // interviewer Modal Settings Start

    const initalizeStates = () => {
        setProfileImage('')
        setUsername('')
        setEmail('')
        setMobile('')
        setStatus(false)
        
        setPassword('')
        setConfirmPassword('')

        setProfileImageMsg('')
        setUsernameMsg('')
        setEmailMsg('')
        setPasswordMsg('')
        setConfirmPasswordMsg('')
    }
    // set modal type
    const setModal = (type = 0, interviewerId = null) => {
        initalizeStates()
        setUserModal(!userModal)
        setModalType(type)
        setLoader(false)
        // add interviewer
        if (type === 1) {
            let interviewer = {
                profileImage: '', name: '', email: '', password: ''
            }
            setInterviewer(interviewer)
        }
        // edit or view interviewer
        else if ((type === 2 || type === 3) && interviewerId) {
            setInterviewerId(interviewerId)
            getInterviewer(interviewerId)
        }
    }
    
    const getInterviewer = async (interviewerId) => {
        setLoader(true)
        const interviewerData = await interviewers.find((elem) => String(elem._id) === String(interviewerId))
        if (interviewerData) {
            setInterviewer({ ...interviewerData })
            setProfileImage(interviewerData.profileImage ? interviewerData.profileImage : '')
            setUsername(interviewerData.name ? interviewerData.name : '')
            setPassword('')
            setConfirmPassword('')
            setEmail(interviewerData.email)
            setMobile(interviewerData.mobile)
        }
        setLoader(false)
    }

    const submit = (Id) => {
        let check = true
        if (validator.isEmpty(name)) {
            setUsernameMsg('Interviewer Name is required')
            check = false
        } else setUsernameMsg('')

        if (validator.isEmpty(email)) {
            setEmailMsg('Email is Required.')
            check = false
        } else {
            if (!validator.isEmpty(email) && !validator.isEmail(email)) {
                setEmailMsg('Please enter a valid email address.')
                check = false
            }
            else { setEmailMsg('') }
        }

        if (modalType === 3) {

            if (validator.isEmpty(password)) {
                if (modalType !== 3) {
                    setPasswordMsg('Password is Required.')
                    check = false
                }
            }
            else {
                setPasswordMsg('')
            }

            if (validator.isEmpty(confirmPassword)) {
                if (modalType !== 3 || !validator.isEmpty(password)) {
                    setConfirmPasswordMsg('Confirm password is Required.')
                    check = false
                }
            }
            else {
                if (!validator.equals(password, confirmPassword)) {

                    setConfirmPasswordMsg('Passwords do not match')
                    check = false
                }
                else {
                    setConfirmPasswordMsg('')
                }
            }

        }



        if (check) {
            setFormValid(false)

            if (modalType === 3) { // add modal type
                let payload = { 
                    profileImage, 
                    name, 
                    email, 
                    batch, 
                    mobile, 
                    status, 
                    password }
                setLoader(true)
                dispatch(editInterviewer(Id, payload));
            }

            if (modalType === 1) { // add modal type
                setLoader(true)
                let payload = { 
                    profileImage, 
                    name, 
                    email, 
                    batch, 
                    mobile, 
                    status }
                dispatch(createInterviewer(payload));
            }
            setUserModal(!userModal)
        }
        else {
            setFormValid(true)
        }

    }
    const fileSelectHandler = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setProfileImage(reader.result);
        };
        // setImageFile(files[0]);
        reader.readAsDataURL(files[0]);
    };
    const onPageChange = async (page) => {
        const filter = {}
        if (searchName) {
            filter.name = searchName
        }
        if (searchEmail) {
            filter.email = searchEmail
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page, limit: 10 })
        props.getInterviewers(qs, filter, true)
    }

    const deleteInterviewer = (interviewerId) => {
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
                props.deleteInterviewer(interviewerId)
            }
        })
    }
    const deleteInterviewerAddress = (interviewerId, addressId) => {
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
                props.deleteInterviewerAddress(interviewerId, addressId)
            }
        })
    }
    const sendVerificationEmail = (interviewerId) => {
        Swal.fire({
            title: 'Are you sure you want to resend verification email?',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Send Email'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.sendVerificationEmail(interviewerId)
            }
        })
    }

    const applyFilters = () => {
        const filter = {}
        if (searchName) {
            filter.name = searchName
        }
        if (searchEmail) {
            filter.email = searchEmail
        }
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getInterviewers(qs, filter)
        setLoader(true)
    }

    const reset = () => {
        setSearchName('')
        setSearchEmail('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getInterviewers(qs)
        setLoader(true)
    }


    const CountriesOptions = countries?.map(country => ({
        label: country.name,
        value: country.name
    }))
    const extractSelectHandler = (e) => {
        props.uploadExtract(e, interviewerId);
    };
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
                                                    <label style={{ color: 'white' }}>Name</label>
                                                    <Form.Control value={searchName} type="text" placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{ color: 'white' }}>Email</label>
                                                    <Form.Control value={searchEmail} type="text" placeholder="john@gmail.com" onChange={(e) => setSearchEmail(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info" disabled={!searchName && !searchEmail} onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchName && !searchEmail} onClick={reset}>Reset</Button>
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
                                            <Card.Title as="h4">Interviewers</Card.Title>
                                            {
                                                permissions && permissions.addInterviewer &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right"
                                                    onClick={() => setModal(1)}
                                                >
                                                    Add Interviewer
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
                                                        <th>Email</th>
                                                        <th>Contact</th>
                                                        <th>Batch</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        interviewers && interviewers.length ?
                                                            interviewers.map((cust, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td>
                                                                            {cust.name}
                                                                        </td>
                                                                        <td>
                                                                            {cust.email}
                                                                        </td>
                                                                        <td>
                                                                            {cust.mobile}
                                                                        </td>
                                                                        <td>
                                                                            {cust.batch}
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0 d-flex">
                                                                                <li className="d-inline-block align-top">
                                                                                        <a
                                                                                            className="btn-action btn-primary"
                                                                                            type="button"
                                                                                            title="Send Verification Email"
                                                                                            variant="info"
                                                                                            onClick={() => sendVerificationEmail(cust._id)}
                                                                                        >
                                                                                            <i className="fa fa-envelope"></i>
                                                                                        </a>
                                                                                </li>
                                                                                <li className="d-inline-block align-top">
                                                                                        <a
                                                                                            className="btn-action btn-primary"
                                                                                            type="button"
                                                                                            title="View"
                                                                                            variant="info"
                                                                                            onClick={() => setModal(2, cust._id)}
                                                                                        >
                                                                                            <i className="fas fa-eye"></i>
                                                                                        </a>
                                                                                </li>
                                                                                <li className="d-inline-block align-top">
                                                                                    {
                                                                                        permissions && permissions.editInterviewer &&
                                                                                            <a
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                title="Edit"
                                                                                                variant="info"
                                                                                                onClick={() => setModal(3, cust._id)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </a>
                                                                                    }
                                                                                    <div className="d-inline-block align-top">
                                                                                        {
                                                                                            permissions && permissions.deleteInterviewer &&
                                                                                                <a
                                                                                                    className="btn-action btn-danger"
                                                                                                    type="button"
                                                                                                    title="Delete"
                                                                                                    variant="info"
                                                                                                    onClick={() => deleteInterviewer(cust._id)}
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
                                                                    <div className="alert alert-info" role="alert">No Interviewer Found</div>
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
                        {/*Interviewer View Model*/}
                        {/*  */}
                        {
                            modalType === 2 && interviewer &&
                            <Modal className="modal-primary" onHide={() => setUserModal(!userModal)} show={userModal}>
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
                                        <Form.Group>
                                            <label className="label-font mr-2">Profile Image: </label>
                                            <div>
                                                <div className="user-view-image">
                                                    <img src={interviewer.profileImage ? interviewer.profileImage : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} />
                                                </div>
                                            </div>
                                        </Form.Group>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font PhoneMr-2">Interviewer Name: </label><span className="field-value">{interviewer.name ? interviewer.name : "N/A"}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Email: </label><span className="field-value">{interviewer.email ? interviewer.email : "N/A"}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Mobile: </label><span className="field-value">{interviewer.mobile ? interviewer.mobile : "N/A"}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Status: </label><span className="field-value">{interviewer.status ? 'Active' : "In Active"}</span>
                                            </Form.Group>
                                        </div>
                                       
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                            <label className="label-font mr-2">Company Type: </label><span className="field-value">{interviewer.companyType ? 'Company' : "Individual"}</span>
                                            </Form.Group>
                                        </div>
                                        {interviewer.companyType ?
                                        <>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Company Name: </label><span className="field-value">{interviewer.companyName}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Company URL: </label><span className="field-value">{interviewer.companyURL}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Company VAT: </label><span className="field-value">{interviewer.companyVAT}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Company Registration Extract: </label><span className="field-value"><a href={interviewer.companyRegistrationExtact}  target="_blank">View Extract</a></span>
                                            </Form.Group>
                                        </div>
                                        </>
                                        :''}
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Addresses:</label>
                                            </Form.Group>
                                        </div>
                                        {
                                            interviewer.addresses && interviewer.addresses.length ?
                                            <div className='table-responsive'>
                                                    <Table className="table-bigboy">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center">#</th>
                                                                <th>Address</th>
                                                                <th className="td-actions">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                interviewer.addresses.map((address, index) => {
                                                                    
                                                                    if(address.street && address.street != 'undefined')
                                                                        return (
                                                                            <tr>
                                                                                <td className="label-font">
                                                                                    {index + 1}
                                                                                </td>
                                                                                <td className="label-font">
                                                                                    {address?.street + ', ' + address?.city + ' , ' + address?.zipCode + ',' + address?.country}
                                                                                </td>
                                                                                <td className="label-font">
                                                                                    <div className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={() => (<Tooltip id="tooltip-481441726">Delete</Tooltip>)} >
                                                                                            <a
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => deleteInterviewerAddress(interviewer._id, address._id)}
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </a>
                                                                                        </OverlayTrigger>
                                                                                    </div>
                                                                                </td>

                                                                            </tr>

                                                                        )
                                                                })
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                :
                                                <label className=" mr-2">No Address Found</label>
                                        }
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-info" onClick={() => setUserModal(!userModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                        {/*  */}
                        {/*Interviewer Add/Edit Model*/}
                        {/*  */}
                        {
                            (modalType === 1 || modalType === 3) && interviewer &&
                            <Modal className="modal-primary" onHide={() => setUserModal(!userModal)} show={userModal}>
                                {/* {
                                    formValid ?
                                        <div className="text-danger">Please fill the required fields</div> : null
                                } */}
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 1 ? 'Add ' : modalType === 3 ? 'Edit ' : ''}
                                                Interviewer Information
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <Form.Group>
                                            <label>Profile Image</label>
                                            <div className='mb-2'>
                                                {<img className="img-thumbnail" src={profileImage ? profileImage : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} style={{ width: '100px' }} />}
                                            </div>
                                            <Form.Control
                                                className='text-white'
                                                onChange={async (e) => {
                                                    fileSelectHandler(e);
                                                    const res = await ENV.uploadImage(e);
                                                    setProfileImage(res ? ENV.uploadedImgPath + res : "")
                                                }}
                                                accept="image/*"
                                                type="file"
                                            ></Form.Control>
                                            <span className={profileImageMsg ? `` : `d-none`}>
                                                {(profileImage === '' || profileImage === null) && <label className="pl-1 text-danger">{profileImageMsg}</label>}
                                            </span>
                                        </Form.Group>

                                        <Form.Group>
                                            <label>Interviewer Name <span className="text-danger">*</span></label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="name"
                                                onChange={(e) => setUsername(e.target.value)}
                                                value={name}
                                                required
                                            />
                                            <span className={usernameMsg ? `` : `d-none`}>
                                                {(name === '' || name === null) && <label className="pl-1 text-danger">{usernameMsg}</label>}
                                            </span>
                                        </Form.Group>

                                        <Form.Group>
                                            <label>Batch</label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="batch"
                                                onChange={(e) => setBatch(e.target.value)}
                                                value={batch}
                                                required
                                            />
                                            <span className={phoneMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{phoneMsg}</label>
                                            </span>
                                        </Form.Group>


                                        <Form.Group>
                                            <label>Email <span className="text-danger">*</span></label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                required
                                            />
                                            <span className={emailMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{emailMsg}</label>
                                            </span>
                                        </Form.Group>

                                        <Form.Group>
                                            <label>Mobile</label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="mobile"
                                                onChange={(e) => setMobile(e.target.value)}
                                                value={mobile}
                                                required
                                            />
                                            <span className={phoneMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{phoneMsg}</label>
                                            </span>
                                        </Form.Group>

                                        <Form.Group>
                                            <label className='mr-2'>Status<span className="text-danger"> *</span></label>
                                            <label className="right-label-radio mb-2 mr-2">
                                                <div className='d-flex align-items-center'>
                                                    <input name="status" type="radio" checked={status} value={status} onChange={(e) => { setStatus(true) }} />
                                                    <span className="checkmark"></span>
                                                    <span className='ml-1' onChange={(e) => {
                                                        setStatus(true);
                                                    }} ><i />Active</span>
                                                </div>
                                            </label>
                                            <label className="right-label-radio mr-3 mb-2">
                                                <div className='d-flex align-items-center'>
                                                    <input name="status" type="radio" checked={!status} value={!status} onChange={(e) => { setStatus(false) }} />
                                                    <span className="checkmark"></span>
                                                    <span className='ml-1' onChange={(e) => {
                                                        setStatus(false);
                                                    }} ><i />Inactive</span>
                                                </div>
                                            </label>

                                        </Form.Group>

                                        {
                                              modalType === 3 ?

                                            <Form.Group>
                                                <Form.Group>
                                                    <label>password</label>
                                                    <div className="form-password-eye-box">
                                                        <Form.Control
                                                            // placeholder="Enter Game Name"
                                                            disabled={props.modalType === 2}
                                                            type={showPassword ? "text" : "password"}
                                                            name="description"
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            value={password}
                                                            required
                                                        />
                                                        <button onClick={(e) => showPasswordMethod(e)} className="form-password-eye">
                                                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                                        </button>
                                                    </div>
                                                    <span className={passwordMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{passwordMsg}</label>
                                                    </span>
                                                </Form.Group>
                                                <Form.Group>
                                                    <label>Confirm password</label>
                                                    <div className="form-password-eye-box">
                                                        <Form.Control
                                                            // placeholder="Enter Game Name"
                                                            disabled={props.modalType === 2}
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            name="description"
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            value={confirmPassword}
                                                            required
                                                        />
                                                         <button onClick={(e) => showConfirmPasswordMethod(e)} className="form-password-eye">
                                                            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                                                        </button>
                                                        </div>
                                                        <span className={confirmPasswordMsg ? `` : `d-none`}>
                                                   
                                                    <label className="pl-1 text-danger">{confirmPasswordMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Form.Group>
                                            :
                                            null
                                        }
                                        

                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-warning"
                                        onClick={() => setUserModal(!userModal)}
                                    >Close</Button>
                                    {
                                        modalType === 3 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(interviewer._id)} /* disabled={isLoader} */>Save</Button>
                                    }
                                    {
                                        modalType === 1 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(interviewer._id)} /* disabled={isLoader} */>Update</Button>
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
    interviewer: state.interviewer,
    countries: state.countries,
    error: state.error,
    getRoleRes: state.role.getRoleRes,

});

export default connect(mapStateToProps, { beforeInterviewer, getInterviewers, deleteInterviewer, createInterviewer, editInterviewer, addAddress, deleteInterviewerAddress, sendVerificationEmail, uploadExtract })(Interviewers);