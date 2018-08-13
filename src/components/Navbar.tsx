import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { INavBarProps } from '../interfaces';

const NavBar = (props: INavBarProps) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="title" color="inherit">
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;