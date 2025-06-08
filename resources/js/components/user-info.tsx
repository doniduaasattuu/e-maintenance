import { type User } from '@/types';
import UserAvatar from './user-avatar';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    // const getInitials = useInitials();

    return (
        <>
            <UserAvatar user={user} />
            {/* <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar ?? 'https://github.com/shadcn.png'} alt={user.name} className="object-cover" />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar> */}
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
            </div>
        </>
    );
}
