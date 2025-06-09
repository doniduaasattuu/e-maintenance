import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserAvatarProps {
    user: User;
}

export default function UserAvatar({ user }: UserAvatarProps) {
    const getInitials = useInitials();

    return (
        <Avatar className={`h-8 w-8 overflow-hidden rounded-full ring-2 ${user.is_online ? 'ring-green-500' : 'ring-gray-500'} `}>
            <AvatarImage src={user.avatar ?? 'https://github.com/shadcn.png'} alt={user.name} className="object-cover" />
            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                {getInitials(user.name)}
            </AvatarFallback>
        </Avatar>
    );
}
