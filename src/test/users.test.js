import axios from "axios";
import crypto from "crypto";

import * as usersService from "../service/usersService";

const generate = () => {
  return crypto.randomBytes(20).toString("hex");
};

const http = (url, method, data) => {
  return axios({ url, method, data, validateStatus: false });
};

describe("test users resources", () => {
  test("should get users", async () => {
    // -- given
    const user = await usersService.saveUser({
      name: generate(),
      email: generate(),
      password: generate(),
    });

    // -- when
    const response = await http("http://localhost:6000/users", "get");

    const users = response.data;

    // -- then
    expect(users.map((user) => user.id)).toContain(user.id);

    await usersService.deleteUser(user.id);
  });

  test("should save users", async () => {
    // -- given
    const payload = {
      name: generate(),
      email: generate(),
      password: generate(),
    };

    // -- when
    const response = await http("http://localhost:6000/users", "post", payload);

    const user = response.data;

    // -- then
    expect(user.name).toBe(payload.name);
    expect(user.email).toBe(payload.email);

    await usersService.deleteUser(user.id);
  });

  test("should not save users", async () => {
    // -- given
    const payload = {
      name: generate(),
      email: generate(),
      password: generate(),
    };

    // -- when
    const firstResponse = await http(
      "http://localhost:6000/users",
      "post",
      payload
    );
    const duplicatedResponse = await http(
      "http://localhost:6000/users",
      "post",
      payload
    );

    const user = firstResponse.data;

    // -- then
    expect(duplicatedResponse.status).toBe(422);

    await usersService.deleteUser(user.id);
  });

  test("should update users", async () => {
    // -- given
    const user = await usersService.saveUser({
      name: generate(),
      email: generate(),
      password: generate(),
    });

    user.name = generate();
    user.email = generate();

    // -- when
    await http(`http://localhost:6000/users/${user.id}`, "put", user);

    const updatedUser = await usersService.getUser(user.id);

    // -- then
    expect(updatedUser.name).toBe(user.name);
    expect(updatedUser.email).toBe(user.email);

    await usersService.deleteUser(user.id);
  });

  test("should not update users", async () => {
    // -- given
    const user = { id: 0 };

    const payload = {
      name: generate(),
      email: generate(),
      password: generate(),
    };

    // -- when
    const response = await http(
      `http://localhost:6000/users/${user.id}`,
      "put",
      payload
    );

    // -- then
    expect(response.status).toBe(404);
  });

  test("should update users", async () => {
    // -- given
    const user = await usersService.saveUser({
      name: generate(),
      email: generate(),
      password: generate(),
    });

    // -- when
    await http(`http://localhost:6000/users/${user.id}`, "delete", user);

    const users = await usersService.getUsers();

    // -- then
    expect(users.map((user) => user.id)).not.toContain(user.id);
  });
});
