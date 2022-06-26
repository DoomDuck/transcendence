export interface Physics {
    apply?: (elapsed: number) => void;
    resolve: () => void;
}
