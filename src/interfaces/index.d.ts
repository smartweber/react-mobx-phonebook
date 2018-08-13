import { PhoneBookStore } from '../stores/phonebook';

interface IContact {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    phoneNumber: string,
    uuid: string,
    contactHistory: {
        firstName: Array<string>,
        lastName: Array<string>,
        dateOfBirth: Array<string>,
        phoneNumber: Array<string>,
        [key: string]: any
    },
    [key: string]: any
}

interface IAppContainerProps {
    store: PhoneBookStore
}

interface INavBarProps {
    title: string
}

interface IContactFormProps {
    contactFormData: IContact,
    formMode: string,
    classes: any,
    changeHandler: any,
    saveContact: any,
    handleClose: any,
    errorMessage: any
}

interface IHistoryViewProps {
    contact: IContact,
    isOpen: boolean,
    classes: any,
    handleClose: any,
}

interface IFormField {
    name: string,
    type: string,
    label: string,
}

interface ITableSortInfo {
    order: string,
    orderBy: string
}

interface ITableProps {
    classes: any,
    contactList: Array<IContact>
    sortInfo: ITableSortInfo
}

interface ICustomTableProps {
    classes: any,
    data: Array<IContact>,
    selected: Array<string>,
    tableSortProperties: ITableSortInfo
    handleRequestSort: any,
    handleSelectAllClick: any,
    handleClick: any,
    deleteSelected: any,
    handleEditAction: any,
    handleViewHistoryAction: any,
}

interface IEnhancedTableToolbarProps {
    classes: any,
    deleteSelected: any,
    numSelected: number
}

interface IEnhancedTableHeadProps {
    numSelected: number,
    order: string,
    orderBy: string,
    rowCount: number,
    onSelectAllClick: any,
    onRequestSort: any,
}

interface IAutoSuggestProps {
    classes: any,
    suggestions: IContact[],
    setSearchKeyword: any,
}

interface IAutoSuggestState {
    value: string,
    suggestions: IContact[]
}

export {
    IContact,
    IAppContainerProps,
    INavBarProps,
    IContactFormProps,
    IFormField,
    ITableProps,
    ITableSortInfo,
    ICustomTableProps,
    IEnhancedTableToolbarProps,
    IEnhancedTableHeadProps,
    IHistoryViewProps,
    IAutoSuggestProps,
    IAutoSuggestState
};