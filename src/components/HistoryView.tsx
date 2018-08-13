import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { schema } from './ContactForm';
import Paper from '@material-ui/core/Paper';

import { IHistoryViewProps } from '../interfaces';
import Table from './Table';

const styles = (theme: any) => createStyles({
    container: {
        marginLeft: 24,
    },
    textField: {
        marginRight: '2%',
        width: '48%'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing.unit * 4,
        paddingLeft: 41,
        minHeight: 200,
        outline: 'none',
    },
});

const columnData = [
    { id: 'firstName', numeric: false, disablePadding: true, label: 'First Name' },
    { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
    { id: 'dateOfBirth', numeric: false, disablePadding: false, label: 'Date of Birth' },
    { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Phone Number' },
];

const getSymmetricTableRowData = (contact: any) => {
    const allContactHistory = {} as any;
    const keys = columnData.map(item => item.id);
    keys.forEach(item => {
        allContactHistory[item] = [contact[item]].concat(contact.contactHistory[item].reverse())
    })
    const historyLengths = keys.map(item => allContactHistory[item].length);
    const numberOfRows = Math.max(...historyLengths);
    const rowData = [];
    for (let i = 0; i < numberOfRows; i++) {
        let rowItem = {} as any;
        keys.forEach(key => {
            rowItem[key] = i < allContactHistory[key].length ? allContactHistory[key][i] : '';
        })
        rowData.push(rowItem);
    }
    return rowData;
}

const HistoryView = (props: IHistoryViewProps) => {
    const { classes, contact, isOpen, handleClose } = props;
    const toolbarHeader = 'Contact Details';
    const rowData = getSymmetricTableRowData(contact);
    return (
        < Modal
            open={isOpen}
            onClose={handleClose}
            style={{ justifyContent: 'center', alignItems: 'center', outline: 'none' }}
        >
            <div style={{ outline: 'none' }}>
                <Toolbar style={{ backgroundColor: '#4053AF' }}>
                    <Typography style={{ color: '#ffffff' }} >
                        {toolbarHeader}
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
                                    value={contact[name]}
                                    type={type}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    disabled
                                    margin="normal"
                                />
                            );
                        })
                    }
                    <Table
                        columnData={columnData}
                        rowData={rowData}
                    />
                </div>
            </div>
        </Modal >
    );
}

export default withStyles(styles)(HistoryView);