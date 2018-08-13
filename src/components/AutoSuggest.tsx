import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import ResetIcon from '@material-ui/icons/Close';
import { IContact, IAutoSuggestProps, IAutoSuggestState } from '../interfaces';

const match = require('autosuggest-highlight/match');
const parse = require('autosuggest-highlight/parse');

const styles = (theme: any) => createStyles({
    container: {
        flexGrow: 1,
        position: 'relative',
        height: 250,
        paddingRight: 15
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
        width: 300
    },
    suggestion: {
        display: 'block',
        width: 300
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
        width: 300
    },
    input: {
        color: 'white',
        paddingLeft: 8
    }
});

const renderInput = (inputProps: any) => {
    const { classes, ref, setSearchKeyword, keyword, handleReset, ...other } = inputProps;
    return (
        <div className="search-bar">
            <TextField
                style={{ background: 'rgba(255, 255, 255, 0.15)', width: 300 }}
                InputProps={{
                    inputRef: ref,
                    classes: {
                        input: classes.input,
                    },
                    ...other,
                }}
                onKeyDown={
                    (event: any) => {
                        if (event.key === 'Enter') {
                            setSearchKeyword(keyword)
                        }
                    }
                }
            />
            <SearchIcon
                style={{ cursor: 'pointer', fill: 'white', position: 'absolute', right: 42, top: 3 }}
                onClick={() => setSearchKeyword(keyword)}
            />
            <ResetIcon
                style={{ cursor: 'pointer', fill: 'white', position: 'absolute', right: 20, top: 3 }}
                onClick={() => { handleReset(); setSearchKeyword('') }}
            />
        </div>
    );
}

const renderSuggestion = (suggestion: IContact, additionalProps: any) => {
    const { query, isHighlighted } = additionalProps;
    const fullName = `${suggestion.firstName} ${suggestion.lastName}`;
    const matches = match(fullName, query);
    const parts = parse(fullName, matches);
    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map((part: any, index: number) => {
                    return part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 300 }}>
                            {part.text}
                        </span>
                    ) : (
                            <strong key={String(index)} style={{ fontWeight: 500 }}>
                                {part.text}
                            </strong>
                        );
                })}
            </div>
        </MenuItem>
    );
}

const renderSuggestionsContainer = (options: any) => {
    const { containerProps, children } = options;

    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

class IntegrationAutosuggest extends React.Component<IAutoSuggestProps, IAutoSuggestState> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: '' as string,
            suggestions: [] as IContact[]
        }
    }

    getSuggestionValue = (suggestion: IContact) => {
        const fullName = `${suggestion.firstName} ${suggestion.lastName}`
        this.props.setSearchKeyword(fullName);
        return fullName;
    }

    getSuggestions = (value: string) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
        const { suggestions } = this.props;
        return inputLength === 0
            ? []
            : suggestions.filter(suggestion => {
                const fullName = `${suggestion.firstName} ${suggestion.lastName}`
                /* const keep =
                    count < 5 && fullName.toLowerCase().slice(0, inputLength) === inputValue; */
                const keep =
                    count < 5 && fullName.toLowerCase().indexOf(inputValue) > -1;

                if (keep) {
                    count += 1;
                }
                return keep;
            });
    }

    render() {
        const { classes, setSearchKeyword } = this.props;
        return (
            <div style={{ position: 'absolute', top: 17, right: 0 }}>
                <Autosuggest
                    theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                    renderInputComponent={renderInput}
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                    renderSuggestionsContainer={renderSuggestionsContainer}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={{
                        classes,
                        placeholder: 'Search contacts',
                        value: this.state.value,
                        onChange: this.handleChange,
                        setSearchKeyword,
                        keyword: this.state.value,
                        handleReset: this.handleReset,
                    }}
                />
            </div>
        );
    }

    handleSuggestionsFetchRequested = (options: any) => {
        const { value } = options;
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = (event: any, options: any) => {
        const { newValue } = options;
        this.setState({
            value: newValue,
        });
    };

    handleReset = () => {
        this.setState({
            value: ''
        });
    }

}

export default withStyles(styles)(IntegrationAutosuggest);