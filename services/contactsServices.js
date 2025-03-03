import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((c) => c.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter((c) => c.id !== contactId);

  if (contacts.length === filteredContacts.length) return null;

  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));
  return contacts.find((c) => c.id === contactId);
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}

const updateContact = async (id, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...data };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

export default{ listContacts, getContactById, removeContact, addContact, updateContact };
