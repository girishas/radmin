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
            <Label for="value_zh">Value of Chinese</Label>
            <Input
                type="textarea"
                name="value_zh"
                id="value_zh"
                placeholder="Enter English Name"
                value={user.value_zh}
                onChange={(e) => onUpdateUserDetail('value_zh', e.target.value)}
            />
        </FormGroup>
         <FormGroup>
            <Label for="userName">Value of Russian</Label>
            <Input
                type="textarea"
                name="value_ru"
                id="value_ru"
                placeholder="Enter Russian Name"
                value={user.value_ru}
                onChange={(e) => onUpdateUserDetail('value_ru', e.target.value)}
            />
        </FormGroup>
        <FormGroup>
            <Label for="value_ko">Value of Korean</Label>
            <Input 
               type="textarea" 
               name="value_ko" 
               id="value_ko"
               placeholder="Enter Korean Name" 
               value={user.value_ko} 
               onChange={(e) => onUpdateUserDetail('value_ko', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_ja">Value of Japanese</Label>
            <Input 
               type="textarea" 
               name="value_ja" 
               id="value_ja"
               placeholder="Enter Japanese Name" 
               value={user.value_ja} 
               onChange={(e) => onUpdateUserDetail('value_ja', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_it">Value of Italian</Label>
            <Input 
               type="textarea" 
               name="value_it" 
               id="value_it"
               placeholder="Enter Italian Name" 
               value={user.value_it} 
               onChange={(e) => onUpdateUserDetail('value_it', e.target.value)} />
        </FormGroup>
         <FormGroup>
            <Label for="value_hu">Value of Hungrian</Label>
            <Input 
               type="textarea" 
               name="value_hu" 
               id="value_hu"
               placeholder="Enter Hungrian Name" 
               value={user.value_hu} 
               onChange={(e) => onUpdateUserDetail('value_hu', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_he">Value of Hebrew</Label>
            <Input 
               type="textarea" 
               name="value_he" 
               id="value_he"
               placeholder="Enter Hebrew Name" 
               value={user.value_he} 
               onChange={(e) => onUpdateUserDetail('value_he', e.target.value)} />
        </FormGroup>

        <FormGroup>
            <Label for="value_fr">Value of French</Label>
            <Input 
               type="textarea" 
               name="value_fr" 
               id="value_fr"
               placeholder="Enter French Name" 
               value={user.value_fr} 
               onChange={(e) => onUpdateUserDetail('value_fr', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_es">Value of Spanish</Label>
            <Input 
               type="textarea" 
               name="value_es" 
               id="value_es"
               placeholder="Enter Spanish Name" 
               value={user.value_es} 
               onChange={(e) => onUpdateUserDetail('value_es', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_de">Value of German</Label>
            <Input 
               type="textarea" 
               name="value_de" 
               id="value_de"
               placeholder="Enter German Name" 
               value={user.value_de} 
               onChange={(e) => onUpdateUserDetail('value_de', e.target.value)} />
        </FormGroup>
        <FormGroup>
            <Label for="value_ar">Value of Arabic</Label>
            <Input 
               type="textarea" 
               name="value_ar" 
               id="value_ar"
               placeholder="Enter Arabic Name" 
               value={user.value_ar} 
               onChange={(e) => onUpdateUserDetail('value_ar', e.target.value)} />
        </FormGroup>
    </Form>
);

export default UpdateUserForm;


