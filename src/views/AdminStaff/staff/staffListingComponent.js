import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../../config/config';
import { getAdmin, getStaffAdmins, deleteAdmin, resendVerificationEmail , beforeAdmin } from 'views/Admin/Admin.action';
import { getRoles } from '../permissions/permissions.actions';
import { getPermission } from '../permissions/permissions.actions';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import validator from 'validator';
import Pagination from 'rc-pagination';
import { Link } from 'react-router-dom'
import 'rc-pagination/assets/index.css';
import StaffModal from './staffModalComponent'
import localeInfo from 'rc-pagination/lib/locale/en_US';
import queryString from 'query-string';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";
var CryptoJS = require("crypto-js");
var adminId = localStorage.getItem('userID')
const AdminStaff = (props) => {
    const { _adminId } = queryString.parse(location.search);
    const [admins, setAdmins] = useState({})
    const [admin, setAdmin] = useState({})
    const [currentUserRole, setCurrentUserRole] = useState({})
    const [isLoader, setLoader] = useState(true)
    const [roleModal, setroleModal] = useState(false)
    const [adminType, setAdminType] = useState(true)
    const [modalType, setModalType] = useState()
    const [roles, setRoles] = useState()
    const [search, setSearch] = useState('')
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [total, setTotal] = useState(0)
    const [pagination, setPagination] = useState(null)

    // set modal type
    const setModal = (type = 1, admin = {}) => {
        setroleModal(!roleModal)
        setModalType(type)
        setLoader(false)
        // add category
        if ((type === 2 || type === 3) && admin) {
            setAdmin(admin)
        }
    }


    const deleteRoleHandler = (adminId) => {
        Swal.fire({
            title: 'Are you sure you want to delete?',
            html: 'If you delete a staff record, it would be permanently lost.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.deleteAdmin(adminId)
            }
        })
    }

    const onSearch = () => {
        props.getStaffAdmins(1, limit, search, adminId)
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
        props.getStaffAdmins(1, 10, "", adminId)
    }

    const onPageChange = (page) => {
        props.getStaffAdmins(page, limit, search, adminId)
        setLoader(true)
    }

    const getData = (admin) => {
        props.getStaffAdmins(page, limit, search, adminId)
        setAdmin(admin)
    }

    const resendVerificationEmail = (_id) => {
        props.resendVerificationEmail(_id)
    }
    useEffect(() => {
        let roleEncrypted = localStorage.getItem('role');
        let role = '';
        if (roleEncrypted) {
            let roleDecrepted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
            props.getPermission(roleDecrepted)
            props.getStaffAdmins(1, 10, "", localStorage.getItem('userID'))
            props.getRoles()
            setLoader(true)
        }
    }, [])

    useEffect(() => {
        if (props.currentUserPermission.authPermission) {
            setCurrentUserRole(props.currentUserPermission.permission.role)
        }

    }, [props.currentUserPermission.authPermission])

    useEffect(async () => {
        if (props.getAdminAuth && Object.keys(props.getAdminsRes.data).length > 0) {

            setLoader(false)
            let data = props.getAdminsRes.data
            setAdmins(data.admins)
            setPage(data.pagination.page)
            setPages(data.pagination.pages)
            setLimit(data.pagination.limit)
            setTotal(data.pagination.total)

            if (_adminId && adminType) {
                setAdminType(false)
                const admin = await data.admins.find((elem) => String(elem._id) === String(_adminId))
                setModal(3, admin)
            }

            props.beforeAdmin()
        }
    }, [props.getAdminAuth])

    useEffect(() => {
        if (Object.keys(props.deleteAdminRes).length > 0) {
            setModalType(1)
            setLoader(false)
            props.beforeAdmin();
            props.getStaffAdmins(1, 10, "", adminId);
        }
    }, [props.deleteAdminRes])


    useEffect(() => {
        if (Object.keys(props.getRolesRes).length > 0) {
            setRoles(props.getRolesRes.data)
        }
    }, [props.getRolesRes])

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
                                                    <Form.Label style={{ color: 'white' }} className="d-block mb-2">Search with name...</Form.Label>
                                                    <Form.Control onKeyPress={handleKeyPress} placeholder="Search" name="search" value={search} onChange={(e) => setSearch(e.target.value)}></Form.Control>
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
                                            <span style={{ fontWeight: 'bold' }}>{`Total : ${total}`}</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Staff</Card.Title>
                                            {/* <p className="card-category">List of Categories</p> */}
                                            {currentUserRole && currentUserRole.addAdmin ?
                                                <Button variant="info" className="float-sm-right mb-0" onClick={() => setModal(1)}> Add New Staff</Button>
                                                :
                                                ''
                                            }
                                        </div>

                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">Sr.#</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Status</th>
                                                        <th className="td-action">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        admins && admins.length > 0 ?
                                                            admins.map((val, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{((limit * page) - limit) + key + 1}</td>
                                                                        <td><Link to='#' data-toggle="modal" data-target="#admin-modal" className="text-capitalize" onClick={() => setModal(2, val)}>{val.name}</Link></td>
                                                                        <td>{val.email}</td>
                                                                        <td>{val.role.title}</td>

                                                                        <td><span className={`text-white status ${val.status ? `bg-success` : `bg-danger`
                                                                            }`}>{val.status ? val.status === true ? 'Active' : false : 'Inactive'}</span></td>
                                                                        <td className='text-center'>
                                                                            <div className="btn-group">
                                                                                {
                                                                                    currentUserRole?.viewAdmin ?
                                                                                        <a className="btn-action btn-primary" title="View" onClick={() => setModal(2, val)}><i className="fa fa-eye" /></a>
                                                                                        : <></>
                                                                                }
                                                                                {currentUserRole?.editAdmin ?
                                                                                    <>
                                                                                        <a className="btn-action btn-warning" title="Edit" onClick={() => setModal(3, val)}><i className="fa fa-edit" /></a>
                                                                                        {   
                                                                                            !val.confirmationCode && 
                                                                                            <a className="btn-action btn-warning" title="Resend Verification Email" onClick={() => resendVerificationEmail(val._id)}><i className="fa fa-envelope" /></a>
                                                                                        }
                                                                                    </>
                                                                                    : <></>
                                                                                }
                                                                                {currentUserRole?.deleteAdmin ?
                                                                                    <a className="btn-action btn-danger" title="Delete" onClick={() => deleteRoleHandler(val._id)}><i className="fa fa-trash" /></a>
                                                                                    : <></>
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td className="text-center px-0" colSpan="6">
                                                                    <span className="alert alert-info d-block text-center">No Record Found</span>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <Col className="pb-4">
                                                <Pagination
                                                    defaultCurrent={2}
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
                        <StaffModal getData={getData} modalType={modalType} setModalType={setModalType} roleModal={roleModal} setroleModal={setroleModal} setLoader={setLoader} admin={admin} setAdmin={setAdmin} roles={roles} setAdminType={setAdminType} />
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    getAdminsRes: state.admin.getAdminsRes,
    getAdminAuth: state.admin.getAuth,
    currentUserPermission: state.role,
    deleteAdminRes: state.admin.deleteAdminRes,
    getRolesRes: state.role.getRolesRes,
});

export default connect(mapStateToProps, { getAdmin, getStaffAdmins, deleteAdmin, beforeAdmin, getRoles, getPermission, resendVerificationEmail })(AdminStaff);