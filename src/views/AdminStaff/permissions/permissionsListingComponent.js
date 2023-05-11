import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../../config/config';
import { beforeRole, updateRole, deleteRole, getRole, getPermission, getRoles } from './permissions.actions'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import validator from 'validator';
import Pagination from 'rc-pagination';
import { Link } from 'react-router-dom'
import 'rc-pagination/assets/index.css';
import PermissionsModal from './permissionsModalComponent'
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Overlay, Tooltip, Modal, FormGroup } from "react-bootstrap";
var CryptoJS = require("crypto-js");



const StaffPermissions = (props) => {
    const [roleModal, setroleModal] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [isLoader, setLoader] = useState(true)
    const [currentUserRole, setCurrentUserRole] = useState({})
    const [currentRoleId, setCurrentRoleId] = useState('')
    const [roles, setRoles] = useState()
    const [search, setSearch] = useState('')
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [total, setTotal] = useState(0)
    const [role, setRole] = useState({
        /**  system permissions **/

        // admin records
        addAdmin: false,
        editAdmin: false,
        deleteAdmin: false,
        viewAdmin: false,

        //email-templates
        editEmails: false,
        viewEmails: false,

        //User Email Templates records
        addEmailTemplate: false,
        editEmailTemplate: false,
        deleteEmailTemplate: false,
        viewEmailTemplate: false,
        
        //Students
        addStudent: false,
        editStudent: false,
        deleteStudent: false,
        viewStudent: false,
        
        //Interviewers
        addInterviewer: false,
        editInterviewer: false,
        deleteInterviewer: false,
        viewInterviewer: false,
        
        //Semester
        addSemester: false,
        editSemester: false,
        deleteSemester: false,
        viewSemester: false,
        
        //LoanApplication
        addLoanApplication: false,
        editLoanApplication: false,
        deleteLoanApplication: false,
        viewLoanApplication: false,

        // settings
        editSetting: false,
        viewSetting: false,

            
        status: true
        // status (i.e: true for active & false for in-active)

    })

    // set modal type
    const setModal = (type = 0, role = {}) => {
        setroleModal(!roleModal)
        setModalType(type)
        setLoader(false)
        if ((type === 2 || type === 3) && role) {
            setRole(role)
        }
        if (type === 1) {
            setEmpty()
            props.getRoles()
        }
        // getCategory(catId)
    }

    const deleteRoleHandler = (roleId) => {
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
                props.deleteRole(roleId)
            }
        })
    }

    const setEmpty = () => {
        for (let key in role) {
            role[key] = false
        }
    }

    const getData = (role) => {
        props.getRoles()
        setRole(role)
    }

  

    const onSearch = () => {
        props.getRoles(1, limit, search)
        setModalType(0)
        setLoader(true)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
        }
    }

    const reset = () => {
        setLoader(true)
        setSearch('')
        props.getRoles()
    }

    const onPageChange = (page) => {
        props.getRoles(page, limit, search)
        setLoader(true)
    }

    useEffect(() => {
        props.getRoles()
        let roleEncrypted = localStorage.getItem('role');
        let role = '';
        if (roleEncrypted) {
            let roleDecrepted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
            props.getPermission(roleDecrepted)
            if (roleDecrepted && roleDecrepted.trim() !== "") {
                role = roleDecrepted
            }
            else {
                ENV.clearStorage();
            }
        }
        setCurrentRoleId(role !== '' ? role : null)
        // setLoader(true)
    }, [])

    // useEffect(()=>{
    //     if (Object.keys(props.addRoleRes).length > 0 && props.authenticate === true) {
    //         // closeModal();
    //         // this.props.role.removeLoader();
    //         setroleModal(!props.roleModal)

    //         setModalType(1)
    //         setLoader(false)
    //         // setEmpty()
    //         // setRole({})

    //         // toast.success(`Success! ${props.addRoleRes.message}`);
    //         props.beforeRole();
    //     }
    // },[props.addRoleRes])


    useEffect(() => {

        if (Object.keys(props.getRolesRes).length > 0) {
            setLoader(false)
            setRoles(props.getRolesRes.data)
            setPage(props.getRolesRes.page)
            setPages(props.getRolesRes.pages)
            setTotal(props.getRolesRes.total)
            setLimit(props.getRolesRes.limit)
            // props.beforeRole();
        }
    }, [props.getRolesRes])

    useEffect(() => {
        if (props.currentUserPermission.authPermission) {
            setCurrentUserRole(props.currentUserPermission.permission.role)
        }

    }, [props.currentUserPermission.authPermission])


    useEffect(() => {
        if (Object.keys(props.deleteRoleRes).length > 0 && props.authenticate === true) {
            setModalType(1)
            setLoader(false)
            toast.success(props.deleteRoleRes.message);
            props.beforeRole();
            props.getRoles();
        }
    }, [props.deleteRoleRes])

    return (
        <>
            {
                isLoader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row>
                            <Col md="12">
                                <Card className="filter-card card">
                                    <Card.Header>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Filters</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6} className="search-wrap">
                                                <Form.Group>
                                                    <Form.Label style={{ color: 'white' }} className="d-block mb-2">Search with title...</Form.Label>
                                                    <Form.Control type="email" onKeyPress={handleKeyPress} placeholder="Title" name="search" value={search} onChange={(e) => setSearch(e.target.value)}></Form.Control>
                                                </Form.Group>
                                                
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label className="d-none d-sm-block mb-2 form-label">&nbsp;</label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <button type="button" className="btn btn-info" disabled={!search} onClick={onSearch} >Search</button>
                                                        <button type="button" className="btn btn-warning" hidden={!search} onClick={reset}>Reset</button>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <Card className="table-big-boy">

                                    <Card.Header>
                                        <div className='d-flex justify-content-end mb-2 pr-3'>
                                            <span style={{ color: 'white', fontWeight: 'bold' }}>{`Total : ${total}`}</span>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Permissions</Card.Title>
                                            <Button variant="info" className="float-sm-right mb-0" onClick={() => setModal(1)}> Add New Staff Role</Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th>Title</th>
                                                        {/* <th>Permissions</th> */}
                                                        <th >Status</th>
                                                        <th className="td-action">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        roles && roles.length > 0 ?
                                                            roles.map((val, key) => {
                                                                if( val.title != 'super admin' || true)
                                                                return (
                                                                    <tr key={key}>
                                                                        <td className='text-center'>{((limit * page) - limit) + key + 1}</td>
                                                                        <td><Link to='#' data-toggle="modal" data-target="modal-primary" className="text-capitalize" onClick={() => setModal(2, val)}>{val.title}</Link></td>

                                                                        <td>
                                                                            <span className={`status ${val.status ? `bg-success` : `bg-danger`
                                                                                }`}>
                                                                                {
                                                                                    val.status ?
                                                                                        <span className="label label-success p-1">Active</span>
                                                                                        : <span className="label label-danger status p-1">Inactive</span>
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0">
                                                                                <li className="d-inline-block align-top">


                                                                                    {
                                                                                        currentUserRole?.viewRole ?
                                                                                            <button type='button'
                                                                                                data-toggle="tooltip" data-placement="top"
                                                                                                title="View"
                                                                                                className="btn-action btn-primary" onClick={() => setModal(2, val)}><i className="fa fa-eye" /></button>
                                                                                            : <></>
                                                                                    }
                                                                                </li>
                                                                                <li className="d-inline-block align-top">

                                                                                    {currentUserRole?.editRole ?

                                                                                        (currentRoleId !== val._id || true ?
                                                                                            <button className="btn-action btn-warning" title="Edit" onClick={() => setModal(3, val)}><i className="fa fa-edit" /></button>
                                                                                            :
                                                                                            <button className="btn-action btn-danger" title="Edit" disabled><i className="fa fa-edit" /></button>) : <></>
                                                                                    }
                                                                                </li>
                                                                                <li className="d-inline-block align-top">
                                                                                    {currentUserRole?.deleteRole ?
                                                                                        (currentRoleId !== val._id ?
                                                                                            <button className="btn-action btn-danger" title="Delete" onClick={() => deleteRoleHandler(val._id)}><i className="fa fa-trash" /></button>
                                                                                            :
                                                                                            <button className="btn btn-danger" title="Delete" disabled><i className="fa fa-trash" /></button>) : <></>
                                                                                    }
                                                                                </li>
                                                                            </ul>
                                                                        </td>

                                                                        {/* <td>


                                                                            <div className="btn-group">







                                                                                <OverlayTrigger overlay={() => (<Tooltip id="tooltip-897993903">View</Tooltip>)} placement="top" >
                                                                                    {
                                                                                        currentUserRole?.viewRole ?
                                                                                            <button type='button' className="btn-action btn-primary" onClick={() => setModal(2, val)}><i className="fa fa-eye" /></button>
                                                                                            : <></>
                                                                                    }
                                                                                </OverlayTrigger>
                                                                                <OverlayTrigger overlay={() => (<Tooltip id="tooltip-897993903">Edit</Tooltip>)} placement="top" >
                                                                                    {currentUserRole?.editRole ?

                                                                                        (currentRoleId !== val._id ?
                                                                                            <a className="btn-action btn-warning" title="Edit" onClick={() => setModal(3, val)}><i className="fa fa-edit" /></a>
                                                                                            :
                                                                                            <a className="btn-action btn-danger" title="Edit" disabled><i className="fa fa-edit" /></a>) : <></>
                                                                                    }
                                                                                </OverlayTrigger>
                                                                                <OverlayTrigger overlay={() => (<Tooltip id="tooltip-897993903">Delete</Tooltip>)} placement="top" >
                                                                                    {currentUserRole?.deleteRole ?
                                                                                        (currentRoleId !== val._id ?
                                                                                            <a className="btn-action btn-danger" title="Delete" onClick={() => deleteRoleHandler(val._id)}><i className="fa fa-trash" /></a>
                                                                                            :
                                                                                            <a className="btn btn-danger" title="Delete" disabled><i className="fa fa-trash" /></a>) : <></>
                                                                                    }
                                                                                </OverlayTrigger>
                                                                            </div>
                                                                        </td> */}
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td className="text-center px-0" colSpan="5">
                                                                    <span className="alert alert-info d-block text-center">No Record Found</span>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <Col className="pb-4">
                                                <Pagination
                                                    defaultCurrent={1}
                                                    pageSize // items per page
                                                    current={page} // current active page
                                                    total={pages} // total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            </Col>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <PermissionsModal setData={getData} modalType={modalType} setModalType={setModalType} roleModal={roleModal} setroleModal={setroleModal} role={role} setLoader={setLoader} />
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    addRoleRes: state.role.addRoleRes,
    updateRoleRes: state.role.updateRoleRes,
    deleteRoleRes: state.role.deleteRoleRes,
    getRoleRes: state.role.getRoleRes,
    getRolesRes: state.role.getRolesRes,
    authenticate: state.role.authenticate,
    role: state.role,
    errors: state.errors,
    // roles and permission
    currentUserPermission: state.role,
});

export default connect(mapStateToProps, { beforeRole, updateRole, deleteRole, getRole, getRoles, getPermission })(StaffPermissions);