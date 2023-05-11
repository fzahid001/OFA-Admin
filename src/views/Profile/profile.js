import React, { useRef, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { getRole } from "views/AdminStaff/permissions/permissions.actions";
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { beforeAdmin, getAdmin, updateAdmin, updatePassword } from '../Admin/Admin.action';
import userDefaultImg from '../../assets/img/default-profile.png'
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
var CryptoJS = require("crypto-js");
import { toast } from 'react-toastify';
import validator from 'validator';


function Profile(props) {
  const [permissions, setPermissions] = useState({})
  const [adminRole, setAdminRole] = useState('')
  const [loader, setLoader] = useState(true)
  const [adminId, setAdminId] = useState(localStorage.getItem('userID'))
  // const [siteLogo, setSiteLogo] = useState('')
  // const [image, setImage] = useState('')
  const [msg, setMsg] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    status: '',
    image: ''
  })

  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    status: '',
    image: '',
  })

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
    _id: adminId
  })


  useEffect(() => {
    let adminId = localStorage.getItem('userID')
     setPassword({ ...password, _id: adminId });
    window.scroll(0, 0)
    // const callback=()=>{
    // 	setLoader(false);
    // }
    setLoader(false);
    // props.getSettings(callback)
    props.getAdmin(adminId)
    let roleEncrypted = localStorage.getItem('role');
    let role = ''
    if (roleEncrypted) {
      let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
      role = roleDecrypted
    }
    props.getRole(role)
  }, [])

  useEffect(() => {
    if (Object.keys(props.getRoleRes).length > 0) {
      setAdminRole(props.getRoleRes.role)
    }
  }, [props.getRoleRes])

  useEffect(() => {
    if (props.admin.getAuth) {
      setLoader(false)
      const { admin } = props.admin
      setAdmin(admin)
      props.beforeAdmin()
    }
  }, [props.admin.getAuth])

  useEffect(() => {
    if (admin) {
      setLoader(false)
    }
  }, [admin])

  const [passwordMsgCheck, setPasswordMsgCheck] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword2] = useState(false);
  const [showNewPassword, setNewPassword] = useState(false);

  const showPasswordMethod = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword)
  }
  const showConfirmPasswordMethod = (e) => {
    e.preventDefault();
    setConfirmPassword2(!showConfirmPassword)
  }
  const showNewPasswordMethod = (e) => {
    e.preventDefault();
    setNewPassword(!showNewPassword)
  }

  // useEffect(() => {
  //   if (password.new === password.confirm) {
  //     setPasswordMsgCheck(false)
  //   }
  //   else {
  //     setPasswordMsg('New passord & confirm password are not same.')
  //     setPasswordMsgCheck(true)
  //   }
  // }, [password])



  const submitCallBack = (e) => {

    e.preventDefault()

    if (!validator.isEmpty(admin.name) && validator.isEmail(admin.email)) {

      if(!validator.isEmpty(admin.phone) && !validator.isMobilePhone(admin.phone)){
        setMsg({
          phone: (!validator.isEmpty(admin.phone) && !validator.isMobilePhone(admin.phone) ? 'Invalid phone number' : '')
        })
      }else{

        setMsg({
          name: '',
          email: '',
          phone: ''
  
        })

        props.updateAdmin(admin);
      }
     
    }
    else {

      setMsg({
        name: validator.isEmpty(admin.name) ? 'Name is required' : '',
        email: validator.isEmpty(admin.email) ? 'Email is required' : '',

      })

    }


  }

  const passwordForm = (e) => {
    e.preventDefault()

    if (!validator.isEmpty(password.current) && !validator.isEmpty(password.new)
      && !validator.isEmpty(password.confirm)
    ) {
      if (password.new === password.confirm) {
        if (validator.isStrongPassword(password.new)) {
          setPasswordMsgCheck(false)

        
          let formData = new FormData()
          for (const key in password)
            formData.append(key, password[key])
          props.updatePassword(formData)

          setPassword({
            current: '',
            new: '',
            confirm: '',
            _id: adminId
          })

       
          e.target[0].value = ''
          e.target[1].value = ''
          e.target[2].value = ''
          e.target[3].value = ''
          e.target[4].value = ''
          e.target[5].value = ''

        }
        else {
          setPasswordMsg('Password must contain Upper Case, Lower Case, a Special Character, a Number and must be at least 8 characters in length')
          setPasswordMsgCheck(true)
        }
      }
      else {
        setPasswordMsg('New password & confirm password are not same.')
        setPasswordMsgCheck(true)
      }
    }
    else {
      setPasswordMsg('You have to fill all fields to change password.')
      setPasswordMsgCheck(true)
    }
  }



  const submitPic = (e) => {
    e.preventDefault()
    if (admin.image) {
      props.updateAdmin(admin);
    }
    else {
      toast.error('Please upload pic before updating.')
    }

  }

  return (
    <>

      {
        loader ?
          <FullPageLoader />
          :
          <Container fluid>
            <div className="section-image" data-image="../../assets/img/bg5.jpg">
              {/* you can change the color of the filter page using: data-color="blue | purple | green | orange | red | rose " */}
              <Container>
                <Row>
                  <Col md="8">
                    <Form action="" className="form" onSubmit={(e) => submitCallBack(e)}>
                      <Card className="pb-4 table-big-boy">
                        <Card.Header>
                          <Card.Header className="pl-0">
                            <Card.Title as="h4">Profile</Card.Title>
                          </Card.Header>
                        </Card.Header>
                        <Card.Body>

                          <Row>
                            <Col md="6">
                              <Form.Group>
                                <label>Name<span className="text-danger"> *</span></label>
                                <Form.Control
                                  value={admin?.name}
                                  onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                                  placeholder="Company"
                                  type="text"
                                ></Form.Control>
                                <span className={msg.name ? `` : `d-none`}>
                                  <label className="pl-1 text-danger">{msg.name}</label>
                                </span>

                              </Form.Group>
                            </Col>
                            <Col className="pl-3" md="6">
                              <Form.Group>
                                <label>Email<span className="text-danger"> *</span></label>
                                <Form.Control
                                  value={admin?.email}
                                  placeholder="Email"
                                  type="email"
                                  readOnly
                                ></Form.Control>
                                <span className={msg.email ? `` : `d-none`}>
                                  <label className="pl-1 text-danger">{msg.email}</label>
                                </span>

                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md="12">
                              <Form.Group>
                                <label>Address</label>
                                <Form.Control
                                  value={admin?.address}
                                  onChange={(e) => setAdmin({ ...admin, address: e.target.value })}
                                  placeholder="Address"
                                  type="text"
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md="6">
                              <Form.Group>
                                <label>Phone</label>
                                <Form.Control
                                  value={admin?.phone}
                                  onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
                                  type="text"
                                ></Form.Control>
                                <span className={msg.phone ? `` : `d-none`}>
                                  <label className="pl-1 text-danger">{msg.phone}</label>
                                </span>
                              </Form.Group>
                            </Col>
                            <Col className="pl-3" md="6">
                              <Form.Group>
                                <label>Status<span className="text-danger"> *</span></label>
                                <Form.Check
                                  type="switch"
                                  id="custom-switch"
                                  className="p-1"
                                  checked={admin?.status}
                                  onChange={(e) => setAdmin({ ...admin, status: e.target.checked })}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="6">
                              <Form.Group>
                                <label>Role</label>
                                <Form.Control
                                  readOnly
                                  value={adminRole?.title}
                                  type="text"
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>


                          <Button
                            className="btn-fill pull-right"
                            type="submit"
                            variant="info"
                          >
                            Update Profile
                          </Button>
                          <div className="clearfix"></div>
                        </Card.Body>
                      </Card>
                    </Form>
                  </Col>
                  <Col md="4">
                    <Card className="card-user table-big-boy">
                      <Card.Header className="no-padding">
                        <div className="card-image">
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <div className="author">
                          <img
                            alt="..."
                            className="avatar border-gray"
                            src={admin.image ? admin.image : userDefaultImg}
                          ></img>

                          <Card.Title as="h5">{admin.name}</Card.Title>
                          <p className="card-description"></p>
                        </div>


                        <Form onSubmit={(e) => submitPic(e)}>
                          <Form.Group className="pl-3 pr-3 d-flex align-items-center">

                            <Form.Control
                              placeholder="Company"
                              type="file"
                              varient="info"
                              accept=".png,.jpeg,.jpg"
                              // onChange={(e) => onFileChange(e)}

                              onChange={async (e) => {
                                const res = await ENV.uploadImage(e);
                                //  setImage(res ? ENV.uploadedImgPath + res : "")
                                setAdmin({ ...admin, image: res ? ENV.uploadedImgPath + res : "" })
                                // setDetail({ ...detail, image: res ? ENV.uploadedImgPath+res  : "" });
                              }}

                              id="imageUploader"
                            ></Form.Control>

                            <div className="text-center">
                              <Button
                                className="btn-fill m-0 pull-right update-pic-btn"
                                type="submit"
                                variant="info"

                              >
                                Update Pic
                              </Button>
                            </div>

                          </Form.Group>
                        </Form>

                      </Card.Body>
                      <Card.Footer>
                        <div className="pb-2"></div>
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col sm="12">
                    <Form action="" className="form profile-admin-form" onSubmit={(e) => passwordForm(e)}>
                      <Card className="table-big-boy pb-4">
                        <Card.Header>
                          <Card.Header className="pl-0">
                            <Card.Title as="h4">Change Password</Card.Title>
                          </Card.Header>
                        </Card.Header>
                        <Card.Body>


                          <Row>
                            <Col md="4">
                              <Form.Group>
                                <label>Current Password<span className="text-danger"> *</span></label>
                                <div className="form-password-eye-box">
                                  <Form.Control
                                    placeholder="Current Password"
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e) => {
                                      setPassword({ ...password, current: e.target.value });
                                    }

                                    }
                                  ></Form.Control>
                                  <button onClick={(e) => showPasswordMethod(e)} className="form-password-eye">
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                  </button>
                                </div>
                              </Form.Group>
                            </Col>
                            <Col md="4">
                              <Form.Group>
                                <label>New Password<span className="text-danger"> *</span></label>
                                <div className="form-password-eye-box">
                                  <Form.Control
                                    placeholder="New Password"
                                    type={showNewPassword ? "text" : "password"}
                                    onChange={(e) => {
                                      setPassword({ ...password, new: e.target.value });
                                    }
                                    }
                                  ></Form.Control>
                                  <button onClick={(e) => showNewPasswordMethod(e)} className="form-password-eye">
                                    <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
                                  </button>
                                </div>
                              </Form.Group>
                            </Col>
                            <Col md="4">
                              <Form.Group>
                                <label>Confirm Password<span className="text-danger"> *</span></label>
                                <div className="form-password-eye-box">
                                  <Form.Control
                                    placeholder="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                  ></Form.Control>
                                  <button onClick={(e) => showConfirmPasswordMethod(e)} className="form-password-eye">
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                                  </button>
                                </div>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Form.Group className={passwordMsgCheck ? `` : `d-none`}>
                              <label className="pl-3 text-danger">{passwordMsg}</label>
                            </Form.Group>
                          </Row>


                          <Button
                            className="btn-fill pull-right"
                            type="submit"
                            variant="info"
                          >
                            Update Password
                          </Button>
                          <div className="clearfix"></div>
                        </Card.Body>
                      </Card>
                    </Form>
                  </Col>
                </Row>




              </Container>
            </div>
          </Container>
      }


    </>
  );
}

const mapStateToProps = state => ({
  admin: state.admin,
  error: state.error,
  getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeAdmin, getAdmin, updateAdmin, updatePassword, getRole })(Profile);