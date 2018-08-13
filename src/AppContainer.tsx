import * as React from 'react';
import { IAppContainerProps } from './interfaces';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';

import NavBar from './components/Navbar';
import phonebookStore from './stores/phonebook';
import ContactForm from './components/ContactForm';
import Table from './components/CustomTable';
import HistoryView from './components/HistoryView';
import AutoSuggest from './components/AutoSuggest';

@observer
class AppContainer extends React.Component {
    render() {
        const {
            contactList,
            setSearchKeyword,
            saveContact,
            setContactFormData,
            contactFormInputData,
            setContactFormModeToNone,
            formMode,
            formErrorMessage,
            historyViewFlag,
            selectedContactForViewingHistory,
            handleHistoryViewClose,
            searchResultList,
            tableSortProperties,
            setTableSortInfo,
            selectAllContactsForDeletion,
            toggleSelectionOfContactsForDeletion,
            selectedContacts,
            deleteContacts,
            setContactFormModeToEdit,
            handleViewHistoryAction,
            setContactFormModeToCreate,
        } = phonebookStore;

        return (
            <div>
                <NavBar title="PhoneBook" />
                <AutoSuggest
                    suggestions={contactList}
                    setSearchKeyword={setSearchKeyword}
                />
                <ContactForm
                    saveContact={saveContact}
                    changeHandler={setContactFormData}
                    contactFormData={contactFormInputData}
                    handleClose={setContactFormModeToNone}
                    formMode={formMode}
                    errorMessage={formErrorMessage}
                />
                <HistoryView
                    isOpen={historyViewFlag}
                    contact={selectedContactForViewingHistory}
                    handleClose={handleHistoryViewClose}
                />
                <Table data={searchResultList}
                    handleRequestSort={setTableSortInfo}
                    handleSelectAllClick={selectAllContactsForDeletion}
                    handleClick={toggleSelectionOfContactsForDeletion}
                    selected={selectedContacts}
                    tableSortProperties={tableSortProperties}
                    deleteSelected={deleteContacts}
                    handleEditAction={setContactFormModeToEdit}
                    handleViewHistoryAction={handleViewHistoryAction}
                />
                <div>
                    < Button variant="contained" color="primary" onClick={setContactFormModeToCreate} style={{ marginTop: 30, marginLeft: '5%' }}>
                        Add Contact
                    </Button >
                </div>
            </div >
        );
    }
}
export default AppContainer;