'use client';

import { GuildUser } from '@/types/discord-db-types';
import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

const EditUserDialog = React.memo(function EditUserDialog({
    user,
    onClose,
    onSubmit
}: {
    user: GuildUser | null;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
}) {
    if (!user) return null;

    return (
        <Dialog open={!!user} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Make changes to the user's information here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" defaultValue={user.username} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Input id="currency" name="currency" type="number" defaultValue={user.currency} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="messagesSent">Messages Sent</Label>
                            <Input
                                id="messagesSent"
                                name="messagesSent"
                                type="number"
                                defaultValue={user.messagesSent.toString()}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timeInVoice">Time in Voice (minutes)</Label>
                            <Input id="timeInVoice" name="timeInVoice" type="number" defaultValue={user.timeInVoice} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Input id="level" name="level" type="number" defaultValue={user.level} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exp">Experience</Label>
                            <Input id="exp" name="exp" type="number" defaultValue={user.exp} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hearts">Hearts</Label>
                            <Input id="hearts" name="hearts" type="number" defaultValue={user.hearts} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="tryHackMeDetailsUsername">TryHackMe Username</Label>
                            <Input
                                id="tryHackMeDetailsUsername"
                                name="tryHackMeDetailsUsername"
                                defaultValue={user.tryHackMeDetailsUsername || ''}
                            />
                        </div>
                        <div className="flex items-center space-x-2 md:col-span-2">
                            <Switch id="guildOwner" name="guildOwner" defaultChecked={user.guildOwner} />
                            <Label htmlFor="guildOwner">Guild Owner</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
});

export default EditUserDialog;
