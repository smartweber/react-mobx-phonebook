import * as UuidGenerator from 'uuid';
import { observable, action, computed } from 'mobx';
import { IContact, ITableSortInfo } from '../interfaces';

const initContactState = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    uuid: '',
    contactHistory: {
        firstName: [] as string[],
        lastName: [] as string[],
        dateOfBirth: [] as string[],
        phoneNumber: [] as string[],
    },
};

const initContacts = [
    {
        firstName: 'Kenny',
        lastName: 'John',
        dateOfBirth: '1993-10-18',
        phoneNumber: '(709) 722-6130',
        uuid: '1',
        contactHistory: {
            firstName: [] as string[],
            lastName: [] as string[],
            dateOfBirth: [] as string[],
            phoneNumber: ['(709) 722-6010'],
        }
    },
    {
        firstName: 'Ricardo',
        lastName: 'Powell',
        dateOfBirth: '1990-10-18',
        phoneNumber: '(709) 722-3202',
        uuid: '2',
        contactHistory: {
            firstName: [] as string[],
            lastName: [] as string[],
            dateOfBirth: [] as string[],
            phoneNumber: []
        }
    },
    {
        firstName: 'Scott',
        lastName: 'Michael',
        dateOfBirth: '1999-11-19',
        phoneNumber: '(709) 579-0852',
        uuid: '3',
        contactHistory: {
            firstName: [] as string[],
            lastName: [] as string[],
            dateOfBirth: [] as string[],
            phoneNumber: ['(709) 579-0852', '(701) 619-0915']
        }
    },
    {
        firstName: 'Paul',
        lastName: 'Karen',
        dateOfBirth: '1999-11-19',
        phoneNumber: '(709) 726-1215',
        uuid: '4',
        contactHistory: {
            firstName: [] as string[],
            lastName: [] as string[],
            dateOfBirth: [] as string[],
            phoneNumber: ['(709) 579-0641']
        }
    },
    {
        firstName: 'Doris',
        lastName: 'Anthony',
        dateOfBirth: '1999-11-19',
        phoneNumber: '(378) 400-1234',
        uuid: '5',
        contactHistory: {
            firstName: [] as string[],
            lastName: [] as string[],
            dateOfBirth: [] as string[],
            phoneNumber: ['(709) 579-8820']
        }
    }
]

const initSortInfo = {
    order: 'asc',
    orderBy: 'firstName'
}

const sortFunction = (order: string, orderBy: string) => {
    return order === 'desc'
        ? (a: IContact, b: IContact) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a: IContact, b: IContact) => (a[orderBy] < b[orderBy] ? -1 : 1)
};
class PhoneBookStore {
    @observable contacts: Array<IContact> = [...initContacts];

    @observable contactForm: IContact = { ...initContactState };

    @observable searchKeyword: string = '';

    /* can be either create or edit or none */
    @observable contactFormMode: string = 'none';

    @observable tableSortInfo: ITableSortInfo = { ...initSortInfo }

    @observable selectedContactsForDeletion: Array<string> = []

    @observable selectedUuidForEdit: string = ''

    @observable selectedUuidForViewingHistory: string = ''

    @observable isHistoryViewOpen: boolean = false

    @observable errorMessage: string = ''

    @computed
    get contactList() {
        const { order, orderBy } = this.tableSortInfo;
        return this.contacts.slice().sort(sortFunction(order, orderBy));
    }

    @computed
    get searchResultList() {
        if (this.searchKeyword === '') {
            return this.contactList.slice()
        }
        const lowerCaseKeyword = this.searchKeyword.toLowerCase();
        return this.contactList.filter(item => {
            const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
            return (
                fullName.indexOf(lowerCaseKeyword) >= 0 ||
                item.phoneNumber.toLowerCase().indexOf(lowerCaseKeyword) >= 0 ||
                item.dateOfBirth.toLowerCase().indexOf(lowerCaseKeyword) >= 0
            );
        });
    }

    @computed
    get contactFormInputData() {
        return this.contactForm;
    }

    @computed
    get selectedContacts() {
        return this.selectedContactsForDeletion
    }

    @computed
    get tableSortProperties() {
        return this.tableSortInfo
    }

    @computed
    get formMode() {
        return this.contactFormMode;
    }

    @computed
    get historyViewFlag() {
        return this.isHistoryViewOpen;
    }

    @computed
    get selectedContactForViewingHistory() {
        const filteredContacts = this.searchResultList.filter(item => item.uuid === this.selectedUuidForViewingHistory);
        if (filteredContacts.length) {
            return filteredContacts[0];
        }
        return { ...initContactState } as IContact;
    }

