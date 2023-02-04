import { useRouter } from 'next/router';

const Block = () => {
    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    console.log(id);
};

export default Block;
