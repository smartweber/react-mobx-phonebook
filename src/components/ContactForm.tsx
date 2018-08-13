import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { IContactFormProps, IContact, IFormField } from '../interfaces';

export const schema: Array<IFormField> = [
    {
        name: 'firstName',
        type: 'text',
        label: 'First Name',
    },
    {
        name: 'lastName',
        type: 'text',
        label: 'Last Name',
    },
    {
        name: 'dateOfBirth',
        type: 'date',
        label: 'Date of Birth',
    },
    {
        name: 'phoneNumber',
        type: 'text',
        label: 'Phone Number',
    }
];

const styles = (theme: any) => createStyles({
    container: {
        width: '80%',
        marginLeft: 24,
    },
    button: {
        marginTop: 20,
        width: 168
    },
    textField: {
        marginRight: '2%',
        width: '48%'
    },
    paper: {
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing.unit * 4,
        paddingLeft: 41,
        height: 200,
        outline: 'none',
    },
});

const ContactForm = (props: IContactFormProps) => {
    const { classes, contactFormData, changeHandler, saveContact, formMode, handleClose, errorMessage } = props;
    const toolBarHeader = formMode === 'create' ? 'Add Contact' : 'Edit Contact';
    return (
        < Modal
            open={formMode === 'create' || formMode === 'edit'}
            onClose={handleClose}
            style={{ justifyContent: 'center', alignItems: 'center', outline: 'none' }}
        >
            <div style={{ outline: 'none' }}>
                <Toolbar style={{ backgroundColor: '#4053AF' }}>
                    <Typography style={{ color: '#ffffff' }} >
                        {toolBarHeader}
                    </Typography>
                </Toolbar>
                <div className={classes.paper}>
                    {
                        schema.map((item, index) => {
                            const { name, type, label } = item;
                            return (
                                <TextField
                                    className={classes.textField}
                                    key={index}
                                    id={name}
                                    label={label}
                                    value={contactFormData[name]}
                                    onChange={changeHandler}
                                    type={type}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                />
                            );
                        })
                    }
                    {<div style={{ fontSize: 14, fontStyle: 'italic', color: 'red' }}>{errorMessage}</div>}
                    < Button className={classes.button} variant="contained" color="primary" onClick={saveContact} >
                        Save
                    </Button >
                </div>
            </div>
        </Modal >
    );
}

export default withStyles(styles)(ContactForm);