    @computed
    get formErrorMessage() {
        return this.errorMessage;
    }

    @action
    setContactFormModeToCreate = () => {
        this.contactFormMode = 'create';
    }

    @action
    setContactFormModeToEdit = (uuid: string) => {
        this.contactFormMode = 'edit';
        this.selectedUuidForEdit = uuid;
        const selectedContactForEdit = this.searchResultList.filter(item => item.uuid === uuid)[0];
        this.contactForm = { ...selectedContactForEdit };
    }

    @action
    setContactFormModeToNone = () => {
        this.contactFormMode = 'none';
        this.contactForm = { ...initContactState };
        this.selectedUuidForEdit = '';
        this.selectedUuidForViewingHistory = '';
        this.errorMessage = '';
    }

    @action
    setSearchKeyword = (keyword: string) => {
        this.searchKeyword = keyword.trim();
        this.selectedContactsForDeletion = [];
    }

    @action
    setContactFormData = (event: any) => {
        this.errorMessage = '';
        this.contactForm = { ...this.contactForm, [event.target.id]: event.target.value };
    }

    @action
    saveContact = () => {
        const { firstName, lastName, dateOfBirth, phoneNumber } = this.contactForm;
        if (firstName && lastName && dateOfBirth && phoneNumber) {
            switch (this.contactFormMode) {
                case 'create': {
                    this.contacts.push({ ...this.contactForm, uuid: UuidGenerator.v4() });
                    this.contactForm = { ...initContactState };
                    break;
                }

                case 'edit': {
                    /* Identify the contact in contact list that is being edited */
                    let contactBeingEdited: IContact;
                    let contactIndex: number;
                    this.contacts.some((item, index, list) => {
                        contactIndex = index;
                        contactBeingEdited = list[index];
                        return item.uuid === this.selectedUuidForEdit
                    });
                    const updatedContact = { ...contactBeingEdited, ...this.contactForm };
                    /* Identify if phone number has changed or not and push to the history if it has changed */
                    const keys = ['firstName', 'lastName', 'dateOfBirth', 'phoneNumber'];
                    keys.forEach(key => {
                        if (this.contactForm[key] !== contactBeingEdited[key]) {
                            updatedContact.contactHistory[key].push(contactBeingEdited[key]);
                        }
                    })
                    this.contacts[contactIndex] = updatedContact;
                    this.contacts = this.contacts.slice();
                    this.contactForm = { ...initContactState };
                }

                default: {
                    break;
                }
            }
            this.contactFormMode = 'none'
        } else {
            this.errorMessage = '** All contact details are required'
        }
    }

    @action
    setTableSortInfo = (event: any, property: string) => {
        const orderBy = property;
        let order = 'desc';
        if (this.tableSortInfo.orderBy === property && this.tableSortInfo.order === 'desc') {
            order = 'asc';
        }
        this.tableSortInfo = { order, orderBy };
    }

    @action
    selectAllContactsForDeletion = (event: any, checked: boolean) => {
        if (checked) {
            const selectedUuids = this.searchResultList.map(contact => contact.uuid);
            this.selectedContactsForDeletion = this.contacts.filter(contact => selectedUuids.indexOf(contact.uuid) > -1).map(contact => contact.uuid);
            return;
        }
        this.selectedContactsForDeletion = [];
    }

    @action
    toggleSelectionOfContactsForDeletion = (event: any, uuid: string) => {
        const selectedContact = this.contacts.filter(item => item.uuid === uuid)[0];
        const index = this.selectedContactsForDeletion.indexOf(selectedContact.uuid);
        if (index > -1) {
            this.selectedContactsForDeletion.splice(index, 1);
            this.selectedContactsForDeletion = [...this.selectedContactsForDeletion];
        }
        if (index === -1) {
            this.selectedContactsForDeletion = [...this.selectedContactsForDeletion, selectedContact.uuid]
        }
    }

    @action
    deleteContacts = (event: any) => {
        this.contacts = this.contacts.filter(contact => this.selectedContactsForDeletion.indexOf(contact.uuid) < 0);
        this.selectedContactsForDeletion = [];
    }

    @action
    handleHistoryViewClose = () => {
        this.isHistoryViewOpen = false;
        this.selectedUuidForViewingHistory = '';
    }

    @action
    handleViewHistoryAction = (uuid: string) => {
        this.selectedUuidForViewingHistory = uuid;
        this.isHistoryViewOpen = true;
    }
}

const store = new PhoneBookStore();
export default store;
export { PhoneBookStore };