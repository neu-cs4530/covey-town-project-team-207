import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
  } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import VotekickController from '../../../../classes/interactable/VotekickController';
  
export default function VotekickNotificationModal({
    username,
    votekickController,
}: {
    username: string,
    votekickController: VotekickController,
}): JSX.Element {
    const [timer, setTimer] = useState<number>(10);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => {
                clearInterval(countdown);
            };
        }
    }, [timer]);

    return (
    <Modal isOpen={username !== undefined && timer > 0} onClose={() => {}}>
    <ModalOverlay />
    <ModalContent>
        <ModalHeader>Disruptive user identified, votekick for {username} occuring in:</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{timer} seconds</ModalBody>
        </ModalContent>
    </Modal>
            );
        }