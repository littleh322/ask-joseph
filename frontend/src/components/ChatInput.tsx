import { useState } from 'react';
import { Box, Input, IconButton, Flex } from '@chakra-ui/react';
import { LuSend } from 'react-icons/lu';
import { colors } from '../theme/colors';

interface ChatInputProps {
  onSend: (question: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <Box py={3} px={{ base: 4, md: 8 }}>
      <Flex maxW="720px" mx="auto" gap={2}>
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isLoading}
          size="lg"
          bg={colors.headerBg}
          borderColor={colors.border}
          color={colors.textLight}
          _placeholder={{ color: colors.textMuted }}
          _focus={{ borderColor: colors.accent, boxShadow: `0 0 0 1px ${colors.accent}` }}
        />
        <IconButton
          aria-label="Send"
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          size="lg"
          bg={colors.accent}
          color={colors.textLight}
          _hover={{ bg: colors.accentHover }}
        >
          <LuSend />
        </IconButton>
      </Flex>
    </Box>
  );
};
