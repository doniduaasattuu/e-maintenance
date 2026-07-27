import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, LogIn } from 'lucide-react';
import { FormEventHandler } from 'react';

import { InputPassword } from '@/components/input-password';
import RequiredLabel from '@/components/required-label';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';

type LoginForm = {
    identifier: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword = false }: LoginProps) {
    const page = usePage<SharedData>();
    const { name } = page.props;

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        identifier: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title={name ? name : 'Log in to your account'} description="Enter your email or employee id and password below to log in">
            <Head title="Log in" />

            <form className="space-y-6" onSubmit={submit}>
                <Field>
                    <FieldLabel htmlFor="identifier">
                        Email / Employee ID
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        id="identifier"
                        type="identifier"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="identifier"
                        value={data.identifier}
                        onChange={(e) => setData('identifier', e.target.value)}
                        placeholder="Enter your email or employee ID"
                    />
                    <FieldError>{errors.identifier}</FieldError>
                </Field>

                <Field className="grid gap-2">
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">
                            Password
                            <RequiredLabel />
                        </FieldLabel>
                        {canResetPassword && (
                            <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={6}>
                                Forgot password?
                            </TextLink>
                        )}
                    </div>
                    <InputPassword
                        id="password"
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e: { target: { value: string } }) => setData('password', e.target.value)}
                        toggleTabIndex={3}
                        placeholder="********"
                    />
                    <FieldError>{errors.password}</FieldError>
                </Field>

                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="remember"
                        name="remember"
                        checked={data.remember}
                        onClick={() => setData('remember', !data.remember)}
                        tabIndex={4}
                    />
                    <FieldLabel htmlFor="remember">Remember me</FieldLabel>
                </div>

                <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                    {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogIn />} {processing ? 'Logging in' : 'Log in'}
                </Button>

                <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={7}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
