import { useState } from 'react';
import { Box, Input, IconButton, Flex } from '@chakra-ui/react';
import { LuSend } from 'react-icons/lu';

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
          bg="#1B3640"
          borderColor="#874F41"
          color="#FBE9D0"
          _placeholder={{ color: '#90AEAD' }}
          _focus={{ borderColor: '#E64833', boxShadow: '0 0 0 1px #E64833' }}
        />
        <IconButton
          aria-label="Send"
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          size="lg"
          bg="#E64833"
          color="#FBE9D0"
          _hover={{ bg: '#D03D2A' }}
        >
          <LuSend />
        </IconButton>
      </Flex>
    </Box>
  );
};
