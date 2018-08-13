import * as React from 'react';
import classNames from 'classnames';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { SortDirection } from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HistoryIcon from '@material-ui/icons/AssignmentInd';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import { ICustomTableProps, IContact, IEnhancedTableToolbarProps, IEnhancedTableHeadProps } from '../interfaces';

const columnData = [
    { id: 'firstName', numeric: false, disablePadding: true, label: 'First Name' },
    { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
    { id: 'dateOfBirth', numeric: false, disablePadding: false, label: 'Date of Birth' },
    { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Phone Number' },
];

class EnhancedTableHead extends React.Component<IEnhancedTableHeadProps, {}> {
    createSortHandler = (property: any) => (event: any) => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {columnData.map(column => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                padding={column.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === column.id ? (order as SortDirection) : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        onClick={this.createSortHandler(column.id)}
                                        direction={order as 'asc' | 'desc'}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                    <TableCell sortDirection={false} padding={'default'}>
                        Actions
                    </TableCell>
                </TableRow>
            </TableHead>
        );
    }
}

const toolbarStyles = (theme: any) => createStyles({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

const EnhancedToolbar = (props: IEnhancedTableToolbarProps) => {
    const { numSelected, classes, deleteSelected } = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subheading">
                        {numSelected} selected
          </Typography>
                ) : (
                        <Typography variant="title" id="tableTitle">
                            Contacts
          </Typography>
                    )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon onClick={deleteSelected} />
                        </IconButton>
                    </Tooltip>
                ) : (
                        <Tooltip title="Filter list">
                            <IconButton aria-label="Filter list">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    )}
            </div>
        </Toolbar>
    );
};

const EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedToolbar);

const styles = (theme: any) => createStyles({
    root: {
        width: '90%',
        marginTop: theme.spacing.unit * 3,
        marginLeft: '5%'
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class EnhancedTable extends React.Component<ICustomTableProps, {}> {
    isSelected = (uuid: string) => this.props.selected.indexOf(uuid) !== -1;

    render() {
        const {
            data,
            handleRequestSort,
            handleSelectAllClick,
            handleClick,
            selected,
            tableSortProperties,
            classes,
            deleteSelected,
            handleEditAction,
            handleViewHistoryAction
        } = this.props;
        const { order, orderBy } = tableSortProperties;

        return (
            <Paper className={classes.root}>
                <EnhancedTableToolbar numSelected={selected.length} deleteSelected={deleteSelected} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {
                                data.map((item: any) => {
                                    const isSelected = this.isSelected(item.uuid);
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={item.uuid}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} onChange={(event: any) => handleClick(event, item.uuid)} />
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {item.firstName}
                                            </TableCell>
                                            <TableCell>{item.lastName}</TableCell>
                                            <TableCell>{item.dateOfBirth}</TableCell>
                                            <TableCell>{item.phoneNumber}</TableCell>
                                            <TableCell>
                                                <IconButton aria-label="Edit" onClick={() => handleEditAction(item.uuid)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton aria-label="History" onClick={() => handleViewHistoryAction(item.uuid)}>
                                                    <HistoryIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(EnhancedTable);
