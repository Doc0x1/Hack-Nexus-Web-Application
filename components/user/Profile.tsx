import { User } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Globe, Calendar, Eye, Clock, Ban, CheckCircle, XCircle, Bot } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa';

type ProfileProps = {
    user: User;
};

export default async function Profile({ user }: ProfileProps) {
    const session = await auth();
    const isCurrentUser = session?.user?.id === user.id;

    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-500 hover:bg-red-600';
            case 'MODERATOR':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'MEMBER':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-6">
            {/* Header Section */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={user.image || ''} alt={user.name || ''} />
                            <AvatarFallback className="text-2xl">
                                {user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="mb-2 flex items-center gap-3">
                                    <h1 className="text-3xl font-bold">{user.name || 'Anonymous User'}</h1>
                                    <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                                </div>
                                <p className="text-muted-foreground text-xl">@{user.username}</p>
                            </div>

                            {/* Status Indicators */}
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    {user.isActive ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                                </div>

                                {user.isBanned && (
                                    <div className="flex items-center gap-1 text-red-500">
                                        <Ban className="h-4 w-4" />
                                        <span>Banned</span>
                                    </div>
                                )}

                                {user.canAccessBot && (
                                    <div className="flex items-center gap-1 text-blue-500">
                                        <Bot className="h-4 w-4" />
                                        <span>Bot Access</span>
                                    </div>
                                )}
                            </div>

                            {/* Profile Stats */}
                            <div className="text-muted-foreground flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{user.profileViews} views</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Joined {formatDate(user.joinedAt)}</span>
                                </div>
                                {user.lastSeenAt && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Last seen {formatDate(user.lastSeenAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isCurrentUser && (
                            <Link href="/profile/edit">
                                <Button>Edit Profile</Button>
                            </Link>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 md:col-span-2">
                    {/* About Section */}
                    <Card className="gap-4">
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                            <Separator />
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {user.bio || 'No bio available.'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Skills Section */}
                    {user.skills && user.skills.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills & Technologies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Ban Information (if banned) */}
                    {user.isBanned && (
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <Ban className="h-5 w-5" />
                                    Account Banned
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p>
                                        <strong>Banned on:</strong> {formatDate(user.bannedAt)}
                                    </p>
                                    {user.bannedReason && (
                                        <p>
                                            <strong>Reason:</strong> {user.bannedReason}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Information */}
                    <Card className="gap-2">
                        <CardHeader>
                            <CardTitle>Contact & Links</CardTitle>
                            <Separator />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-muted-foreground h-4 w-4" />
                                    <span>{user.location}</span>
                                </div>
                            )}

                            {user.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="text-muted-foreground h-4 w-4" />
                                    <a
                                        href={user.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {user.website}
                                    </a>
                                </div>
                            )}

                            {user.githubUrl && (
                                <div className="flex items-center gap-2">
                                    <FaGithub className="text-muted-foreground h-4 w-4" />
                                    <a
                                        href={user.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        GitHub Profile
                                    </a>
                                </div>
                            )}

                            {user.twitterUrl && (
                                <div className="flex items-center gap-2">
                                    <FaTwitter className="text-muted-foreground h-4 w-4" />
                                    <a
                                        href={user.twitterUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Twitter Profile
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Discord Information */}
                    {user.discordId && (
                        <Card className="gap-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bot className="h-5 w-5" />
                                    Discord
                                </CardTitle>
                                <Separator />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {user.discordTag && <p>{user.discordTag}</p>}
                                    <Badge variant={user.canAccessBot ? 'default' : 'secondary'}>
                                        {user.canAccessBot ? 'Bot Access Granted' : 'No Bot Access'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Account Details */}
                    <Card className="gap-2">
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                            <Separator />
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div>
                                <strong>Member since:</strong> {formatDate(user.createdAt)}
                            </div>
                            <div>
                                <strong>Last updated:</strong> {formatDate(user.updatedAt)}
                            </div>
                            {user.lastLoginAt && (
                                <div>
                                    <strong>Last login:</strong> {formatDate(user.lastLoginAt)}
                                </div>
                            )}
                            {user.emailVerified && (
                                <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Email verified</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
