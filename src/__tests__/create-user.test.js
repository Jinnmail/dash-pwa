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
