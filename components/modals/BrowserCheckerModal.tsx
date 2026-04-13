import React from 'react';
import Modal from 'react-modal';
import './BrowserCheckerModal.css';
import { BrowserInfo } from '@/types/toolTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';

interface BrowserCheckerModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    browserInfo: BrowserInfo[];
}

Modal.setAppElement(':root');

const BrowserCheckerModal: React.FC<BrowserCheckerModalProps> = ({ isOpen, onRequestClose, browserInfo }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={true}
            className="modal bg-card/90"
            overlayClassName="overlay"
            contentLabel="Browser Checker Results"
        >
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="pb-2 text-2xl font-semibold">Browser Checker Results</h1>
                <Table className="overflow-hidden">
                    <TableHeader className="">
                        <TableRow className="">
                            <TableHead className="">Browser/Device</TableHead>
                            <TableHead className="">Information</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-left">
                        {browserInfo.map((info, index) => (
                            <TableRow key={index} className="text-wrap">
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
                    className="relative z-10 mt-1 cursor-pointer rounded-lg font-mono"
                    variant="outline"
                    onClick={onRequestClose}
                >
                    Close Results
                </Button>
            </div>
        </Modal>
    );
};

export default BrowserCheckerModal;
