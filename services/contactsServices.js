import Contact from "../db/models/Contact.js";

async function listContacts(owner) {
  return await Contact.findAll({ where: { owner } });
}

async function getContactById(contactId, owner) {
  return await Contact.findOne({ where: { id: contactId, owner } });
}

async function addContact(name, email, phone, owner) {
  return await Contact.create({ name, email, phone, owner });
}

const updateContact = async (contactId, owner, data) => {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });
  if (!contact) return null;
  return await contact.update(data);
};

const updateStatusContact = async (contactId, owner, data) => {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });
  if (!contact) return null;
  return await contact.update({ favorite: data.favorite });
};

async function removeContact(contactId, owner) {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

export default{ listContacts, getContactById, addContact, updateContact, updateStatusContact, removeContact };
