import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui';

interface AddGuildUserEntryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
}

export default function AddGuildUserEntryDialog({ isOpen, onClose, onSubmit }: AddGuildUserEntryDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Guild User Entry</DialogTitle>
                    <DialogDescription>Add a new guild user entry here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
