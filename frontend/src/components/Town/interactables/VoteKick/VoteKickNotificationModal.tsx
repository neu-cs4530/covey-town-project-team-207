import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PlayerController from '../../../../classes/PlayerController';
import useTownController from '../../../../hooks/useTownController';

export default function VoteKickNotificationModal(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const townController = useTownController();
  const [playerToKick, setPlayerToKick] = useState<string>('');

  useEffect(() => {
    const handleVoteKick = (offendingPlayer: PlayerController) => {
      onOpen();
      setPlayerToKick(offendingPlayer.userName);
    };
    townController.addListener('playerVoteKick', handleVoteKick);
    return () => {
      townController.removeListener('playerVoteKick', handleVoteKick);
    };
  }, [onOpen, townController]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Votekick for {playerToKick}</ModalHeader>
        <ModalBody>
          <Text>
            User {playerToKick} has said inappropriate language multiple times. Please vote to kick or not kick them from the town.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='green'
            onClick={() => {
              controller.recordVote(true);
              onClose();
            }}>
            Kick
          </Button>
          <Button
            colorScheme='red'
            onClick={() => {
              controller.recordVote(false);
              onClose();
            }}>
            Don&apos;t Kick
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
