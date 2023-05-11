import { useState, useEffect } from "react";
import { ENV } from '../../config/config';
import { getSettings, beforeSettings, editSettings } from './settings.action';
import { connect } from 'react-redux';
import { getRole } from "views/AdminStaff/permissions/permissions.actions";
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
var CryptoJS = require("crypto-js");
import validator from 'validator';
import userDefaultImg from '../../assets/img/placeholder.jpg'

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";


const SiteSettings = (props) => {

	const [permissions, setPermissions] = useState({})
	const [loader, setLoader] = useState(true)
	const [siteLogo, setSiteLogo] = useState('')
	const [msg, setMsg] = useState({
		siteTitle: '',
		siteLogo: '',
		companyRegistrationNumber: '',
		VATId: '',
		TaxId: '',
		inquiryEmail: '',

		email: '',
		phone: '',
		mobile: '',
		address: '',

		vatPercentage:'',
		orderEmailRecipients:'',
		registrationEmailRecipients:'',

		mailgunPrivateKey: '',
		mailgunDomain: '',
	
		inactiveAfterDays: '',
		softDeleteAfterDays: '',
		firstNotificationDays: '',
		secondNotificationDays: '',
		thirdNotificationDays: '',

		licenseNotificationDurationDays: '',
		licenseThresholdCount: '',
		licenseNotificationCount: '',
		
		api: '',
	})

	useEffect(() => {
		window.scroll(0, 0)
		const callback=()=>{
			setLoader(false);
		}
		props.getSettings(callback)
		let roleEncrypted = localStorage.getItem('role');
		let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
        props.getRole(role)
	}, [])

	useEffect(()=>{
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    },[props.getRoleRes])

	useEffect(() => {
		if (props.settings.settingsAuth) {
			if (props.settings.settings) {
				setLoader(false)
				const settingsData = props.settings.settings
				setSettings({ ...settings, ...settingsData })
				if(siteLogo === ''){
				setSiteLogo(settingsData.siteLogo)
				}
			}
			props.beforeSettings()
		}
	}, [props.settings.settingsAuth])

	const [settings, setSettings] = useState({
		siteTitle: '',
		siteLogo: '',
		companyName: '',
		companyRegistrationNumber: '',
		VATId: '',
		TaxId: '',
		metaKeywords: '',
		metaDescription: '',
		inquiryEmail: '',
		domain: '',

		email: '',
		phone: '',
		mobile: '',
		address: '',

		pinterest: '',
		facebook:'',
		twitter: '',
		linkedin:'',

		vatPercentage:'',
		orderEmailRecipients:'',
		registrationEmailRecipients:'',

		mailgunPrivateKey: '',
		mailgunDomain: '',

		
		inactiveAfterDays: '',
		softDeleteAfterDays: '',
		firstNotificationDays: '',
		secondNotificationDays: '',
		thirdNotificationDays: '',

		licenseNotificationDurationDays: '',
		licenseThresholdCount: '',
		licenseNotificationCount: '',

		api: '',
	})
	
	const submit = () => {
		let check = true
		let emailcheck = true	
		let emailcheck1 = true	

		setMsg({
			siteTitle: validator.isEmpty(settings.siteTitle) ? 'Site Title is required' : '',
			siteLogo: validator.isEmpty(siteLogo) ? 'Site Logo is required' : '',
			// companyRegistrationNumber: validator.isEmpty(settings.companyRegistrationNumber) ? 'Company Registration Number is required' : '',
			VATId: validator.isEmpty(settings.VATId) ? 'VAT Id is required' : '',
			TaxId: validator.isEmpty(settings.TaxId) ? 'Tax Id is required' : '',
			inquiryEmail: validator.isEmpty(settings.inquiryEmail) ? 'Inquiry Email is required' : !validator.isEmpty(settings.inquiryEmail)  && !validator.isEmail(settings.inquiryEmail) ? 'Please input valid email' : '',
			email: validator.isEmpty(settings.email) ? 'Email is required' : !validator.isEmpty(settings.email)  && !validator.isEmail(settings.email) ? 'Please input valid email' : '',
			phone: validator.isEmpty(settings.phone)  ? 'Phone is required' :  '',
			mobile: validator.isEmpty(settings.mobile)  ? 'Mobile is required' : '',
			address: validator.isEmpty(settings.address) ? 'Address is required' : '',
			vatPercentage:validator.isEmpty(settings.vatPercentage) ?  'Vat Percentage is required' : !validator.isEmpty(settings.vatPercentage) &&  !validator.isFloat(settings.vatPercentage) ? 'Please input correct format.' : '',

			orderEmailRecipients:validator.isEmpty(settings.orderEmailRecipients) ?  'Order Email Recipients is required' : '',
			registrationEmailRecipients:validator.isEmpty(settings.registrationEmailRecipients) ?  'Registration Email Recipients is required' : '',
			
			mailgunPrivateKey:validator.isEmpty(settings.mailgunPrivateKey) ?  'Mailgun Private Key is required' : '',
			mailgunDomain:validator.isEmpty(settings.mailgunDomain) ?  'Mailgun Domain is required' : !validator.isEmpty(settings.mailgunDomain) &&  !validator.isURL(settings.mailgunDomain) ? 'Invalid URL' : '',
	
			inactiveAfterDays: settings.inactiveAfterDays == '' || settings.inactiveAfterDays  == undefined ? 'Inactivity Days is required'  : settings.inactiveAfterDays > 30 ? 'Recommended 30 days' : '',
			softDeleteAfterDays: settings.softDeleteAfterDays == '' || settings.softDeleteAfterDays  == undefined ? 'Soft Deletion Days is required'  : settings.softDeleteAfterDays > 30 ? 'Recommended 30 days' : '',
			firstNotificationDays: settings.firstNotificationDays == '' || settings.firstNotificationDays  == undefined ? 'First Notification Days is required'  : '',
			secondNotificationDays: settings.secondNotificationDays == '' || settings.secondNotificationDays  == undefined ? 'Second Notification Days is required'  : '',
			thirdNotificationDays: settings.thirdNotificationDays == '' || settings.thirdNotificationDays  == undefined ? 'Third Notification Days is required'  : '',
			
			licenseNotificationDurationDays: settings.licenseNotificationDurationDays == '' || settings.licenseNotificationDurationDays == undefined ? 'License Notification Duration Days is required' :  '',
			licenseThresholdCount: settings.licenseThresholdCount == '' || settings.licenseThresholdCount == undefined ? 'License Threshold Count is required' :  '',
			licenseNotificationCount:  settings.licenseNotificationCount == '' || settings.licenseNotificationCount == undefined ? 'License Notification Count is required' :  '',
			
			api: '',

			pinterest: !validator.isEmpty(settings.pinterest) &&  !validator.isURL(settings.pinterest) ? 'Invalid URL' : '',
			facebook:  !validator.isEmpty(settings.facebook) &&  !validator.isURL(settings.facebook) ? 'Invalid URL' : '',
			twitter: !validator.isEmpty(settings.twitter) &&  !validator.isURL(settings.twitter) ? 'Invalid URL' : '',
			linkedin:  !validator.isEmpty(settings.linkedin) &&  !validator.isURL(settings.linkedin) ? 'Invalid URL' : '',
	
		})

		const match = settings.orderEmailRecipients.split(',')
		
		for (var a in match)
		{
			var variable = match[a]
			if(!validator.isEmail(variable)){
			setMsg({orderEmailRecipients:!validator.isEmail(variable) ? 'Please input valid email' : ''})
			emailcheck = false
			return;
			}
		}

		const match1 = settings.registrationEmailRecipients.split(',')
		
		for (var a in match1)
		{
			var variable = match1[a]
			if(!validator.isEmail(variable)){
			setMsg({registrationEmailRecipients:!validator.isEmail(variable) ? 'Please input valid email' : ''})
			emailcheck1 = false
			return;
			}
		}


		if( validator.isEmpty(settings.siteTitle) 
				|| validator.isEmpty(siteLogo) 
				|| validator.isEmpty(settings.VATId) 
				|| validator.isEmpty(settings.TaxId) 
				|| (validator.isEmpty(settings.inquiryEmail) || !validator.isEmail(settings.inquiryEmail)) 

				|| (validator.isEmpty(settings.phone) )
				|| (validator.isEmpty(settings.mobile) )

				|| validator.isEmpty(settings.address) 
				|| validator.isEmpty(settings.vatPercentage) 
				|| validator.isEmpty(settings.orderEmailRecipients) 
				|| validator.isEmpty(settings.registrationEmailRecipients)
				
				|| validator.isEmpty(settings.mailgunPrivateKey)
				|| validator.isEmpty(settings.mailgunDomain)
				
				|| validator.isEmpty(settings.email) 
				|| (validator.isEmpty(String(settings.inactiveAfterDays)) || settings.inactiveAfterDays > 30)
				|| (validator.isEmpty(String(settings.softDeleteAfterDays)) || settings.softDeleteAfterDays > 30 )
				|| validator.isEmpty(String(settings.firstNotificationDays)) 
				|| validator.isEmpty(String(settings.secondNotificationDays)) 
				|| validator.isEmpty(String(settings.thirdNotificationDays)) 
				|| validator.isEmpty(String(settings.licenseNotificationDurationDays)) 
				|| validator.isEmpty(String(settings.licenseThresholdCount)) 
				|| validator.isEmpty(String(settings.licenseNotificationCount)) 

				|| ( !validator.isEmpty(settings.email) && !validator.isEmail(settings.email))


				|| ( !validator.isEmpty(settings.pinterest) && !validator.isURL(settings.pinterest))
				|| ( !validator.isEmpty(settings.facebook) && !validator.isURL(settings.facebook))
				|| ( !validator.isEmpty(settings.twitter) && !validator.isURL(settings.twitter))
				|| ( !validator.isEmpty(settings.linkedin) && !validator.isURL(settings.linkedin))
			){
				check = false
		}
		
		if(check && emailcheck && emailcheck1){
			let formData = new FormData()
			for (const key in settings)
				formData.append(key, settings[key])
			if(siteLogo != ''){
				formData.append('siteLogo', siteLogo)
			}

			const qs = ENV.objectToQueryString({ type: '1' })
			props.editSettings(formData, qs)
			setLoader(true)
		}
	}

	return (
		<>
			{
				loader ? <FullPageLoader/> :
				<Container fluid>
					<Row>
						<Col md="12">
							<Form action="" className="form-horizontal settings-form" id="TypeValidation" method="">
								<Card className="table-big-boy">
									<Card.Header>
										<div className="d-block d-md-flex align-items-center justify-content-between">
											<Card.Title as="h4">Site Settings</Card.Title>
										</div>
									</Card.Header>

									<Card.Body>
										<Row>
											<Col sm={12}>
												<p className="mb-4"><strong>Site Information</strong></p>
											</Col>
											<Col sm={10}>
												<Row>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">Site Title<span className="text-danger"> *</span></Form.Label>
															<Form.Control type="text" value={settings.siteTitle} onChange={(e) => { setSettings({ ...settings, siteTitle: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.siteTitle ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.siteTitle}</label>
														</span>
													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">Company Name</Form.Label>
															<Form.Control type="text" value={settings.companyName} onChange={(e) => { setSettings({ ...settings, companyName: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.companyName ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.companyName}</label>
														</span>
													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">Company Registration Number</Form.Label>
															<Form.Control type="text" value={settings.companyRegistrationNumber} onChange={(e) => { setSettings({ ...settings, companyRegistrationNumber: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.companyRegistrationNumber ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.companyRegistrationNumber}</label>
														</span>
													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">VAT ID<span className="text-danger"> *</span></Form.Label>
															<Form.Control type="text" value={settings.VATId} onChange={(e) => { setSettings({ ...settings, VATId: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.VATId ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.VATId}</label>
														</span>
													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">Tax ID<span className="text-danger"> *</span></Form.Label>
															<Form.Control type="text" value={settings.TaxId} onChange={(e) => { setSettings({ ...settings, TaxId: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.TaxId ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.TaxId}</label>
														</span>
													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">Domain</Form.Label>
															<Form.Control type="url" value={settings.domain} onChange={(e) => { setSettings({ ...settings, domain: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.domain ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.domain}</label>
														</span>
													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">Inquiry Email<span className="text-danger"> *</span></Form.Label>
															<Form.Control type="email" value={settings.inquiryEmail} onChange={(e) => { setSettings({ ...settings, inquiryEmail: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.inquiryEmail ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.inquiryEmail}</label>
														</span>
													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">Email<span className="text-danger"> *</span></Form.Label>
															<Form.Control type="email" value={settings.email} onChange={(e) => { setSettings({ ...settings, email: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.email ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.email}</label>
														</span>

													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">Phone<span className="text-danger"> *</span></Form.Label>
															<Form.Control type="tel" value={settings.phone} onChange={(e) => { setSettings({ ...settings, phone: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.phone ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.phone}</label>
														</span>

													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">Mobile<span className="text-danger"> *</span></Form.Label>
															<Form.Control type="tel" value={settings.mobile} onChange={(e) => { setSettings({ ...settings, mobile: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.mobile ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.mobile}</label>
														</span>

													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2"> Address<span className="text-danger"> *</span></Form.Label>
															<Form.Control type="text" value={settings.address} onChange={(e) => { setSettings({ ...settings, address: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.address ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.address}</label>
														</span>
													</Col>
													<Col xl={4} sm={6}>
														<Form.Group>
															<Form.Label className="d-block mb-2">VAT Percentage<span className="text-danger"> *</span></Form.Label>
															<Form.Control type="number" value={settings.vatPercentage} onChange={(e) => { setSettings({ ...settings, vatPercentage: e.target.value }) }}></Form.Control>
														</Form.Group>
														<span className={msg.vatPercentage ? `` : `d-none`}>
															<label className="pl-1 pt-0 text-danger">{msg.vatPercentage}</label>
														</span>
													</Col>
												</Row>
											</Col>
											<Col sm={2}>
											<Form.Group className="site-logo-img">
												<label>Site Logo<span className="text-danger"> *</span></label>
												<div className='mb-2'>
													{<img className="img-thumbnail" src={siteLogo ? siteLogo : userDefaultImg} onError={(e) => { e.target.onerror = null; e.target.src = userDefaultImg }} style={{ width: '100px' }} />}
												</div>
												<Form.Control
													className='text-white'
													onChange={async (e) => {
														const res = await ENV.uploadImage(e);
														setSiteLogo(res ? ENV.uploadedImgPath + res : "")
													}}
													// placeholder="Title"
													type="file"
												></Form.Control>
												<span className={msg.siteLogo ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.siteLogo}</label>
												</span>
											</Form.Group>
											</Col>

										</Row>
										<hr/>
										<Row>
											<Col sm={12}>
												<p className="mb-4"><strong>Site Meta Information</strong></p>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Meta Keywords</Form.Label>
													<Form.Control as="textarea" type="text" value={settings.metaKeywords} onChange={(e) => { setSettings({ ...settings, metaKeywords: e.target.value }) }} style={{ height: '100px' }}></Form.Control>
												</Form.Group>
												<span className={msg.metaKeywords ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.metaKeywords}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Meta Desciption</Form.Label>
													<Form.Control as="textarea" type="text" value={settings.metaDescription} onChange={(e) => { setSettings({ ...settings, metaDescription: e.target.value }) }} style={{ height: '100px' }}></Form.Control>
												</Form.Group>
												<span className={msg.metaDescription ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.metaDescription}</label>
												</span>
											</Col>
										</Row>
										<hr/>
										<Row>
											<Col sm={12}>
												<p className="mb-4"><strong>Social Media Information</strong></p>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Pinterest</Form.Label>
													<Form.Control type="url" value={settings.pinterest} onChange={(e) => { setSettings({ ...settings, pinterest: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.pinterest ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.pinterest}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Facebook</Form.Label>
													<Form.Control type="url" value={settings.facebook} onChange={(e) => { setSettings({ ...settings, facebook: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.facebook ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.facebook}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Twitter</Form.Label>
													<Form.Control type="url" value={settings.twitter} onChange={(e) => { setSettings({ ...settings, twitter: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.twitter ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.twitter}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Linkedin</Form.Label>
													<Form.Control type="url" value={settings.linkedin} onChange={(e) => { setSettings({ ...settings, linkedin: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.linkedin ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.linkedin}</label>
												</span>
											</Col>
											
										</Row>
										<hr/>
										<Row>
											<Col sm={12}>
												<p className="mb-4"><strong>Email Settings</strong></p>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Order Email Recipients<span className="text-danger"> *</span></Form.Label>
													<Form.Control type="email" value={settings.orderEmailRecipients} onChange={(e) => { setSettings({ ...settings, orderEmailRecipients: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.orderEmailRecipients ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.orderEmailRecipients}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Registration Email Recipients<span className="text-danger"> *</span></Form.Label>
													<Form.Control type="email" value={settings.registrationEmailRecipients} onChange={(e) => { setSettings({ ...settings, registrationEmailRecipients: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.registrationEmailRecipients ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.registrationEmailRecipients}</label>
												</span>
											</Col>

										</Row>
										<hr/>
										<Row>
											<Col sm={12}>
												<p className="mb-4"><strong>Account Inactivity Follow Ups</strong></p>
											</Col>
											<Col xl={4} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">First Notification <small>(In days)<span className="text-danger"> *</span></small></Form.Label>
													<Form.Control type="number" value={settings.firstNotificationDays} onChange={(e) => { setSettings({ ...settings, firstNotificationDays: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={  msg.firstNotificationDays ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.firstNotificationDays}</label>
												</span>
											</Col>
											<Col xl={4} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Second Notification <small>(In days)<span className="text-danger"> *</span></small></Form.Label>
													<Form.Control type="number" value={settings.secondNotificationDays} onChange={(e) => { setSettings({ ...settings, secondNotificationDays: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={  msg.secondNotificationDays ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.secondNotificationDays}</label>
												</span>
											</Col>
											<Col xl={4} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Third Notification <small>(In days)<span className="text-danger"> *</span></small></Form.Label>
													<Form.Control type="number" value={settings.thirdNotificationDays} onChange={(e) => { setSettings({ ...settings, thirdNotificationDays: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={  msg.thirdNotificationDays ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.thirdNotificationDays}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Account In Active Time Limit <small>(Recommended 30 days)<span className="text-danger"> *</span></small></Form.Label>
													<Form.Control type="number" value={settings.inactiveAfterDays} onChange={(e) => { setSettings({ ...settings, inactiveAfterDays: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={  msg.inactiveAfterDays ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.inactiveAfterDays}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Account Soft Delete Time Limit <small>(Recommended 30 days)<span className="text-danger"> *</span></small></Form.Label>
													<Form.Control type="number" value={settings.softDeleteAfterDays} onChange={(e) => { setSettings({ ...settings, softDeleteAfterDays: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={  msg.softDeleteAfterDays ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.softDeleteAfterDays}</label>
												</span>
											</Col>
											
										</Row>
										<hr/>

										<Row>
											<Col sm={12}>
												<p className="mb-4"><strong>Low License</strong></p>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Low License Notification Count<span className="text-danger"> *</span></Form.Label>
													<Form.Control type="number" value={settings.licenseNotificationCount} onChange={(e) => { setSettings({ ...settings, licenseNotificationCount: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.licenseNotificationCount ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.licenseNotificationCount}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Low License Notification Threshold<span className="text-danger"> *</span></Form.Label>
													<Form.Control type="number" value={settings.licenseThresholdCount} onChange={(e) => { setSettings({ ...settings, licenseThresholdCount: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.licenseThresholdCount ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.licenseThresholdCount}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">License Notification Duration Days<span className="text-danger"> *</span></Form.Label>
													<Form.Control type="number" value={settings.licenseNotificationDurationDays} onChange={(e) => { setSettings({ ...settings, licenseNotificationDurationDays: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.licenseNotificationDurationDays ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.licenseNotificationDurationDays}</label>
												</span>
											</Col>
											
										</Row>
										<hr/>

										<Row>
											<Col sm={12}>
												<p className="mb-4"><strong>Mailgun Settings</strong></p>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Private Key<span className="text-danger"> *</span></Form.Label>
													<Form.Control type="text" value={settings.mailgunPrivateKey} onChange={(e) => { setSettings({ ...settings, mailgunPrivateKey: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.mailgunPrivateKey ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.mailgunPrivateKey}</label>
												</span>
											</Col>
											<Col xl={6} sm={6}>
												<Form.Group>
													<Form.Label className="d-block mb-2">Domain<span className="text-danger"> *</span></Form.Label>
													<Form.Control type="text" value={settings.mailgunDomain} onChange={(e) => { setSettings({ ...settings, mailgunDomain: e.target.value }) }}></Form.Control>
												</Form.Group>
												<span className={msg.mailgunDomain ? `` : `d-none`}>
													<label className="pl-1 pt-0 text-danger">{msg.mailgunDomain}</label>
												</span>
											</Col>
											
										</Row>
									</Card.Body>


									<Card.Footer>
										<Row className="float-right">
											{
												permissions && permissions.editSetting &&
													<Col sm={12}>
														<Button variant="info" onClick={submit}>Save Settings</Button>
													</Col>
											}
										</Row>
									</Card.Footer>
									
									
								</Card>
							</Form>
						</Col>
					</Row>
				</Container>
			}
		</>
	);
}

const mapStateToProps = state => ({
	settings: state.settings,
	error: state.error,
	getRoleRes: state.role.getRoleRes

});

export default connect(mapStateToProps, { getSettings, beforeSettings, editSettings, getRole })(SiteSettings);
