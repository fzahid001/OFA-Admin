import React from 'react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { uploadPlugin } from './ckEditor';
// import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';

function CKEditor_Editor(props) {
    
    return (
        <React.Fragment>
            <CKEditor
                
                config={
                    {
                        extraPlugins: [uploadPlugin],
                        htmlSupport: {
                            allow: [
                                // Enables plain <div> elements.
                                {
                                    name: 'div'
                                },

                                // Enables plain <div>, <section> and <article> elements.
                                {
                                    name: /^(div|section|article)$/
                                },

                                // Enables <div>s with all inline styles (but no other attributes).
                                {
                                    name: 'div',
                                    styles: true
                                },

                                // Enables <div>s with foo and bar classes.
                                {
                                    name: 'div',
                                    classes: [ 'foo', 'bar' ]
                                },

                                // Adds support for `foo` and `bar` classes to the already supported
                                // <p> elements (those are enabled by the dedicated paragraph feature).
                                {
                                    name: 'p',
                                    classes: [ 'foo', 'bar' ]
                                },

                                // Enables <div>s with foo="true" attribute and bar attribute that
                                // can accept any value (boolean `true` value works as an asterisk).
                                {
                                    name: 'div',
                                    attributes: {
                                        foo: 'true',
                                        bar: true
                                    }
                                },
                            ]
                        },
                        toolbar: {
                            items: [
                                // 'heading',
                                // '|',
                                'fontFamily',
                                'fontSize',
                                '|',
                                'fontColor',
                                'fontBackgroundColor',
                                '|',
                                'bold',
                                'underline',
                                'italic',
                                '|',
                                'removeFormat',
                                '|',
                                'alignment',
                                'link',
                                'horizontalLine',
                                '|',
                                'bulletedList',
                                'numberedList',
                                'blockQuote',
                                '|',
                                'outdent',
                                'indent',
                                '|',
                                'imageUpload',
                                'mediaEmbed',
                                'insertTable',
                                'undo',
                                'redo',
                                'sourceEditing'
                            ]
                        },
                        image: {
                            // Configure the available styles.
                            styles: [
                            'alignLeft', 'alignCenter', 'alignRight', 'resizeImage'
                            ],

                            // You need to configure the image toolbar, too, so it shows the new style
                            // buttons as well as the resize buttons.
                            toolbar: [
                            'resizeImage:25', 'resizeImage:50', 'resizeImage:75', 'resizeImage:original', 'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
                            '|',
                            'resizeImage',
                            '|',
                            'imageTextAlternative'
                            ]
                        }
                    }
                  }
                editor={ClassicEditor}
                data={props.data}
                content={props.content}
                onChange={(event, editor) => props.onChange(event, editor)}
            />
        </React.Fragment>
    );
};

export default CKEditor_Editor;