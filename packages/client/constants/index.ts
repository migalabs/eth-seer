const distinct = (list: string[]) => Array.from(new Set(list));

export const POOLS_OLD = [
    'ANKR',
    'AVADO',
    'BINANCE',
    'BITCOINSUISSE',
    'BITFINEX',
    'BLOXSTAKING',
    'COINBASE',
    'CREAM',
    'DAPPNODE',
    'ERIGON-GFM',
    'HUOBI',
    'KRAKEN',
    'KUCOIN',
    'LIGHTHOUSE-TEAM',
    'LODESTAR-TEAM',
    'NIMBUS-TEAM',
    'OKEX',
    'PIEDAO',
    'POLONIEX',
    'PRYSM-TEAM',
    'ROCKET_POOL',
    'STAKEFISH',
    'STAKEWISE',
    'TEKU-TEAM',
    'VITALIK',
    'WEXEXCHANGE',
];

export const POOLS = [
    '2300X',
    'ALLNODES_LIDO',
    'ANKR',
    'ANYBLOCKANALYTICS_LIDO',
    'ATTESTANTLIMITED_LIDO',
    'AVADO',
    'BINANCE',
    'BITCOINSUISSE',
    'BITFINEX',
    'BITFROST',
    'BITSTAMP',
    'BLOCKDAEMON_LIDO',
    'BLOCKSCAPE_LIDO',
    'BLOXSTAKING',
    'BRIDGETOWER_LIDO',
    'CELSIUS_NETWORK',
    'CERTUSONE_LIDO',
    'CHAINLAYER_LIDO',
    'CHAINSAFE_LIDO',
    'CHORUSONE_LIDO',
    'COINBASE',
    'CONSENSYSCODEFI_LIDO',
    'CREAM.FINANCE',
    'CRYPTOMANUFAKTUR_LIDO',
    'CRYPTOSTAKE.COM',
    'DANIELWANG.ETH',
    'DAPPNODE',
    'DSRV_LIDO',
    'ERIGONGFM',
    'EVERSTAKE_LIDO',
    'FIGMENT',
    'FIGMENT_LIDO',
    'GEMINI',
    'GHASH.ETH',
    'HASHQUARK_LIDO',
    'HUOBI',
    'INFSTONES',
    'INFSTONES_LIDO',
    'KILN_LIDO',
    'KRAKEN',
    'KUCOIN',
    'KUKISGLOBAL_LIDO',
    'LIGHTHOUSETEAM',
    'NEMORINO.ETH',
    'NETHERMIND_LIDO',
    'NIMBUSTEAM',
    'OKEX',
    'OTHERS',
    'P2PORG_LIDO',
    'PIEDAO',
    'POGIBOY.ETH',
    'POLONIEX',
    'PRYSMATICLABS_LIDO',
    'PRYSMTEAM',
    'QUICKCASH',
    'ROCKETPOOL',
    'ROCKLOGICGMBH_LIDO',
    'ROCKX_LIDO',
    'SHAREDSTAKE',
    'SIGMAPRIME_LIDO',
    'SIMPLYSTAKING_LIDO',
    'STAKED.US',
    'STAKEFISH',
    'STAKEFISH_LIDO',
    'STAKEHOUND',
    'STAKELY_LIDO',
    'STAKEWISE',
    'STAKIN_LIDO',
    'STAKINGFACILITIES_LIDO',
    'TEKUTEAM',
    'TGERRING.ETH',
    'TOKENPOCKET',
    'VITALIK',
    'WANGDONG.ETH',
    'WAS.ETH',
    'WEXEXCHANGE_COPY',
    'WOLVERINE.ETH',
];

const POOLS_LIDO = [
    'ALLNODES_LIDO',
    'ANYBLOCKANALYTICS_LIDO',
    'ATTESTANTLIMITED_LIDO',
    'BLOCKDAEMON_LIDO',
    'BLOCKSCAPE_LIDO',
    'BRIDGETOWER_LIDO',
    'CERTUSONE_LIDO',
    'CHAINLAYER_LIDO',
    'CHAINSAFE_LIDO',
    'CHORUSONE_LIDO',
    'CONSENSYSCODEFI_LIDO',
    'CRYPTOMANUFAKTUR_LIDO',
    'DSRV_LIDO',
    'EVERSTAKE_LIDO',
    'FIGMENT_LIDO',
    'HASHQUARK_LIDO',
    'INFSTONES_LIDO',
    'KILN_LIDO',
    'KUKISGLOBAL_LIDO',
    'NETHERMIND_LIDO',
    'P2PORG_LIDO',
    'PRYSMATICLABS_LIDO',
    'ROCKLOGICGMBH_LIDO',
    'ROCKX_LIDO',
    'SIGMAPRIME_LIDO',
    'SIMPLYSTAKING_LIDO',
    'STAKEFISH_LIDO',
    'STAKELY_LIDO',
    'STAKINGFACILITIES_LIDO',
    'STAKIN_LIDO',
];

const POOLS_WHALE = [
    'WHALE_0X0EC2',
    'WHALE_0X103A',
    'WHALE_0X1119',
    'WHALE_0X152C',
    'WHALE_0X1EA6',
    'WHALE_0X21D3',
    'WHALE_0X234E',
    'WHALE_0X27D7',
    'WHALE_0X2ED8',
    'WHALE_0X3014',
    'WHALE_0X331E',
    'WHALE_0X38BC',
    'WHALE_0X3B43',
    'WHALE_0X46D2',
    'WHALE_0X5122',
    'WHALE_0X5DC7',
    'WHALE_0X64E8',
    'WHALE_0X6AA3',
    'WHALE_0X6E16',
    'WHALE_0X711C',
    'WHALE_0X8914',
    'WHALE_0X8D87',
    'WHALE_0XA3AE',
    'WHALE_0XA858',
    'WHALE_0XB4B2',
    'WHALE_0XB614',
    'WHALE_0XC236',
    'WHALE_0XC541',
    'WHALE_0XC607',
    'WHALE_0XCB2A',
    'WHALE_0XDCF3',
    'WHALE_0XE733',
    'WHALE_0XEAB8',
    'WHALE_0XF79C',
    'WHALE_0XFEAA',
    'WHALE_0XFFA6',
    'WHALE_0XFFD2',
];

export const POOLS_EXTENDED = distinct([...POOLS, ...POOLS_LIDO, ...POOLS_WHALE, 'OTHERS']);

export const FIRST_BLOCK: number = Number(process.env.NEXT_PUBLIC_NETWORK_GENESIS); // 1606824023000
