import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { useEffect } from 'react';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    
    useEffect(() => {
        window.location.href = '/login';
    }, []);

    return (
        <>
            <h1>Regresando a la página de inicio de sesión...</h1>
        </>
    );
}

Register.layout = {
    title: 'Regresando...',
    description: 'Regresando a la página de inicio de sesión...',
};
