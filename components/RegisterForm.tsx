'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { registerUser } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Registering...' : 'Register'}
        </Button>
    );
}

export default function RegisterForm() {
    const [state, action] = useFormState(registerUser, undefined);

    return (
        <form action={action} className="space-y-4">
            <div>
                <Label htmlFor="username">Username</Label>
                <Input type="text" id="username" name="username" required />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" required />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" required />
            </div>
            <SubmitButton />
            {state?.error && <p className="text-red-500">{state.error}</p>}
        </form>
    );
}
