/**
 * Update User Details Form
 */
import React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

const UpdateUserForm = ({ user, onUpdateUserDetail, error }) => (
    <Form>
        <FormGroup>
            <Label for="userName">Key</Label>
            <Input
                type="text"
                name="userName"
                id="userName"
                placeholder="Enter Key"
                value={user.slug}
                onChange={(e) => onUpdateUserDetail('slug', e.target.value)}
                disabled="disabled"
            />
        </FormGroup>
        <FormGroup>
            <Label for="value_en">Value of English</Label>
            <Input
                type="textarea"
                name="value_en"
                id="value_en"
                placeholder="Enter English Name"
                value={user.value_en}
                onChange={(e) => onUpdateUserDetail('value_en', e.target.value)}
            />
             {error && 
            <span style={{color: "red"}}>{error.value_en}</span>
            }
        </FormGroup>
       
        <FormGroup>
            <Label for="value_fr">Value of Français</Label>
            <Input 
               type="textarea" 
               name="value_fr" 
               id="value_fr"
               placeholder="Enter Français" 
               value={user.value_fr} 
               onChange={(e) => onUpdateUserDetail('value_fr', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_es">Value of Español</Label>
            <Input 
               type="textarea" 
               name="value_es" 
               id="value_es"
               placeholder="Enter Español" 
               value={user.value_es} 
               onChange={(e) => onUpdateUserDetail('value_es', e.target.value)} />
        </FormGroup>
       
    </Form>
);

export default UpdateUserForm;


