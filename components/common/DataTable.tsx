'use client';

import { ReactNode, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

interface DataTableProps<T> {
    data: T[];
    renderItem: (item: T) => ReactNode;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    loadingMessage?: string;
    className?: string;
    itemsClassName?: string;
}

export default function DataTable<T>({
    data,
    renderItem,
    currentPage,
    itemsPerPage,
    onPageChange,
    isLoading = false,
    emptyMessage = 'No items found',
    loadingMessage = 'Loading...',
    className,
    itemsClassName = 'grid grid-cols-1 gap-4 pr-4 lg:grid-cols-2'
}: DataTableProps<T>) {
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className={className}>
            <ScrollArea className="h-[calc(100vh-30rem)]" type="auto">
                <div className={itemsClassName}>
                    {isLoading ? (
                        <div className="col-span-2 text-center text-slate-400">{loadingMessage}</div>
                    ) : data.length === 0 ? (
                        <div className="col-span-2 text-center text-slate-400">{emptyMessage}</div>
                    ) : (
                        currentItems.map(renderItem)
                    )}
                </div>
            </ScrollArea>

            {!isLoading && data.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-muted-foreground text-sm whitespace-nowrap">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} items
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {getPageNumbers().map((page, index) =>
                                page === 'ellipsis' ? (
                                    <PaginationItem key={`ellipsis-${index}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            className="cursor-pointer"
                                            onClick={() => handlePageChange(page as number)}
                                            isActive={currentPage === page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={
                                        currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
