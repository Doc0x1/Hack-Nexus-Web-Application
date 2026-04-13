'use client';

import { useFormStatus } from 'react-dom';
import { updateUserProfile } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@prisma/client';
import { useActionState, useState, useEffect } from 'react';
import { User as UserIcon, Globe, MapPin, Github, Twitter, FileText, Code, X, Plus } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Saving...' : 'Save Changes'}
        </Button>
    );
}

type EditProfileFormProps = {
    user: User;
};

export default function EditProfileForm({ user }: EditProfileFormProps) {
    const [state, action] = useActionState(updateUserProfile, undefined);
    const [skills, setSkills] = useState<string[]>(user.skills || []);
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    // Toast notifications for success or error
    const { toast } = useToast();

    useEffect(() => {
        if (!state) return;

        if ((state as any).error) {
            toast({
                title: 'Error',
                description: (state as any).error,
                className: 'bg-red-600 text-white',
                duration: 5000
            });
        } else if ((state as any).success) {
            toast({
                title: 'Success',
                description: 'Profile updated successfully!',
                className: 'bg-green-600 text-white',
                duration: 5000
            });
        }
    }, [state, toast]);

    return (
        <div className="container mx-auto max-w-4xl p-6">
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold">Edit Profile</h1>
                <p className="text-muted-foreground">Update your profile information and settings.</p>
            </div>

            {/* Toasts are shown via useToast; alerts removed */}

            <form action={action} className="space-y-6">
                {/* Profile Picture Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Profile Picture
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                                <AvatarFallback className="text-xl">
                                    {user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || '?'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <Label htmlFor="image">Profile Image URL</Label>
                                <Input
                                    type="url"
                                    id="image"
                                    name="image"
                                    placeholder="https://example.com/image.jpg"
                                    defaultValue={user.image || ''}
                                    className="w-full"
                                />
                                <p className="text-muted-foreground text-sm">Enter a URL to your profile picture</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your display name"
                                    defaultValue={user.name || ''}
                                />
                            </div>
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="username"
                                    defaultValue={user.username || ''}
                                />
                                <p className="text-muted-foreground mt-1 text-sm">This is your unique identifier</p>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="bio" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Bio
                            </Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Tell us about yourself..."
                                defaultValue={user.bio || ''}
                                rows={4}
                            />
                            <p className="text-muted-foreground mt-1 text-sm">
                                Brief description about yourself (max 500 characters)
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Location & Contact */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Location & Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="location" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Location
                            </Label>
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="City, Country"
                                defaultValue={user.location || ''}
                            />
                        </div>

                        <div>
                            <Label htmlFor="website" className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Website
                            </Label>
                            <Input
                                type="url"
                                id="website"
                                name="website"
                                placeholder="https://yourwebsite.com"
                                defaultValue={user.website || ''}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                    <CardHeader>
                        <CardTitle>Social Media</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="githubUrl" className="flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                GitHub URL
                            </Label>
                            <Input
                                type="url"
                                id="githubUrl"
                                name="githubUrl"
                                placeholder="https://github.com/yourusername"
                                defaultValue={user.githubUrl || ''}
                            />
                        </div>

                        <div>
                            <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                                <Twitter className="h-4 w-4" />
                                Twitter URL
                            </Label>
                            <Input
                                type="url"
                                id="twitterUrl"
                                name="twitterUrl"
                                placeholder="https://twitter.com/yourusername"
                                defaultValue={user.twitterUrl || ''}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Skills Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Skills & Technologies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Hidden input to store skills as JSON */}
                        <input type="hidden" name="skills" value={JSON.stringify(skills)} />

                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Add a skill..."
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1"
                            />
                            <Button type="button" onClick={addSkill} variant="outline" size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {skill}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="ml-1 h-auto p-0"
                                            onClick={() => removeSkill(skill)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <p className="text-muted-foreground text-sm">
                            Add skills and technologies you're proficient in
                        </p>
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your@email.com"
                                defaultValue={user.email || ''}
                            />
                            <p className="text-muted-foreground mt-1 text-sm">
                                Your email address for account notifications
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-medium">Account Status</h4>
                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                <span>Role:</span>
                                <Badge variant="outline">{user.role}</Badge>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                <span>Member since:</span>
                                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <Card>
                    <CardContent className="pt-6">
                        <SubmitButton />
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
