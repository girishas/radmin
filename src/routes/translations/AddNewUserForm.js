/**
 * Add New User Form
 */
import React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

const AddNewUserForm = ({ addNewUserDetails, onChangeAddNewUserDetails, error }) =>{
 return(
    <Form>
        <FormGroup>
            <Label for="userName">Key</Label>
            <Input
                type="text"
                name="userName"
                id="userName"
                placeholder="Enter Key"
                value={addNewUserDetails.slug}
                onChange={(e) => onChangeAddNewUserDetails('slug', e.target.value)}
            />
            {error && 
            <span style={{color: "red"}}>{error.slug}</span>
            }

        </FormGroup>
        <FormGroup>
            <Label for="value_en">Value of English</Label>
            <Input
                type="textarea"
                name="value_en"
                id="value_en"
                placeholder="Enter English Name"
                value={addNewUserDetails.value_en}
                onChange={(e) => onChangeAddNewUserDetails('value_en', e.target.value)}
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
               value={addNewUserDetails.value_fr} 
               onChange={(e) => onChangeAddNewUserDetails('value_fr', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_es">Value of Español</Label>
            <Input 
               type="textarea" 
               name="value_es" 
               id="value_es"
               placeholder="Enter Español" 
               value={addNewUserDetails.value_es} 
               onChange={(e) => onChangeAddNewUserDetails('value_es', e.target.value)} />
        </FormGroup>
    </Form>
    )
};

export default AddNewUserForm;

