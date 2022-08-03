import * as usersData from "../data/usersData.js";
import { ResourceNotFoundException } from "../domain/errors/ResourceNotFoundException.js";

export const getUsers = () => {
  return usersData.getUsers();
};

export const getUser = async (id) => {
  const user = await usersData.getUser(id);

  if (!user) throw new ResourceNotFoundException();

  return user;
};

export const saveUser = (payload) => {
  return usersData.saveUser(payload);
};

export const updateUser = async (id, payload) => {
  const user = await usersData.getUser(id);

  if (!user) throw new ResourceNotFoundException();

  return usersData.updateUser(id, payload);
};

export const deleteUser = (id) => {
  return usersData.deleteUser(id);
};
