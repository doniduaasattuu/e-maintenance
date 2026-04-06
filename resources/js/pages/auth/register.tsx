import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { InputPassword } from '@/components/input-password';
import RequiredLabel from '@/components/required-label';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { Department } from '@/types';

type RegisterForm = {
    employee_id: string;
    name: string;
    email: string;
    department_id: string;
    password: string;
    password_confirmation: string;
    registration_key: string;
};

interface RegisterProps {
    departments: {
        data: Department[];
    };
}

export default function Register({ departments }: RegisterProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        employee_id: '',
        name: '',
        email: '',
        department_id: '',
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
                    <FieldLabel htmlFor="department_id">
                        Department
                        <RequiredLabel />
                    </FieldLabel>
                    <Select required disabled={processing} onValueChange={(e) => setData('department_id', e)} value={data.department_id}>
                        <SelectTrigger tabIndex={4} className="truncate overflow-hidden whitespace-nowrap">
                            <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-muted-foreground">Department</SelectLabel>
                                {departments.data.map((p) => {
                                    return (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.code + ' - ' + p.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldError>{errors.department_id}</FieldError>
                </Field>

                <div className="space-y-6 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
                    <Field>
                        <FieldLabel htmlFor="password">
                            Password
                            <RequiredLabel />
                        </FieldLabel>
                        <InputPassword
                            id="password"
                            required
                            tabIndex={5}
                            autoComplete="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            toggleTabIndex={6}
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
                            tabIndex={7}
                            autoComplete="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="********"
                            toggleTabIndex={8}
                        />
                        <FieldError>{errors.password_confirmation}</FieldError>
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="registration_key">
                        Register code
                        <RequiredLabel />
                    </FieldLabel>
                    <Input
                        id="registration_key"
                        type="text"
                        required
                        tabIndex={9}
                        value={data.registration_key}
                        onChange={(e) => setData('registration_key', e.target.value)}
                        disabled={processing}
                        placeholder="Enter the key provided by your admin"
                    />
                    <FieldError>{errors.registration_key}</FieldError>
                </Field>

                <Button
                    type="submit"
                    className="mt-2 w-full"
                    tabIndex={10}
                    disabled={
                        processing ||
                        data.employee_id == '' ||
                        data.name == '' ||
                        data.email == '' ||
                        data.department_id == '' ||
                        data.password == '' ||
                        data.password_confirmation == '' ||
                        data.registration_key == ''
                    }
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Create account
                </Button>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={11}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
