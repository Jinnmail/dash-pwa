import { act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import { renderWithRouter } from '../__mocks__/functions';
import { users } from '../__mocks__/users';

jest.mock('../create-account-helper', () => ({
  postCreateUser: () => Promise.resolve({ json: () => Promise.resolve({
    verified: false,
    resetPasswordToken: null,
    aliasesCount: 0,
    maxInvites: 5,
    invites: 5,
    premium: false,
    _id: "6666",
    created: "2021-09-14T23:40:57.671Z",
    userId: "a975",
    email: "a@a.com",
    password: "asdfab",
    verificationCode: "111111",
    __v: 0
  })})
}));

jest.mock('../verify-code-helper', () => ({
  postVerify: () => Promise.resolve({ json: () => Promise.resolve({
    status: 200
  })})
}));

jest.mock('../login-helper', () => ({
  postLogin: () => Promise.resolve({ json: () => Promise.resolve({
    data: {
      status: "authorized",
      userId: "bgf1-71...",
      email: "a@a.com",
      sessionToken: "eyKhbGciPiJIUzI2NiI...",
      expiresIn: "24h",
    },
    error: '', 
    message: 'Login Successful',
    status: 200
  })})
}));

jest.mock('../app-helper', () => ({
  getUserId: () => "bgf1-71...",
  getUser: () => Promise.resolve({ json: () => Promise.resolve({
    verified: true,
    resetPasswordToken: "777777",
    aliasesCount: 7,
    maxInvites: 5,
    invites: 3,
    premium: true,
    _id: "4fe7",
    userId: "bgf1-71...",
    email: "a@a.com",
    password: "$3b$Qe...",
    verificationCode: "123456",
    created: "2020-06-16T01:06:04.620Z",
    __v: 0,
    resetPasswordExpires: "2021-08-08T21:31:53.505Z"
  })})
}));


test('create new user', async () => {
  const {debug, getByTestId, getByText} = renderWithRouter(<App />, { route: '/signup' });

  expect(getByText(/create account/i)).toBeInTheDocument();

  userEvent.type(getByTestId('email'), users[0].email)
  userEvent.type(getByTestId('password'), users[0].password)

  await waitFor(() => {
    userEvent.click(getByTestId('create-account'))
  })

  expect(getByText(/verify email code/i)).toBeInTheDocument();

  userEvent.type(getByTestId('verify-code-input'), '111111')

  await waitFor(() => expect(expect(getByText(/log in/i)).toBeInTheDocument()))
})

test('existing user can log in', async () => {
  const {debug, getByTestId, getByText} = renderWithRouter(<App />, { route: '/login' });

  expect(getByText(/log in/i)).toBeInTheDocument()
  expect(getByTestId('login')).toBeDisabled();

  userEvent.type(getByTestId('email'), users[0].email)
  userEvent.type(getByTestId('password'), users[0].password)

  expect(getByTestId('login')).not.toBeDisabled();

  await waitFor(() => {
    userEvent.click(getByTestId('login'))
  })

  expect(getByText(/dashboard/i)).toBeInTheDocument();
})
