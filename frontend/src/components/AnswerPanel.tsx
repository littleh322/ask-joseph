import { useEffect, useState } from 'react';
import { Box, Text, Spinner, IconButton, Flex } from '@chakra-ui/react';
import { LuX } from 'react-icons/lu';
import type { Source } from '../types';
import { colors } from '../theme/colors';

interface AnswerPanelProps {
  answer: string | null;
  sources: Source[];
  isLoading: boolean;
  onClose: () => void;
}

const CHARS_PER_TICK = 3;
const TICK_MS = 15;

export const AnswerPanel = ({ answer, sources, isLoading, onClose }: AnswerPanelProps) => {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!answer) {
      setDisplayed('');
      setIsTyping(false);
      return;
    }

    setDisplayed('');
    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      index += CHARS_PER_TICK;
      if (index >= answer.length) {
        setDisplayed(answer);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayed(answer.slice(0, index));
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [answer]);

  if (!isLoading && !answer) return null;

  return (
    <Box maxW="720px" mx="auto" w="100%" px={{ base: 4, md: 8 }} pb={2}>
      <Box bg={colors.headerBg} borderRadius="lg" p={4} border="1px solid" borderColor={colors.border}>
        {isLoading ? (
          <Flex align="center" justify="center" gap={2} py={2}>
            <Spinner size="md" color={colors.accent} />
            <Text fontSize="sm" color={colors.textMuted}>
              Searching documents...
            </Text>
          </Flex>
        ) : (
          <>
            <Flex justify="flex-end" mt={-2} mr={-2}>
              <IconButton
                aria-label="Close"
                size="xs"
                variant="ghost"
                color={colors.textMuted}
                _hover={{ bg: colors.pageBg }}
                onClick={onClose}
              >
                <LuX />
              </IconButton>
            </Flex>
            <Text fontSize="md" whiteSpace="pre-wrap" color={colors.textLight}>
              {displayed}
              {isTyping && (
                <Box as="span" color={colors.accent}>
                  ▌
                </Box>
              )}
            </Text>
            {!isTyping && sources.length > 0 && (
              <Text mt={3} fontSize="xs" color={colors.textMuted}>
                Sources: {sources.map((s) => s.filename).join(', ')}
              </Text>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
