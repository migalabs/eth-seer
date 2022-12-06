import React, { PropsWithChildren } from 'react';

// Components
import Header from './Header';

const Layout = ({ children }: PropsWithChildren<{}>) => {
    return (
        <>
            <Header />

            <main>{children}</main>

            <footer className='text-center my-4'>
                <p className='text-white'>
                    Powered by&nbsp;
                    <a className='underline' href='https://migalabs.es/' target='_blank' rel='noreferrer'>
                        Miga Labs.
                    </a>
                    &nbsp; 2022.
                </p>
            </footer>
        </>
    );
};

export default Layout;
