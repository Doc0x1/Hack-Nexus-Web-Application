import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Separator } from '../ui/separator';

interface AdminCardProps {
    title: string;
    subtitle?: string;
    badge?: {
        text: string;
        className?: string;
    };
    details: {
        label: string;
        value: string | number;
    }[];
    onEdit?: () => void;
    onDelete?: () => void;
    children?: React.ReactNode;
    extraActions?: { label: string; onClick: () => void }[];
}

export default function AdminCard({
    title,
    subtitle,
    badge,
    details,
    onEdit,
    onDelete,
    extraActions,
    children
}: AdminCardProps) {
    return (
        <Card className="bg-background mr-3 gap-2 overflow-hidden border border-slate-800 py-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex h-5 items-center gap-2 space-x-2">
                        <CardTitle>{title}</CardTitle>
                        {badge && (
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs ${badge.className || 'bg-cyan-500/10 text-cyan-400'}`}
                            >
                                {badge.text}
                            </span>
                        )}
                        <Separator orientation="vertical" className="bg-slate-500" />
                        <div>
                            {extraActions?.map(action => (
                                <Button
                                    key={action.label}
                                    size="sm"
                                    variant="default"
                                    onClick={action.onClick}
                                    className="cursor-pointer"
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {onEdit && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onEdit}
                                className="cursor-pointer text-blue-400 hover:text-blue-300"
                            >
                                <FaEdit />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onDelete}
                                className="cursor-pointer text-red-400 hover:text-red-300"
                            >
                                <FaTrash />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-400">
                    {details.map((detail, index) => (
                        <div key={index}>
                            {detail.label}: {detail.value}
                        </div>
                    ))}
                </div>
                {children}
            </CardContent>
        </Card>
    );
}
