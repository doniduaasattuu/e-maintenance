import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { User } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import ButtonSubmit from './button-submit';
import RequiredLabel from './required-label';

interface ResetPasswordDialogProps {
    user: User;
    children: React.ReactNode | undefined;
}

interface ResetPasswordData {
    user_id: number;
    new_password: string;
}

export function ResetPasswordDialog({ children, user }: ResetPasswordDialogProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<ResetPasswordData>>({
        user_id: user.id,
        new_password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('users.reset.password', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('new_password');
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={submit} className="space-y-6">
                    <DialogHeader className="space-y-2">
                        <DialogTitle>Reset User Password</DialogTitle>
                        <DialogDescription>Enter a new password for the user.</DialogDescription>
                    </DialogHeader>

                    <Field>
                        <FieldLabel htmlFor="new_password">
                            New Password
                            <RequiredLabel />
                        </FieldLabel>
                        <Input
                            className="text-sm"
                            disabled={processing}
                            tabIndex={1}
                            id="new_password"
                            type="text"
                            onChange={(e) => setData('new_password', e.target.value)}
                            value={data.new_password}
                            placeholder="Enter the new password for the user."
                        />

                        <FieldError>{errors.new_password}</FieldError>
                    </Field>

                    <DialogFooter>
                        <ButtonSubmit
                            tabIndex={2}
                            processing={processing}
                            disabled={processing || !data.new_password}
                            label="Reset Password"
                            successMessage="Password reset successfully"
                            recentlySuccessful={recentlySuccessful}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
