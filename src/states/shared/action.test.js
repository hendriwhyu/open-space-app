/**
 * skenario test
 *
 * - asyncPopulateUsersAndTalks thunk
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action and call alert correctly when data fetching failed
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../utils/api';
import { asyncPopulateUsersAndTalks } from './action';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { receiveTalksActionCreator } from '../talks/action';
import { receiveUserActionCreator } from '../users/action';

const fakeTalksResponse = [
  {
    id: 'talk-1',
    text: 'Talk Test 1',
    user: 'user-1',
    replyTo: '',
    likes: [],
    createdAt: '2022-09-22T10:06:55.588Z',
  },
];

const fakeUsersResponse = [
  {
    id: 'user-1',
    name: 'User Test 1',
    photo: 'https://generated-image-url.jpg',
  },
];

const fakeErrorResponse = new Error('Ups, something went wrong');

describe('asyncPopulateUsersAndTalks thunk', () => {
  beforeEach(() => {
    api._getAllUsers = api.getAllUsers;
    api._getAllTalks = api.getAllTalks;
  });

  afterEach(() => {
    api.getAllUsers = api._getAllUsers;
    api.getAllTalks = api._getAllTalks;

    delete api._getAllUsers;
    delete api._getAllTalks;
  });

  it('should dispatch action correctyly when data fetching success', async () => {
    // arange
    api.getAllUsers = () => Promise.resolve(fakeUsersResponse);
    api.getAllTalks = () => Promise.resolve(fakeTalksResponse);

    // mock
    const dispatch = vi.fn();

    // action
    await asyncPopulateUsersAndTalks()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(dispatch).toHaveBeenCalledWith(
      receiveTalksActionCreator(fakeTalksResponse),
    );
    expect(dispatch).toHaveBeenCalledWith(
      receiveUserActionCreator(fakeUsersResponse),
    );
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should dispatch action and call alert correctly when data fetching failed', async () => {
    // arange
    api.getAllUsers = () => Promise.resolve(fakeUsersResponse);
    api.getAllTalks = () => Promise.resolve(fakeTalksResponse);

    // stub implementation
    api.getAllUsers = () => Promise.reject(fakeErrorResponse);
    api.getAllTalks = () => Promise.reject(fakeErrorResponse);

    // mock dispatch
    const dispatch = vi.fn();
    // mick alert
    window.alert = vi.fn();

    // action
    await asyncPopulateUsersAndTalks()(dispatch);

    // asert
    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
    expect(window.alert).toHaveBeenCalledWith(fakeErrorResponse.message);
  });
});
