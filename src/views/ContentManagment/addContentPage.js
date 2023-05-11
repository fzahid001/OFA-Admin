import React, { useState, useEffect, useRef } from 'react';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { addContent, getContent, updateContent } from './cms.action';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import CKEditor_Editor from '../../components/CkEditor/CKEditor_Editor';
import validator from 'validator';
var slugify = require('slugify')
import { useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom'

const AddContentPage = (props) => {

    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState()
    const [germanDescription, setGermanDescription] = useState()
    const [spanishDescription, setSpanishDescription] = useState()
    const [status, setStatus] = useState(true)
    const [header, setHeader] = useState(false)
    const [footer, setFooter] = useState(false)
    const [contentId, setContentId] = useState('')
    // let slug = useRef()
    const addContentPageRes = useSelector(state => state.content.addContentRes)
    const getContentRes = useSelector(state => state.content.getContentRes)
    const updateContentRes = useSelector(state => state.content.editContentRes)

    const [msg, setMsg] = useState({
        title: '',
        slug: '',
        desc: '',
        germanDescription: '',
        spanishDescription:''
    })
    const [isPathEdit, setIsPathEdit] = useState(false)
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        setLoader(false)
        let path = window.location.pathname.split('/')
        if(path.includes('edit-cms')){
            setIsPathEdit(true)
            let contentId = props.match.params.contentId
            setContentId(contentId)
            dispatch(getContent(contentId))
        }

    }, [])

    useEffect(()=>{
        if( addContentPageRes && Object.keys(addContentPageRes).length > 0){
            props.history.push('/cms')

        }

    },[addContentPageRes])

    useEffect(()=>{

       
        if(Object.keys(getContentRes).length > 0){
            
            let data = getContentRes.content
            setTitle(data.title)
            setSlug(data.slug)
            setDescription(data.description)
            setGermanDescription(data.germanDescription)
            // setSpanishDescription(data.spanishDescription)
            setStatus(data.status)
            setHeader(data.header)
            setFooter(data.footer)
            // slug.current.value = data.slug
        }
    },[getContentRes])

    useEffect(()=>{
        if(updateContentRes.success && Object.keys(updateContentRes.length > 0)){
            props.history.push('/cms')
            // setLoader(false)
        }
    },[updateContentRes])

    const addContentPageHandler = (type)=>{
        if (!validator.isEmpty(title) && !validator.isEmpty(description)) {
            setMsg({
                title: '',
                slug: '',
                desc: '',
                germanDescription: '',
                // spanishDescription:''
            })
        
        let payload = {
            title,
            // slug : slug.current.value ,
            slug, 
            description,
            germanDescription,
            // spanishDescription,
            status,
            header,
            footer
        }
        if(type === 1)
        {
        setLoader(true)
            dispatch(addContent(payload))
            setLoader(false)
        }
        if(type === 2){
            setLoader(true)
            payload._id = contentId
            dispatch(updateContent(payload))
            setLoader(false)
        }
        setLoader(true)
    }
    else {
            let title = ''
            let slug = ''
            let desc = ''
            let germanDescription = ''
            let spanishDescription = ''
            if (validator.isEmpty(title)) {
                title = 'Title Required.'
            }
            if (validator.isEmpty(slug)) {
                slug = 'Slug Required.'
            }
            if (validator.isEmpty(desc)) {
                desc = 'Description Required.'
            }
            if (validator.isEmpty(germanDescription)) {
                germanDescription = 'German Description Required.'
            }
            // if (validator.isEmpty(spanishDescription)) {
            //     spanishDescription = 'Spanish Description Required.'
            // }
            // setMsg({ title,slug, desc ,germanDescription, spanishDescription })
            setMsg({ title,slug, desc ,germanDescription })
        }
        
    }

    const onEditorChange = (event, editor) => {
        let editorData = event.editor.getData()
        setDescription(editorData)
    }
    const onGermanEditorChange = (event, editor) => {
        let editorData = event.editor.getData()
        setGermanDescription(editorData)
    }
    const onTitleChange = (event) => {
        setTitle(event.target.value)

        let lower = event.target.value
        lower = lower.toLowerCase()
        lower = lower.replace(/[|&;$%@"<>()+,*!#^~_]/g, "");
        lower = lower.replace(/  +/g, "-");
        lower = lower.replace(/ /g, "-");
        setSlug(lower)
      
    }
    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>
                        <Row>
                            <Col md="12">
                                <Card className="pb-3 table-big-boy">
                                    <Card.Header>
                                        <Card.Title as="h4">{isPathEdit ? 'Edit Content Page' : 'Add Content Page'}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Title<span className="text-danger"> *</span></label>
                                                    {/* <Form.Control
                                                        value={title ? title : ''}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        placeholder="Title"
                                                        type="text"
                                                    ></Form.Control> */}

                                                    <Form.Control
                                                        value={title ? title : ''}
                                                        onChange={(event) => onTitleChange(event)}
                                                        placeholder="Title"
                                                        type="text"
                                                    ></Form.Control>

                                                    <span className={msg.title ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{msg.title}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Slug<span className="text-danger"> </span></label>
                                                    {/* <Form.Control
                                                        value={slugify(title)}
                                                        placeholder="Slug"
                                                        type="text"
                                                        ref ={slug}
                                                    ></Form.Control> */}

                                                        <Form.Control
                                                             value={slug ? slug : ''}
                                                             onChange={(e) => setSlug(e.target.value.replace(/[|&;$%@"<>()+,*!#^~_]/g, "").replace(/\s/g, '').replace(/--/g, '-').toLowerCase())}
                                                            placeholder="Slug"
                                                            type="text"
                                                            // ref ={slug}
                                                        ></Form.Control>

                                                   
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="6">
                                                <label>Text / Description <span className="text-danger"> *</span></label>
                                                <CKEditor_Editor
                                                    data={description ? description : ''}
                                                    content={description ? description : ''}
                                                    // onChange={(event1, editor1) => onEditorChange(event1, editor1)}
                                                    onChange={(event, editor) => {
                                                        const contentData = editor.getData();
                                                        setDescription(contentData );
                                                    }}
                                                />

            

                                                <span className={msg.desc ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.desc}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        

                                        <Row>
                                            <Col md="12" sm="6">
                                                <label>German Text / Description <span className="text-danger"> *</span></label>
                                                <CKEditor_Editor
                                                    data={germanDescription ? germanDescription : ''}
                                                    content={germanDescription ? germanDescription : ''}
                                                    // onChange={(event, editor) => onGermanEditorChange(event, editor)}
                                                    onChange={(event, editor) => {
                                                        const contentData = editor.getData();
                                                        setGermanDescription(contentData );
                                                    }}
                                                />
                                                <span className={msg.germanDescription ? `` : `d-none`}>
                                                    <label className="pl-1 text-danger">{msg.germanDescription}</label>
                                                </span>
                                            </Col>
                                        </Row>
                                        {/* <Row>
                                            <Col md="6">
                                                <Form.Group className='d-flex align-items-center mt-4'>
                                                    <label>Include in header<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="header" type="radio" checked={header} value={header} onChange={()=>setHeader(true)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1'  onChange={(e) => setHeader(true)} ><i />Yes</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="header" type="radio" checked={!header} value={!header} onChange={(e) => setHeader(false)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => setHeader(false)} ><i />No</span>
                                                    </label>
                                                   
                                                </Form.Group>
                                            </Col>
                                        </Row> */}
                                        <Row>
                                            <Col md="6">
                                                <Form.Group className='d-flex align-items-center mt-4'>
                                                    <label>Include in footer<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="footer" type="radio" checked={footer} value={footer} onChange={()=>setFooter(true)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1'  onChange={(e) => setFooter(true)} ><i />Yes</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="footer" type="radio" checked={!footer} value={!footer} onChange={(e) => setFooter(false)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => setFooter(false)} ><i />No</span>
                                                    </label>
                                                   
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group className='d-flex align-items-center mt-4'>
                                                    <label>Status<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="status" type="radio" checked={status} value={status} onChange={()=>setStatus(true)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1'  onChange={(e) => setStatus(true)} ><i />Active</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <input name="status" type="radio" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => setStatus(false)} ><i />Inactive</span>
                                                    </label>
                                                   
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12" sm="6">
                                                <Button
                                                    className="btn-fill pull-right mt-3 float-right"
                                                    type="submit"
                                                    variant="info"
                                                    onClick = {()=>addContentPageHandler(isPathEdit ? 2 : 1)}
                                                >
                                                    {isPathEdit ? 'Update' : 'Add'}
                                                </Button>
                                                <Link to={'/cms'} >
                                                    <Button className="btn-fill pull-right mt-3" variant="info">
                                                     Back
                                                    </Button>
                                                </Link>
                                            </Col>
                                        </Row>
                                        
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    )
}



export default AddContentPage;