import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import ButtonSubmit from '@/components/button-submit';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import RequiredLabel from '@/components/required-label';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { strTitle } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    avatar?: File | null;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            method: 'patch',
            preserveScroll: true,
            onSuccess: () => {
                reset('avatar');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const employeeId = auth.user?.employee_id;
    const department = auth.user?.department?.name;
    const workCenter = auth.user?.work_center?.name;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                            <div className="grid gap-2">
                                <FieldLabel htmlFor="employee_id">
                                    Employee ID <RequiredLabel />
                                </FieldLabel>

                                <Input
                                    tabIndex={1}
                                    id="employee_id"
                                    type="employee_id"
                                    className="bg-muted/50 mt-1 block w-full"
                                    value={employeeId}
                                />
                            </div>

                            <div className="grid gap-2">
                                <FieldLabel htmlFor="name">
                                    Name <RequiredLabel />
                                </FieldLabel>

                                <Input
                                    tabIndex={2}
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', strTitle(e.target.value))}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError message={errors.name} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <FieldLabel htmlFor="email">
                                Email address <RequiredLabel />
                            </FieldLabel>

                            <Input
                                tabIndex={3}
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError message={errors.email} />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                            <div className="grid gap-2">
                                <FieldLabel htmlFor="department_id">Department</FieldLabel>

                                <Input
                                    tabIndex={4}
                                    id="department_id"
                                    type="department_id"
                                    className="bg-muted/50 mt-1 block w-full"
                                    value={department}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FieldLabel htmlFor="work_center_id">Work Center</FieldLabel>

                                <Input
                                    tabIndex={5}
                                    id="work_center_id"
                                    type="work_center_id"
                                    className="bg-muted/50 mt-1 block w-full"
                                    value={workCenter}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <FieldLabel htmlFor="avatar">Avatar</FieldLabel>

                            <Input
                                tabIndex={6}
                                id="avatar"
                                type="file"
                                ref={fileInputRef}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                                accept=".jpg,.jpeg,.png,.webp"
                            />

                            <InputError message={errors.avatar} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        tabIndex={6}
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <ButtonSubmit
                                tabIndex={7}
                                processing={processing}
                                label="Update"
                                disabled={processing || data.name == '' || data.email == ''}
                                recentlySuccessful={recentlySuccessful}
                                successMessage="Updated"
                            />
                        </div>
                    </form>
                </div>

                {auth.user.name != 'Admin' && <DeleteUser />}
            </SettingsLayout>
        </AppLayout>
    );
}
