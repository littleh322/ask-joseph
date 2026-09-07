import { useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { DocumentViewer } from './components/DocumentViewer';
import { PdfViewer } from './components/PdfViewer';
import { AnswerPanel } from './components/AnswerPanel';
import { ChatInput } from './components/ChatInput';
import type { AskResponse, Document, Source } from './types';

const API_URL = 'http://localhost:8000';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/documents?type=pdf`)
      .then((res) => res.json())
      .then((data: Document[]) => setDocuments(data))
      .catch(() => setDocuments([]))
      .finally(() => setDocsLoading(false));
  }, []);

  const handleSend = async (question: string) => {
    setIsLoading(true);
    setAnswer(null);
    setSources([]);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: AskResponse = await response.json();
      setAnswer(data.answer);
      setSources(data.sources);
    } catch {
      setAnswer('Unable to reach the server. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAnswer(null);
    setSources([]);
  };

  return (
    <Flex direction="column" minH="100vh" bg="#244855">
      <Box bg="#1B3640" px={{ base: 4, md: 8 }} py={4} borderBottom="1px solid" borderColor="#874F41">
        <Box maxW="720px" mx="auto">
          <Box color="#FBE9D0" fontSize="xl" fontWeight="bold">
            Joseph Haberberger
          </Box>
          <Box color="#90AEAD" fontSize="sm">
            Ask me anything about my experience
          </Box>
        </Box>
      </Box>
      <Box flex="1" overflowY="auto" pb="200px">
        {docsLoading ? (
          <Flex justify="center" py={10}>
            <Spinner size="lg" color="#E64833" />
          </Flex>
        ) : documents.length === 0 ? (
          <Text color="#90AEAD" textAlign="center" py={10}>
            No documents found.
          </Text>
        ) : (
          documents.map((doc) =>
            doc.type === 'pdf' ? (
              <PdfViewer
                key={doc.filename}
                filename={doc.filename}
                url={`${API_URL}/documents/${doc.filename}`}
              />
            ) : (
              <DocumentViewer
                key={doc.filename}
                filename={doc.filename}
                content={doc.content!}
              />
            ),
          )
        )}
      </Box>
      <Box position="fixed" bottom={0} left={0} right={0} bg="#244855" borderTop="1px solid" borderColor="#874F41">
        <AnswerPanel answer={answer} sources={sources} isLoading={isLoading} onClose={handleClose} />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </Box>
    </Flex>
  );
}

export default App;
