import Contact from "../db/models/Contact.js";

async function listContacts() {
  return await Contact.findAll();
}

async function getContactById(contactId) {
  return await Contact.findByPk(contactId);
}

async function addContact(name, email, phone) {
  return await Contact.create({ name, email, phone });
}

const updateContact = async (contactId, data) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  return await contact.update(data);
};

const updateStatusContact = async (contactId, data) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  return await contact.update({ favorite: data.favorite });
};

async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

export default{ listContacts, getContactById, addContact, updateContact, updateStatusContact, removeContact };
