'use client';

import React from 'react';
import Modal from 'react-modal';
import './AutofillModal.css';
import { AutofillData } from '@/types/toolTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';

interface AutofillModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    autofilledData: AutofillData[];
}

Modal.setAppElement(':root');

const AutofillModal: React.FC<AutofillModalProps> = ({ isOpen, onRequestClose, autofilledData }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={true}
            className="modal bg-primary/40"
            overlayClassName="overlay"
            contentLabel="Autofilled Data"
        >
            <h1 className="pb-2 text-2xl font-semibold">Autofill Checker Results</h1>
            <Table className="">
                <TableHeader className="">
                    <TableRow className="w-full">
                        <TableHead className="">Form Field</TableHead>
                        <TableHead className="">Autofilled Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-left">
                    {autofilledData.map((info, index) => (
                        <TableRow key={index} className="">
                            <TableCell>
                                <strong>{info.key}</strong>
                            </TableCell>
                            <TableCell>{info.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                size={'lg'}
                className="glow-on-hover bg-primary relative z-10 mt-1 cursor-pointer rounded-lg font-mono"
                onClick={onRequestClose}
            >
                Close Results
            </Button>
        </Modal>
    );
};

export default AutofillModal;
