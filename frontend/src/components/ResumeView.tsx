import { Box, Flex, Grid, Heading, Image, Link, List, Tag, Text } from '@chakra-ui/react';
import Markdown from 'react-markdown';
import type { ResumeData } from '../types';
import { isSidebarSection } from '../utils/parseResume';
import { colors } from '../theme/colors';

const API_URL = 'http://localhost:8000';

interface ResumeViewProps {
  resume: ResumeData;
}

const SIDEBAR_ORDER = ['Soft Skills', 'Technical Skills', 'Certifications', 'Interests'];

const mainMarkdownCss = {
  '& h3': {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: '0.15rem',
    marginTop: '1rem',
  },
  '& p': { marginBottom: '0.5rem', lineHeight: '1.7', fontSize: '0.875rem', color: colors.textBody },
  '& ul': { paddingLeft: '1.25rem', marginBottom: '0.75rem', listStyleType: 'disc' },
  '& li': { marginBottom: '0.35rem', fontSize: '0.85rem', lineHeight: '1.6', color: colors.textBody, display: 'list-item' },
  '& strong': { color: colors.textDark, fontWeight: 'bold' },
  '& a': { color: colors.pageBg, textDecoration: 'underline' },
};

function SectionHeading({ children, light }: { children: string; light?: boolean }) {
  return (
    <Heading
      as="h2"
      fontSize={light ? 'lg' : 'xl'}
      fontWeight="bold"
      color={colors.accent}
      mb={4}
      pb={2}
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
      <Box mb={8}>
        <SectionHeading light>{heading}</SectionHeading>
        {lines.map((line) => {
          const match = line.match(/^\*\*(.+?)\*\*[:\s]*(.*)/);
          if (match) {
            return (
              <Box key={match[1]} mb={3}>
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
      <Box mb={8}>
        <SectionHeading light>{heading}</SectionHeading>
        <List.Root gap={2} listStyle="none" ps={0}>
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
  const sidebar = resume.sections
    .filter((s) => isSidebarSection(s.heading))
    .sort((a, b) => SIDEBAR_ORDER.indexOf(a.heading) - SIDEBAR_ORDER.indexOf(b.heading));
  const main = resume.sections.filter((s) => !isSidebarSection(s.heading));

  const firstName = resume.name.split(' ')[0];
  const lastName = resume.name.split(' ').slice(1).join(' ');

  return (
    <Box maxW="960px" mx="auto" px={{ base: 3, md: 6 }} py={6}>
      <Box borderRadius="lg" overflow="hidden" boxShadow="lg">
        {/* Header row: avatar + name/title/contact */}
        <Grid templateColumns={{ base: '1fr', md: '260px 1fr' }}>
          <Flex
            bg={colors.sidebarBg}
            justify="center"
            align="center"
            p={6}
            order={{ base: 1, md: 1 }}
          >
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
          <Flex
            bg={colors.mainBg}
            direction="column"
            justify="center"
            px={5}
            py={6}
            order={{ base: 2, md: 2 }}
          >
            <Heading as="h1" fontSize={{ base: '4xl', md: '5xl' }} color={colors.textDark} mb={4}>
              <Box as="span" fontWeight="bold">
                {firstName}
              </Box>{' '}
              <Box as="span" fontSize={{ base: '4xl', md: '5xl' }} fontWeight="normal">
                {lastName}
              </Box>
            </Heading>
            <Text fontSize="2xl" color={colors.accent} fontWeight="medium" mb={4}>
              {resume.title}
            </Text>
            <Box>
              {resume.contact.map((item) => {
                const linkMatch = item.match(/\[(.+?)]\((.+?)\)/);
                if (linkMatch) {
                  return (
                    <Link
                      key={item}
                      href={linkMatch[2]}
                      target="_blank"
                      display="block"
                      fontSize="sm"
                      color={colors.pageBg}
                      _hover={{ color: colors.accent }}
                      mb={1}
                    >
                      {linkMatch[2]}
                    </Link>
                  );
                }
                return (
                  <Text key={item} fontSize="sm" color={colors.textSecondary} mb={1}>
                    {item}
                  </Text>
                );
              })}
            </Box>
          </Flex>
        </Grid>

        {/* Full-width divider */}
        <Box h="2px" bg={colors.borderSidebar} />

        {/* Body: sidebar + main content */}
        <Grid templateColumns={{ base: '1fr', md: '260px 1fr' }}>
          <Box bg={colors.sidebarBg} px={5} py={5} order={{ base: 2, md: 1 }}>
            {sidebar.map((s) => (
              <SidebarSection key={s.heading} heading={s.heading} content={s.content} />
            ))}
          </Box>
          <Box bg={colors.mainBg} px={5} py={5} order={{ base: 1, md: 2 }}>
            {main.map((s) => (
              <Box key={s.heading} mb={8}>
                <SectionHeading>{s.heading}</SectionHeading>
                <Box color={colors.textBody} css={mainMarkdownCss}>
                  <Markdown>{s.content}</Markdown>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};
