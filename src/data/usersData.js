import bcrypt from "bcrypt";

import { prisma } from "../infra/database/client.js";

const doHashPassword = async (rawPassword) => {
  const salt = await bcrypt.genSalt();

  const password = await bcrypt.hash(rawPassword, salt);

  return password;
};

export const getUsers = () => {
  return prisma.user.findMany();
};

export const getUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const getUser = (id) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const saveUser = async (payload) => {
  const hashedPassword = await doHashPassword(payload.password);

  return prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });
};

export const updateUser = (id, payload) => {
  return prisma.user.update({
    where: { id },
    data: {
      name: payload.name,
      email: payload.email,
    },
  });
};

export const deleteUser = (id) => {
  return prisma.user.delete({
    where: {
      id,
    },
  });
};
