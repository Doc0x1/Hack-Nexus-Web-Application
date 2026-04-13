'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

const AddUserDialog = React.memo(function AddUserDialog({
    open,
    onClose,
    onSubmit
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>Create a new guild user entry.</DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input id="username" name="username" required placeholder="user123" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Input id="currency" name="currency" type="number" defaultValue="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="messagesSent">Messages Sent</Label>
                            <Input id="messagesSent" name="messagesSent" type="number" defaultValue="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timeInVoice">Time in Voice (minutes)</Label>
                            <Input id="timeInVoice" name="timeInVoice" type="number" defaultValue="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Input id="level" name="level" type="number" defaultValue="1" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exp">Experience</Label>
                            <Input id="exp" name="exp" type="number" defaultValue="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hearts">Hearts</Label>
                            <Input id="hearts" name="hearts" type="number" defaultValue="0" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="tryHackMeDetailsUsername">TryHackMe Username</Label>
                            <Input id="tryHackMeDetailsUsername" name="tryHackMeDetailsUsername" />
                        </div>
                        <div className="flex items-center space-x-2 md:col-span-2">
                            <Switch id="guildOwner" name="guildOwner" />
                            <Label htmlFor="guildOwner">Guild Owner</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Add User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
});

export default AddUserDialog;
