'use client';

import React from 'react';
import Modal from 'react-modal';
import './DomainCheckerModal.css';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';

interface DomainCheckerModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    linksData: { url: string; description: string }[];
}

Modal.setAppElement(':root');

const DomainCheckerModal: React.FC<DomainCheckerModalProps> = ({ isOpen = false, onRequestClose, linksData }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={true}
            className="modal bg-card outline-hidden"
            overlayClassName="overlay"
            contentLabel="Domain Checker Results"
        >
            <h1 className="pb-2 text-2xl font-semibold">Domain Checker Results</h1>
            <Table>
                <TableHeader className="text-base">
                    <TableRow className="w-full">
                        <TableHead>URL</TableHead>
                        <TableHead className="text-right">Description</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody className="text-left">
                    {linksData.map((link, index) => (
                        <TableRow key={index} className="">
                            <TableCell>
                                <Link href={link.url} target="_blank" rel="nooponer noreferrer" prefetch={false}>
                                    {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">{link.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                size={'lg'}
                className="relative z-10 mt-1 cursor-pointer rounded-lg font-mono"
                variant="outline"
                onClick={onRequestClose}
            >
                Close Results
            </Button>
        </Modal>
    );
};

export default DomainCheckerModal;
