import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ENV } from '../../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import validator from 'validator';
import { addRole, updateRole, beforeRole } from './permissions.actions';
import $ from 'jquery';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";

const StaffPermissionModal = (props) => {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [status, setStatus] = useState(true)
    const [selectAll, setSelectAll] = useState(false)
    const [titleMsg, setTitleMsg] = useState('')
    const [formValid, setFormValid] = useState(false)
    const [permissions, setPermissions] = useState({
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


        // status (i.e: true for active & false for in-active)

    })
    const addRoleRes = useSelector(state => state.role.addRoleRes)
    const updateRoleRes = useSelector(state => state.role.updateRoleRes)
    const authenticate = useSelector(state => state.role.authenticate)
    const onChangeCheckbox = (name, value) => {
        let roles = permissions
        if (name === 'selectAll') {
            Object.keys(roles).forEach((val, key) => {
                if (val !== 'title' && val !== '_id' && val !== 'status' && val !== 'createdAt' && val !== 'updatedAt' && val !== '_v')
                    roles = { ...roles, [val]: value }
            });
            setSelectAll(value)
        }
        else {
            roles = { ...roles, [name]: value }

            // select all state settings
            let count = 0;

            Object.keys(roles).forEach((key, index) => {
                if (roles[key] === true && key !== 'status')
                    count++;
            });
            let selectCount = count === 62 ? true : false
            setSelectAll(selectCount)
        }
        setPermissions(roles)
    }
    const submit = (e) => {
        if (title === undefined) {
            setTitleMsg("Title Required.")
            $('.modal-primary').scrollTop(0, 0)
            setFormValid(true)
        }
        else {
            if (!validator.isEmpty(title)) {
                setTitleMsg(title)
                setFormValid(false)

                const role = { ...permissions, title, status }


                if (props.modalType === 1) // add modal type
                {
                    props.setLoader(true)
                    dispatch(addRole(role));
                  

                }
                else if (props.modalType === 3) // update modal type
                {
                    props.setLoader(true)
                     dispatch(updateRole(role));

                }

                setPermissions(role)
                props.setData(role)
                props.setLoader(true)
            }
            else {
                setTitleMsg("Title Required.")
                $('.modal-primary').scrollTop(0, 0)
                setFormValid(true)
            }
        }

    }


    useEffect(() => {
        if (Object.keys(props.role).length > 0) {
            // setPermissions(props.role)
            // setTitle(props.role.title)
            // setStatus(props.role.status)
            updateInitialData({ ...props });
        }
    }, [props.role])

    const updateInitialData = (props) => {
        let newprops = { ...props };
        setPermissions(newprops.role)
        setTitle(newprops.role.title)
        setStatus(newprops.role.status)
    }

    useEffect(() => {
        if (props.modalType === 2) {
            $(".modal-primary input").prop("disabled", true);
        } else {
            $(".modal-primary input").prop("disabled", false);
        }
    }, [props.modalType])

    useEffect(() => {
        if (addRoleRes.success && authenticate === true) {
            // closeModal();
            // this.props.role.removeLoader();
            props.setroleModal(!props.roleModal)

            props.setModalType(1)
            props.setLoader(false)
            setEmpty()
            // setRole({})

            toast.success(addRoleRes.message);
        }
    }, [addRoleRes])

    const onCloseHandler = () => {
        props.setroleModal(!props.roleModal)
        // setEmpty()
    }
    const resetPermission = () => {
        setPermissions({
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
    
        })
        setTitle('')
    }
    useEffect(() => {
        if (Object.keys(updateRoleRes).length > 0 && authenticate === true) {

            props.setroleModal(!props.roleModal)
            props.setModalType(1)
            props.setLoader(false)
            toast.success(updateRoleRes.message);
            beforeRole();
        }
    }, [updateRoleRes])

    const setEmpty = () => {
        for (let key in permissions) {
            permissions[key] = false
        }
    }


    return (
        <Container fluid>
            {
                formValid ?
                    <div className="text-danger">Please fill the required fields</div> : null
            }
            {
                props.modalType > 0 &&
                <Modal className="modal-primary" onHide={() => {
                        props.setroleModal(!props.roleModal);
                        resetPermission()
                        }} show={props.roleModal}>
                    <Modal.Header className="justify-content-center">
                        <Row>
                            <div className="col-12">
                                <h4 className="mb-0 mb-md-3 mt-0">
                                    {props.modalType === 1 ? 'Add New' : props.modalType === 2 ? 'View' : 'Edit'} Staff Role
                                </h4>
                            </div>
                        </Row>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <Form>
                            <Form.Group>
                                <Row>
                                    <Col md={9}>
                                        <label className="label-font">Title <span className="text-danger">*</span></label>
                                        <Form.Control
                                            placeholder="Enter name"
                                            type="text"
                                            name="title"
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={props.modalType === 2}
                                            value={title}
                                            required
                                        />
                                        <span className={titleMsg ? `` : `d-none`}>
                                            <label className="pl-1 text-danger">{titleMsg}</label>
                                        </span>
                                    </Col>

                                    <Col md={3}>
                                        <label className="right-label-checkbox">Select All
                                            <input type="checkbox" name="selectAll" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !selectAll)} checked={selectAll} />
                                            <span className="checkmark"></span>
                                        </label>

                                        {/* <label className="label-font">Select All</label>
                                            <input type="checkbox" name="selectAll" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !selectAll)} checked={selectAll}></input> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Admin</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap" >
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewAdmin" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewAdmin)} checked={permissions.viewAdmin} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addAdmin" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addAdmin)} checked={permissions.addAdmin} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editAdmin" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editAdmin)} checked={permissions.editAdmin} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteAdmin" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteAdmin)} checked={permissions.deleteAdmin} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">User Email Template</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewEmailTemplate" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewEmailTemplate)} checked={permissions.viewEmailTemplate} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addEmailTemplate" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addEmailTemplate)} checked={permissions.addEmailTemplate} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editEmailTemplate" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editEmailTemplate)} checked={permissions.editEmailTemplate} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteEmailTemplate" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteEmailTemplate)} checked={permissions.deleteEmailTemplate} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Email Types</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewEmailType" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewEmailType)} checked={permissions.viewEmailType} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addEmailType" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addEmailType)} checked={permissions.addEmailType} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editEmailType" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editEmailType)} checked={permissions.editEmailType} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteEmailType" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteEmailType)} checked={permissions.deleteEmailType} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Roles</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewRole)} checked={permissions.viewRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addRole)} checked={permissions.addRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editRole)} checked={permissions.editRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteRole)} checked={permissions.deleteRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Students</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewStudent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewStudent)} checked={permissions.viewStudent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addStudent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addStudent)} checked={permissions.addStudent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editStudent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editStudent)} checked={permissions.editStudent} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteStudent" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteStudent)} checked={permissions.deleteStudent} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Interviewers</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewInterviewer" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewInterviewer)} checked={permissions.viewInterviewer} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addInterviewer" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addInterviewer)} checked={permissions.addInterviewer} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editInterviewer" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editInterviewer)} checked={permissions.editInterviewer} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteInterviewer" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteInterviewer)} checked={permissions.deleteInterviewer} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Semesters</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSemester" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewSemester)} checked={permissions.viewSemester} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addSemester" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addSemester)} checked={permissions.addSemester} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSemester" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editSemester)} checked={permissions.editSemester} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteSemester" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteSemester)} checked={permissions.deleteSemester} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Loan Application</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewLoanApplication" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewLoanApplication)} checked={permissions.viewLoanApplication} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addLoanApplication" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addLoanApplication)} checked={permissions.addLoanApplication} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editLoanApplication" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editLoanApplication)} checked={permissions.editLoanApplication} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteLoanApplication" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteLoanApplication)} checked={permissions.deleteLoanApplication} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Email Templates</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewEmails)} checked={permissions.viewEmails} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editEmails)} checked={permissions.editEmails} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Settings</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewSetting)} checked={permissions.viewSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editSetting)} checked={permissions.editSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <FormGroup>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Status</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap" >
                                        <label className="right-label-radio mr-3 mb-2">Active
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={status} value={status} onChange={(e) => setStatus(true)} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-radio mr-3 mb-2">InActive
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className="btn btn-warning" onClick={(e) => onCloseHandler()}>Close</Button>
                        {props.modalType === 2 ? '' :
                            <Button className="btn btn-info" onClick={() => submit()} /* disabled={isLoader} */>Save</Button>
                        }
                    </Modal.Footer>
                </Modal>
            }
        </Container>
    )
}

export default StaffPermissionModal;