export interface NetworksContextType {
    networks: String[];
    fetched: boolean;
    getNetworks: (network: string) => void;
}
