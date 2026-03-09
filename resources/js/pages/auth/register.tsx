import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { InputPassword } from '@/components/input-password';
import RequiredLabel from '@/components/required-label';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    employee_id: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    registration_key: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        employee_id: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        registration_key: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="space-y-6" onSubmit={submit}>
                <Field>
                    <FieldLabel htmlFor="employee_id">
                        Employee ID
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        id="employee_id"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        maxLength={8}
                        autoComplete="employee_id"
                        value={data.employee_id}
                        onChange={(e) => setData('employee_id', e.target.value)}
                        disabled={processing}
                        placeholder="12345678"
                    />
                    <FieldError>{errors.employee_id}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="name">
                        Name
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        required
                        tabIndex={2}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="John Doe"
                    />
                    <FieldError>{errors.name}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">
                        Email address
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        required
                        tabIndex={3}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={processing}
                        placeholder="john.doe@example.com"
                    />
                    <FieldError>{errors.email}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">
                        Password
                        <RequiredLabel />
                    </FieldLabel>
                    <InputPassword
                        id="password"
                        required
                        tabIndex={4}
                        autoComplete="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        disabled={processing}
                        toggleTabIndex={5}
                        placeholder="********"
                    />
                    <FieldError>{errors.password}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="password_confirmation">
                        Confirm password
                        <RequiredLabel />
                    </FieldLabel>
                    <InputPassword
                        id="password_confirmation"
                        required
                        tabIndex={6}
                        autoComplete="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        disabled={processing}
                        placeholder="********"
                        toggleTabIndex={7}
                    />
                    <FieldError>{errors.password_confirmation}</FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="registration_key">
                        Register code
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        id="registration_key"
                        type="text"
                        required
                        tabIndex={8}
                        value={data.registration_key}
                        onChange={(e) => setData('registration_key', e.target.value)}
                        disabled={processing}
                    />
                    <FieldError>{errors.registration_key}</FieldError>
                </Field>

                <Button type="submit" className="mt-2 w-full" tabIndex={9} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Create account
                </Button>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={10}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
