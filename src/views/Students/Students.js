import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeStudent, getStudents, deleteStudent, createStudent, editStudent, addAddress, deleteStudentAddress, sendVerificationEmail, uploadExtract } from './Students.action';
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
import Select from "react-select";
import queryString from 'query-string';
import {getCities} from "countries-cities";
import axios from 'axios';
const Students = (props) => {
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
    //student properties
    const [profileImage, setProfileImage] = useState('')
    
    const [name, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [status, setStatus] = useState(false)
    const [batch, setBatch] = useState('')
    const [rollno, setRollNo] = useState('')
    const [fatherGuardianName , setGuardianName] = useState('')
    
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [studentId, setStudentId] = useState('')

    //General
    const [pagination, setPagination] = useState(null)
    const [userModal, setUserModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [students, setStudents] = useState(null)
    const [student, setStudent] = useState(null)
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
        props.getStudents(qs, filter)
        const qs1 = ENV.objectToQueryString({ all: 1 })
    }, [])


    useEffect(() => {
        if (props.student.getStudentAuth) {
            let { students, pagination } = props.student
            setStudents(students)
            setPagination(pagination)
            props.beforeStudent()
        }
    }, [props.student.getStudentAuth])


    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    }, [props.getRoleRes])
 

    useEffect(() => {
        if (props.student.upsertExtractAuth) {
            setCompanyRegistrationExtact(ENV.extractPath+props.student.extractPath)
            props.beforeStudent()
            setLoader(false)
            
        }
    }, [props.student.upsertExtractAuth])
    useEffect(() => {
        if (props.student.upsertStudentAuth) {
            setLoader(true)
            let filtered = students.filter((item) => {
                if (item._id !== props.student.studentId)
                    return item
            })
            setStudents([...filtered, props.student.student])
            setLoader(false)
            const filter = {}
            if (searchName) {
                filter.name = searchName
            }
            if (searchEmail) {
                filter.email = searchEmail
            }

            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            props.getStudents(qs, filter)

            props.beforeStudent()
            setLoader(false)
            
        }
    }, [props.student.upsertStudentAuth])

    useEffect(() => {
        if (props.student.verificationAuth) {
            props.beforeStudent()
        }
    }, [props.student.verificationAuth])
    useEffect(() => {
        if (props.student.deleteStudentAuth) {
            const filter = {}
            if (searchName) {
                filter.name = searchName
            }
            if (searchEmail) {
                filter.email = searchEmail
            }
            const qs = ENV.objectToQueryString({ page: Page, limit: 10 })
            window.scroll(0, 0)
            props.getStudents(qs, filter)
            props.beforeStudent()
        }
    }, [props.student.deleteStudentAuth])

    useEffect(() => {
        if (students) {
            setLoader(false)
            if (userId) {
                setModal(3, userId)
            }
            if (userModal) {
                getStudent(studentId)
            }
        }
    }, [students])

    // when an error is received
    useEffect(() => {
        if (props.error.error)
            setLoader(false)
    }, [props.error.error])

    // student Modal Settings Start

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
    const setModal = (type = 0, studentId = null) => {
        initalizeStates()
        setUserModal(!userModal)
        setModalType(type)
        setLoader(false)
        // add student
        if (type === 1) {
            let student = {
                profileImage: '', name: '', email: '', password: ''
            }
            setStudent(student)
        }
        // edit or view student
        else if ((type === 2 || type === 3) && studentId) {
            setStudentId(studentId)
            getStudent(studentId)
        }
    }
    
    const getStudent = async (studentId) => {
        setLoader(true)
        const studentData = await students.find((elem) => String(elem._id) === String(studentId))
        if (studentData) {
            setStudent({ ...studentData })
            setProfileImage(studentData.profileImage ? studentData.profileImage : '')
            setUsername(studentData.name ? studentData.name : '')
            setPassword('')
            setConfirmPassword('')
            setEmail(studentData.email)
            setMobile(studentData.mobile)
        }
        setLoader(false)
    }

    const submit = (Id) => {
        let check = true
        if (validator.isEmpty(name)) {
            setUsernameMsg('Student Name is required')
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
                    rollno, 
                    name, 
                    email, 
                    fatherGuardianName, 
                    batch, 
                    mobile, 
                    status, 
                    password }
                setLoader(true)
                dispatch(editStudent(Id, payload));
            }

            if (modalType === 1) { // add modal type
                setLoader(true)
                let payload = { 
                    profileImage, 
                    rollno, 
                    name, 
                    email, 
                    fatherGuardianName, 
                    batch, 
                    mobile, 
                    status }
                dispatch(createStudent(payload));
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
        props.getStudents(qs, filter, true)
    }

    const deleteStudent = (studentId) => {
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
                props.deleteStudent(studentId)
            }
        })
    }
    const deleteStudentAddress = (studentId, addressId) => {
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
                props.deleteStudentAddress(studentId, addressId)
            }
        })
    }
    const sendVerificationEmail = (studentId) => {
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
                props.sendVerificationEmail(studentId)
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
        props.getStudents(qs, filter)
        setLoader(true)
    }

    const reset = () => {
        setSearchName('')
        setSearchEmail('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getStudents(qs)
        setLoader(true)
    }


    const CountriesOptions = countries?.map(country => ({
        label: country.name,
        value: country.name
    }))
    const extractSelectHandler = (e) => {
        props.uploadExtract(e, studentId);
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
                                            <Card.Title as="h4">Students</Card.Title>
                                            {
                                                permissions && permissions.addStudent &&
                                                <Button
                                                    variant="info"
                                                    className="float-sm-right"
                                                    onClick={() => setModal(1)}
                                                >
                                                    Add Student
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
                                                        <th>Roll #</th>
                                                        <th>Batch</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        students && students.length ?
                                                            students.map((cust, index) => {
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
                                                                            {cust.rollno}
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
                                                                                        permissions && permissions.editStudent &&
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
                                                                                            permissions && permissions.deleteStudent &&
                                                                                                <a
                                                                                                    className="btn-action btn-danger"
                                                                                                    type="button"
                                                                                                    title="Delete"
                                                                                                    variant="info"
                                                                                                    onClick={() => deleteStudent(cust._id)}
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
                                                                    <div className="alert alert-info" role="alert">No Student Found</div>
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
                        {/*Student View Model*/}
                        {/*  */}
                        {
                            modalType === 2 && student &&
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
                                                    <img src={student.profileImage ? student.profileImage : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} />
                                                </div>
                                            </div>
                                        </Form.Group>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font PhoneMr-2">Student Name: </label><span className="field-value">{student.name ? student.name : "N/A"}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Email: </label><span className="field-value">{student.email ? student.email : "N/A"}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Mobile: </label><span className="field-value">{student.mobile ? student.mobile : "N/A"}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Status: </label><span className="field-value">{student.status ? 'Active' : "In Active"}</span>
                                            </Form.Group>
                                        </div>
                                       
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                            <label className="label-font mr-2">Company Type: </label><span className="field-value">{student.companyType ? 'Company' : "Individual"}</span>
                                            </Form.Group>
                                        </div>
                                        {student.companyType ?
                                        <>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Company Name: </label><span className="field-value">{student.companyName}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Company URL: </label><span className="field-value">{student.companyURL}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Company VAT: </label><span className="field-value">{student.companyVAT}</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex name-email">
                                            <Form.Group className="flex-fill d-flex align-items-center">
                                                <label className="label-font mr-2">Company Registration Extract: </label><span className="field-value"><a href={student.companyRegistrationExtact}  target="_blank">View Extract</a></span>
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
                                            student.addresses && student.addresses.length ?
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
                                                                student.addresses.map((address, index) => {
                                                                    
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
                                                                                                onClick={() => deleteStudentAddress(student._id, address._id)}
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
                        {/*Student Add/Edit Model*/}
                        {/*  */}
                        {
                            (modalType === 1 || modalType === 3) && student &&
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
                                                Student Information
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
                                            <label>Student Name <span className="text-danger">*</span></label>
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
                                            <label>Roll #</label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="rollno"
                                                onChange={(e) => setRollNo(e.target.value)}
                                                value={rollno}
                                                required
                                            />
                                            <span className={phoneMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{phoneMsg}</label>
                                            </span>
                                        </Form.Group>
                                        
                                        <Form.Group>
                                            <label>Father / Guardian Name</label>
                                            <Form.Control
                                                // placeholder="Enter Game Name"
                                                disabled={props.modalType === 2}
                                                type="text"
                                                name="fatherGuardianName"
                                                onChange={(e) => setGuardianName(e.target.value)}
                                                value={fatherGuardianName }
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
                                            <Button className="btn btn-info" onClick={() => submit(student._id)} /* disabled={isLoader} */>Save</Button>
                                    }
                                    {
                                        modalType === 1 ? '' :
                                            <Button className="btn btn-info" onClick={() => submit(student._id)} /* disabled={isLoader} */>Update</Button>
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
    student: state.student,
    countries: state.countries,
    error: state.error,
    getRoleRes: state.role.getRoleRes,

});

export default connect(mapStateToProps, { beforeStudent, getStudents, deleteStudent, createStudent, editStudent, addAddress, deleteStudentAddress, sendVerificationEmail, uploadExtract })(Students);