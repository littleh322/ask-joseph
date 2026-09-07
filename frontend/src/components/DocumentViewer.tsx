import { Box, Text } from '@chakra-ui/react';
import Markdown from 'react-markdown';

interface DocumentViewerProps {
  filename: string;
  content: string;
}

export const DocumentViewer = ({ filename, content }: DocumentViewerProps) => {
  return (
    <Box maxW="720px" mx="auto" px={{ base: 4, md: 8 }} py={6}>
      <Text fontSize="xs" color="#90AEAD" mb={4}>
        {filename}
      </Text>
      <Box
        color="#FBE9D0"
        css={{
          '& h1': { fontSize: '1.5rem', fontWeight: 'bold', color: '#E64833', marginBottom: '0.5rem' },
          '& h2': { fontSize: '1.25rem', fontWeight: 'bold', color: '#E64833', marginBottom: '0.5rem', marginTop: '1.5rem' },
          '& h3': { fontSize: '1.1rem', fontWeight: 'bold', color: '#E64833', marginBottom: '0.5rem' },
          '& p': { marginBottom: '1rem', lineHeight: '1.7' },
          '& ul, & ol': { paddingLeft: '1.5rem', marginBottom: '1rem' },
          '& li': { marginBottom: '0.25rem' },
          '& strong': { color: '#FBE9D0', fontWeight: 'bold' },
          '& code': { background: '#1B3640', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.9em' },
        }}
      >
        <Markdown>{content}</Markdown>
      </Box>
    </Box>
  );
};
