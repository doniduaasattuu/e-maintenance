import FindingShowLayout from '@/layouts/finding/show/layout';
import { Finding } from '@/types';

interface FindingShowProps {
    finding: {
        data: Finding;
    };
}

export default function FindingShow({ finding }: FindingShowProps) {
    return <FindingShowLayout finding={finding} type="ABN" />;
}
