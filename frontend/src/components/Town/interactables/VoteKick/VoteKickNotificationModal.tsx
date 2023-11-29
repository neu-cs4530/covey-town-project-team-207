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
  Spacer,
} from '@chakra-ui/react';
import assert from 'assert';
import React, { useEffect, useState } from 'react';
import useTownController from '../../../../hooks/useTownController';
import { OffendingPlayerData, PlayerID } from '../../../../types/CoveyTownSocket';

export default function VotekickNotificationModal(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const townController = useTownController();
  const [playerToKickName, setPlayerToKickName] = useState<string | null>(null);
  const [playerToKickID, setPlayerToKickID] = useState<PlayerID | null>(null);

  useEffect(() => {
    const handleInitializeVotekick = (offendingPlayerData: OffendingPlayerData) => {
      setPlayerToKickName(offendingPlayerData.offendingPlayerName);
      setPlayerToKickID(offendingPlayerData.offendingPlayerID);
      onOpen();
    };
    const handleEndVotekick = () => {
      onClose();
    };
    townController.addListener('initializeVotekick', handleInitializeVotekick);
    townController.addListener('endVotekick', handleEndVotekick);
    return () => {
      townController.removeListener('initializeVotekick', handleInitializeVotekick);
      townController.removeListener('endVotekick', handleEndVotekick);
    };
  }, [townController]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Votekick for {playerToKickName}</ModalHeader>
        <ModalBody>
          <Text>
            User {playerToKickName} has said inappropriate language multiple times. Please vote to kick or not kick them from the town.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='green'
            onClick={() => {
              assert(playerToKickName);
              assert(playerToKickID);
              townController.emitVote(playerToKickID, true);
            }}>
            Kick
          </Button>
          <Spacer />
          <Button
            colorScheme='red'
            onClick={() => {
              assert(playerToKickName);
              assert(playerToKickID);
              townController.emitVote(playerToKickID, false);
            }}>
            Don&apos;t Kick
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
