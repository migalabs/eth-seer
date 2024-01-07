import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import TooltipResponsive from '../../components/ui/TooltipResponsive';
import CustomImage from '../ui/CustomImage';
import LinkTransaction from '../ui/LinkTransaction';
import CopyIcon from '../ui/CopyIcon';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../ui/Table';

// Helpers
import { getShortAddress } from '../../helpers/addressHelper';
import { getTimeAgo } from '../../helpers/timeHelper';

// Types
import { Transaction } from '../../types';

// Props
type Props = {
    transactions: Transaction[];
    fullWidth?: boolean;
    fetchingTransactions?: boolean;
};

const Transactions = ({ transactions, fullWidth, fetchingTransactions }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Large View Hook
    const largeView = useLargeView();

    // Transactions Large View
    const getTransactionsLargeView = () => (
        <LargeTable
            minWidth={1150}
            fullWidth={fullWidth}
            noRowsText='No Transactions'
            fetchingRows={fetchingTransactions}
        >
            <LargeTableHeader
                text='Txn Hash'
                tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={<span>The hash of the transaction</span>}
                        top='34px'
                        polygonLeft
                    />
                }
                width='calc(16.667% - 20px)'
            />

            <LargeTableHeader
                text='Age'
                tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={
                            <>
                                <span>How long ago</span>
                                <span>the transaction passed</span>
                            </>
                        }
                        top='34px'
                    />
                }
                width='calc(16.667% - 20px)'
            />

            <LargeTableHeader text='From' width='calc(16.667% - 20px)' />

            <LargeTableHeader text='' width='20px' />

            <LargeTableHeader text='To' width='calc(16.667% - 20px)' />

            <LargeTableHeader
                text='Value'
                tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={
                            <>
                                <span>How much ETH</span>
                                <span>was sent</span>
                                <span>in the transaction</span>
                            </>
                        }
                        top='34px'
                    />
                }
                width='calc(16.667% - 20px)'
            />

            <LargeTableHeader
                text='Txn Fee'
                tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={
                            <>
                                <span>The fee</span>
                                <span>the transaction cost</span>
                            </>
                        }
                        top='34px'
                        polygonRight
                    />
                }
                width='calc(16.667% - 20px)'
            />

            {transactions.map(transaction => (
                <LargeTableRow key={transaction.f_hash}>
                    <div className='flex gap-x-2 justify-center items-center w-[calc(16.667%-20px)]'>
                        <CopyIcon value={transaction.f_hash} />

                        <LinkTransaction hash={transaction.f_hash} />
                    </div>

                    <p className='w-[calc(16.667%-20px)] lowercase'>{getTimeAgo(transaction.f_timestamp * 1000)}</p>

                    <div className='flex gap-x-2 justify-center items-center w-[calc(16.667%-20px)]'>
                        <CopyIcon value={transaction.f_from} />
                        <p>{getShortAddress(transaction.f_from)}</p>
                    </div>

                    <div className='w-5'>
                        <CustomImage
                            src={`/static/images/icons/send_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                            alt='Send icon'
                            width={20}
                            height={20}
                        />
                    </div>

                    <div className='flex gap-x-2 justify-center items-center w-[calc(16.667%-20px)]'>
                        <CopyIcon value={transaction.f_to} />
                        <p>{getShortAddress(transaction.f_to)}</p>
                    </div>

                    <p className='w-[calc(16.667%-20px)]'>{(transaction.f_value / 10 ** 18).toLocaleString()} ETH</p>

                    <p className='w-[calc(16.667%-20px)]'>
                        {(transaction.f_gas_fee_cap / 10 ** 9).toLocaleString()} GWEI
                    </p>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    // Transactions Small View
    const getTransactionsSmallView = () => (
        <SmallTable fullWidth={fullWidth} noRowsText='No Transactions' fetchingRows={fetchingTransactions}>
            {transactions.map(transaction => (
                <SmallTableCard key={transaction.f_hash}>
                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Txn Hash</p>

                        <div className='flex gap-x-2 items-center'>
                            <CopyIcon value={transaction.f_hash} />
                            <LinkTransaction hash={transaction.f_hash} />
                        </div>
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Age</p>
                        <p>{getTimeAgo(transaction.f_timestamp * 1000)}</p>
                    </div>

                    <div className='flex w-full justify-between items-center'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>From</p>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>To</p>
                    </div>

                    <div className='flex w-full justify-between items-center'>
                        <div className='flex gap-x-2 items-center'>
                            <CopyIcon value={transaction?.f_from} />
                            <p>{getShortAddress(transaction?.f_from)}</p>
                        </div>

                        <CustomImage
                            src={`/static/images/icons/send_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                            alt='Send icon'
                            width={20}
                            height={20}
                        />

                        <div className='flex gap-x-2 items-center'>
                            <CopyIcon value={transaction?.f_to} />
                            <p>{getShortAddress(transaction?.f_to)}</p>
                        </div>
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Value</p>
                        <p>{(transaction.f_value / 10 ** 18).toLocaleString()} ETH</p>
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Txn Fee</p>
                        <p>{(transaction.f_gas_fee_cap / 10 ** 9).toLocaleString()} GWEI</p>
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    return <>{largeView ? getTransactionsLargeView() : getTransactionsSmallView()}</>;
};

export default Transactions;
