import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import userReducer from '../../reducers';
import Profile from './Profile';

describe('Profile Component', () => {
    it('should fetch the user\'s profile username', async () => {
        const store = configureStore({
            reducer: userReducer,
            preloadedState: {
                username: 'Bret',
            },
        });

        const { getByText } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Profile />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(getByText('Bret')).toBeInTheDocument();
        });
    });

    it('should fetch the user\'s profile username', async () => {
        const store = configureStore({
            reducer: userReducer,
            preloadedState: {
                username: 'Antonette',
            },
        });

        const { getByText } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Profile />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(getByText('Antonette')).toBeInTheDocument();
        });
    });

    it('should fail to fetch invalid username', async () => {
        const store = configureStore({
            reducer: userReducer,
            preloadedState: {
                username: 'invalid-username',
            },
        });

        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Profile />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(queryByText('invalid-username')).not.toBeInTheDocument();
        });
    });

    it('should fail to fetch invalid username', async () => {
        const store = configureStore({
            reducer: userReducer,
            preloadedState: {
                username: 'Ervin Howell',
            },
        });

        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Profile />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(queryByText('Ervin Howell')).not.toBeInTheDocument();
        });
    });
});
