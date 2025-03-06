import contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
    const result = await contactsService.listContacts(req.user.id);

    res.json(result);
};

export const getOneContact = async (req, res) => {
    const {id} = req.params;
    const result = await contactsService.getContactById(id, req.user.id);
    
    if (!result) {
        throw HttpError(404, `Not found`);
    }

    res.json(result);
};

export const deleteContact = async (req, res) => {
    const {id} = req.params;
    const result = await contactsService.removeContact(id, req.user.id);
    
    if (!result) {
        throw HttpError(404, `Not found`);
    }

    res.json(result);
};

export const createContact = async (req, res) => {
    const result = await contactsService.addContact(req.body.name, req.body.email, req.body.phone, req.user.id);

    res.status(201).json(result);
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const updatedContact = await contactsService.updateContact(id, req.user.id, req.body);

    if (!updatedContact) {
        throw HttpError(404, `Not found`);
    }

    res.status(200).json(updatedContact);
};

export const updateStatusContact = async (req, res) => {
    const { id } = req.params;
    const updatedContact = await contactsService.updateStatusContact(id, req.user.id, req.body);

    if (!updatedContact) {    
        throw HttpError(404, `Not found`);
    }

    res.status(200).json(updatedContact);
};