import { useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { LuSettings } from 'react-icons/lu';
import { ResumeView } from '../components/ResumeView';
import { AnswerPanel } from '../components/AnswerPanel';
import { ChatInput } from '../components/ChatInput';
import { parseResume } from '../utils/parseResume';
import { colors } from '../theme/colors';
import type { AskResponse, ResumeData, Source } from '../types';

const API_URL = 'http://localhost:8000';

export const ResumePage = () => {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/resume`)
      .then((res) => res.json())
      .then((data: { content: string }) => {
        if (data.content) {
          setResume(parseResume(data.content));
        }
      })
      .catch(() => setResume(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async (question: string) => {
    setIsAsking(true);
    setAnswer(null);
    setSources([]);
    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error();
      const data: AskResponse = await res.json();
      setAnswer(data.answer);
      setSources(data.sources);
    } catch {
      setAnswer('Unable to reach the server. Make sure the backend is running.');
    } finally {
      setIsAsking(false);
    }
  };

  const handleClose = () => {
    setAnswer(null);
    setSources([]);
  };

  return (
    <Flex direction="column" minH="100vh" bg={colors.pageBg}>
      <Box
        bg={colors.headerBg}
        px={{ base: 4, md: 8 }}
        py={4}
        borderBottom="1px solid"
        borderColor={colors.border}
      >
        <Flex maxW="960px" mx="auto" justify="space-between" align="center">
          <Box>
            <Text color={colors.textLight} fontSize="xl" fontWeight="bold">
              Joseph Haberberger
            </Text>
            <Text color={colors.textMuted} fontSize="sm">
              Ask me anything about my experience
            </Text>
          </Box>
          <RouterLink to="/admin">
            <Box color={colors.textMuted} _hover={{ color: colors.textLight }} cursor="pointer" p={2}>
              <LuSettings size={18} />
            </Box>
          </RouterLink>
        </Flex>
      </Box>

      <Box flex="1" overflowY="auto" pb="200px">
        {loading ? (
          <Flex justify="center" py={10}>
            <Spinner size="lg" color={colors.accent} />
          </Flex>
        ) : !resume ? (
          <Text color={colors.textMuted} textAlign="center" py={10}>
            No resume found. Upload one in the admin panel.
          </Text>
        ) : (
          <ResumeView resume={resume} />
        )}
      </Box>

      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg={colors.pageBg}
        borderTop="1px solid"
        borderColor={colors.border}
      >
        <AnswerPanel answer={answer} sources={sources} isLoading={isAsking} onClose={handleClose} />
        <ChatInput onSend={handleSend} isLoading={isAsking} />
      </Box>
    </Flex>
  );
};
