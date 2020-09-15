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
            <Label for="value_zh">Value of Chinese</Label>
            <Input
                type="textarea"
                name="value_zh"
                id="value_zh"
                placeholder="Enter English Name"
                value={addNewUserDetails.value_zh}
                onChange={(e) => onChangeAddNewUserDetails('value_zh', e.target.value)}
            />
        </FormGroup>
         <FormGroup>
            <Label for="userName">Value of Russian</Label>
            <Input
                type="textarea"
                name="value_ru"
                id="value_ru"
                placeholder="Enter Russian Name"
                value={addNewUserDetails.value_ru}
                onChange={(e) => onChangeAddNewUserDetails('value_ru', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="value_ko">Value of Korean</Label>
            <Input 
               type="textarea" 
               name="value_ko" 
               id="value_ko"
               placeholder="Enter Korean Name" 
               value={addNewUserDetails.value_ko} 
               onChange={(e) => onChangeAddNewUserDetails('value_ko', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_ja">Value of Japanese</Label>
            <Input 
               type="textarea" 
               name="value_ja" 
               id="value_ja"
               placeholder="Enter Japanese Name" 
               value={addNewUserDetails.value_ja} 
               onChange={(e) => onChangeAddNewUserDetails('value_ja', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_it">Value of Italian</Label>
            <Input 
               type="textarea" 
               name="value_it" 
               id="value_it"
               placeholder="Enter Italian Name" 
               value={addNewUserDetails.value_it} 
               onChange={(e) => onChangeAddNewUserDetails('value_it', e.target.value)} />
        </FormGroup>
         <FormGroup>
            <Label for="value_hu">Value of Hungrian</Label>
            <Input 
               type="textarea" 
               name="value_hu" 
               id="value_hu"
               placeholder="Enter Hungrian Name" 
               value={addNewUserDetails.value_hu} 
               onChange={(e) => onChangeAddNewUserDetails('value_hu', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_he">Value of Hebrew</Label>
            <Input 
               type="textarea" 
               name="value_he" 
               id="value_he"
               placeholder="Enter Hebrew Name" 
               value={addNewUserDetails.value_he} 
               onChange={(e) => onChangeAddNewUserDetails('value_he', e.target.value)} />
        </FormGroup>

        <FormGroup>
            <Label for="value_fr">Value of French</Label>
            <Input 
               type="textarea" 
               name="value_fr" 
               id="value_fr"
               placeholder="Enter French Name" 
               value={addNewUserDetails.value_fr} 
               onChange={(e) => onChangeAddNewUserDetails('value_fr', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_es">Value of Spanish</Label>
            <Input 
               type="textarea" 
               name="value_es" 
               id="value_es"
               placeholder="Enter Spanish Name" 
               value={addNewUserDetails.value_es} 
               onChange={(e) => onChangeAddNewUserDetails('value_es', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_de">Value of German</Label>
            <Input 
               type="textarea" 
               name="value_de" 
               id="value_de"
               placeholder="Enter German Name" 
               value={addNewUserDetails.value_de} 
               onChange={(e) => onChangeAddNewUserDetails('value_de', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_ar">Value of Arabic</Label>
            <Input 
               type="textarea" 
               name="value_ar" 
               id="value_ar"
               placeholder="Enter Arabic Name" 
               value={addNewUserDetails.value_ar} 
               onChange={(e) => onChangeAddNewUserDetails('value_ar', e.target.value)} />
        </FormGroup>
    </Form>
    )
};

export default AddNewUserForm;

