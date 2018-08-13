import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = (theme: any) => withStyles({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

const SimpleTable = (props: any) => {
    const { classes, columnData, rowData } = props;
    return (
        <Paper >
            <Table >
                <TableHead>
                    <TableRow>
                        {
                            columnData.map((item: any) => {
                                return (
                                    <TableCell key={item.id}>
                                        {item.label}
                                    </TableCell>
                                );
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rowData.map((rowItem: any, index: number) => {
                            return (
                                <TableRow key={index}>
                                    {
                                        columnData.map((column: any, innerIndex: number) => {
                                            return (
                                                <TableCell key={innerIndex}>
                                                    {
                                                        rowItem[column.id]
                                                    }
                                                </TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </Paper>
    );
}

export default withStyles(styles)(SimpleTable);
