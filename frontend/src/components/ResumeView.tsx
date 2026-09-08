import { Box, Flex, Grid, Heading, Image, Link, List, Tag, Text } from '@chakra-ui/react';
import Markdown from 'react-markdown';
import type { ResumeData } from '../types';
import { isSidebarSection } from '../utils/parseResume';
import { colors } from '../theme/colors';

const API_URL = 'http://localhost:8000';

interface ResumeViewProps {
  resume: ResumeData;
}

const mainMarkdownCss = {
  '& h3': {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: '0.25rem',
    marginTop: '0.75rem',
  },
  '& p': { marginBottom: '0.5rem', lineHeight: '1.6', fontSize: '0.875rem', color: colors.textBody },
  '& ul': { paddingLeft: '1.25rem', marginBottom: '0.5rem', listStyleType: 'disc' },
  '& li': { marginBottom: '0.2rem', fontSize: '0.85rem', lineHeight: '1.5', color: colors.textBody, display: 'list-item' },
  '& strong': { color: colors.textDark, fontWeight: 'bold' },
  '& a': { color: colors.pageBg, textDecoration: 'underline' },
};

function SectionHeading({ children, light }: { children: string; light?: boolean }) {
  return (
    <Heading
      as="h2"
      fontSize="md"
      fontWeight="bold"
      color={colors.accent}
      textTransform="uppercase"
      letterSpacing="0.05em"
      mb={3}
      pb={1}
      borderBottom="2px solid"
      borderColor={light ? colors.borderSidebar : colors.borderLight}
    >
      {children}
    </Heading>
  );
}

function SidebarSection({ heading, content }: { heading: string; content: string }) {
  const isList =
    heading === 'Soft Skills' || heading === 'Interests' || heading === 'Certifications';
  const isSkills = heading === 'Technical Skills';

  if (isSkills) {
    const lines = content
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .map((l) => l.replace(/^-\s*/, '').trim());

    return (
      <Box mb={5}>
        <SectionHeading light>{heading}</SectionHeading>
        {lines.map((line) => {
          const match = line.match(/^\*\*(.+?)\*\*[:\s]*(.*)/);
          if (match) {
            return (
              <Box key={match[1]} mb={2}>
                <Text fontSize="xs" fontWeight="bold" color={colors.accent} mb={1}>
                  {match[1]}
                </Text>
                <Flex wrap="wrap" gap={1}>
                  {match[2]
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <Tag.Root key={skill} size="sm" bg={colors.tagBg} color={colors.tagText} borderRadius="md">
                        <Tag.Label>{skill}</Tag.Label>
                      </Tag.Root>
                    ))}
                </Flex>
              </Box>
            );
          }
          return (
            <Text key={line} fontSize="sm" color={colors.textBody}>
              {line}
            </Text>
          );
        })}
      </Box>
    );
  }

  if (isList) {
    const items = content
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .map((l) => l.replace(/^-\s*/, '').trim());

    return (
      <Box mb={5}>
        <SectionHeading light>{heading}</SectionHeading>
        <List.Root gap={1} listStyle="none" ps={0}>
          {items.map((item) => {
            const match = item.match(/^\*\*(.+?)\*\*\s*[—–-]\s*(.*)/);
            if (match) {
              return (
                <List.Item key={item} fontSize="sm" color={colors.textBody}>
                  <Text fontWeight="bold" color={colors.textDark}>
                    {match[1]}
                  </Text>
                  <Text fontSize="xs" color={colors.textSecondary}>
                    {match[2]}
                  </Text>
                </List.Item>
              );
            }
            return (
              <List.Item key={item} fontSize="sm" color={colors.textBody}>
                {item.replace(/\*\*/g, '')}
              </List.Item>
            );
          })}
        </List.Root>
      </Box>
    );
  }

  return (
    <Box mb={5}>
      <SectionHeading light>{heading}</SectionHeading>
      <Box color={colors.textBody} css={mainMarkdownCss}>
        <Markdown>{content}</Markdown>
      </Box>
    </Box>
  );
}

export const ResumeView = ({ resume }: ResumeViewProps) => {
  const sidebar = resume.sections.filter((s) => isSidebarSection(s.heading));
  const main = resume.sections.filter((s) => !isSidebarSection(s.heading));

  return (
    <Box maxW="960px" mx="auto" px={{ base: 3, md: 6 }} py={6}>
      <Grid
        templateColumns={{ base: '1fr', md: '260px 1fr' }}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="lg"
      >
        {/* Sidebar */}
        <Box bg={colors.sidebarBg} order={{ base: 2, md: 1 }}>
          <Flex justify="center" pt={6} pb={2}>
            <Box
              boxSize="200px"
              borderRadius="full"
              border="4px solid"
              borderColor={colors.accent}
              bg={colors.avatarFallback}
              overflow="hidden"
            >
              <Image
                src={`${API_URL}/avatar`}
                alt="Avatar"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
          </Flex>
          <Box px={5} py={4}>
            {sidebar.map((s) => (
              <SidebarSection key={s.heading} heading={s.heading} content={s.content} />
            ))}
          </Box>
        </Box>

        {/* Main content */}
        <Box bg={colors.mainBg} order={{ base: 1, md: 2 }} p={{ base: 5, md: 6 }}>
          <Box mb={5} pb={4} borderBottom="2px solid" borderColor={colors.borderLight}>
            <Heading
              as="h1"
              fontSize={{ base: '2xl', md: '3xl' }}
              color={colors.textDark}
              fontWeight="bold"
            >
              {resume.name}
            </Heading>
            <Text fontSize="lg" color={colors.accent} fontWeight="semibold" mb={2}>
              {resume.title}
            </Text>
            <Flex wrap="wrap" gap={{ base: 1, md: 2 }} align="center">
              {resume.contact.map((item, idx) => {
                const linkMatch = item.match(/\[(.+?)]\((.+?)\)/);
                const separator = idx < resume.contact.length - 1 && (
                  <Text color={colors.textFaint} fontSize="sm" userSelect="none">
                    |
                  </Text>
                );
                if (linkMatch) {
                  return (
                    <>
                      <Link
                        key={item}
                        href={linkMatch[2]}
                        target="_blank"
                        fontSize="sm"
                        color={colors.pageBg}
                        _hover={{ color: colors.accent }}
                      >
                        {linkMatch[1]}
                      </Link>
                      {separator}
                    </>
                  );
                }
                return (
                  <>
                    <Text key={item} fontSize="sm" color={colors.textSecondary}>
                      {item}
                    </Text>
                    {separator}
                  </>
                );
              })}
            </Flex>
          </Box>

          {main.map((s) => (
            <Box key={s.heading} mb={6}>
              <SectionHeading>{s.heading}</SectionHeading>
              <Box color={colors.textBody} css={mainMarkdownCss}>
                <Markdown>{s.content}</Markdown>
              </Box>
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
};
