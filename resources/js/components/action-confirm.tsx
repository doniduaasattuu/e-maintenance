import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ActionConfirmProps {
    action: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode | undefined;
    actionLabel?: string;
}

export function ActionConfirm({ action, title, description, actionLabel, children }: ActionConfirmProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title ?? 'Are you absolutely sure?'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description ?? 'This action cannot be undone. This will permanently delete and remove your data from our servers.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={action}>{actionLabel ?? 'Delete'}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
