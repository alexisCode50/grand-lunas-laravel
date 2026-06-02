import { Form, Head, setLayoutProps } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useEffect, useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {

    useEffect(() => {
        window.location.href = '/login';
    }, []);

    return (
        <>
            <Head title="Two-factor authentication" />
        </>
    );
}
