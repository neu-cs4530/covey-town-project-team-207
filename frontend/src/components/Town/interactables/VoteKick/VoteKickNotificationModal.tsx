import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  ModalFooter,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import VoteKickNotificationModalController from '../../../../classes/interactable/VoteKickNotificationModalController';
import PlayerController from '../../../../classes/PlayerController';
import useTownController from '../../../../hooks/useTownController';

export default function VoteKickNotificationModal({
  username,
  controller,
}: {
  username: string;
  controller: VoteKickNotificationModalController 
}): JSX.Element {
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
  }, [townController]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Votekick for {username}</ModalHeader>
        <ModalBody>
          <Text>
            User {username} has said inappropriate language multiple times. Please vote to kick or not kick them from the town.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='green'
            onClick={() => {
              controller.recordVote(true);
              onClose();
            }}>
            Don't Kick
          </Button>
          <Button
            colorScheme='red'
            onClick={() => {
              controller.recordVote(false);
              onClose();
            }}>
            Kick
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
