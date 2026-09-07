import { Box, Flex, Grid, Heading, Image, Link, List, Tag, Text } from '@chakra-ui/react';
import Markdown from 'react-markdown';
import type { ResumeData } from '../types';
import { isSidebarSection } from '../utils/parseResume';

const API_URL = 'http://localhost:8000';

interface ResumeViewProps {
  resume: ResumeData;
}

const sectionMarkdownCss = {
  '& h3': {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: '#FBE9D0',
    marginBottom: '0.25rem',
    marginTop: '0.75rem',
  },
  '& p': { marginBottom: '0.5rem', lineHeight: '1.6', fontSize: '0.875rem' },
  '& ul': { paddingLeft: '1.25rem', marginBottom: '0.5rem' },
  '& li': { marginBottom: '0.2rem', fontSize: '0.85rem', lineHeight: '1.5' },
  '& strong': { color: '#FBE9D0', fontWeight: 'bold' },
  '& a': { color: '#90AEAD', textDecoration: 'underline' },
};

function SectionHeading({ children }: { children: string }) {
  return (
    <Heading
      as="h2"
      fontSize="md"
      fontWeight="bold"
      color="#E64833"
      textTransform="uppercase"
      letterSpacing="0.05em"
      mb={3}
      pb={1}
      borderBottom="2px solid"
      borderColor="#874F41"
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
        <SectionHeading>{heading}</SectionHeading>
        {lines.map((line) => {
          const match = line.match(/^\*\*(.+?)\*\*[:\s]*(.*)/);
          if (match) {
            return (
              <Box key={match[1]} mb={2}>
                <Text fontSize="xs" fontWeight="bold" color="#E64833" mb={1}>
                  {match[1]}
                </Text>
                <Flex wrap="wrap" gap={1}>
                  {match[2]
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <Tag.Root key={skill} size="sm" bg="#244855" color="#FBE9D0" borderRadius="md">
                        <Tag.Label>{skill}</Tag.Label>
                      </Tag.Root>
                    ))}
                </Flex>
              </Box>
            );
          }
          return (
            <Text key={line} fontSize="sm" color="#FBE9D0">
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
        <SectionHeading>{heading}</SectionHeading>
        <List.Root gap={1} listStyle="none" ps={0}>
          {items.map((item) => {
            const match = item.match(/^\*\*(.+?)\*\*\s*[—–-]\s*(.*)/);
            if (match) {
              return (
                <List.Item key={item} fontSize="sm" color="#FBE9D0">
                  <Text fontWeight="bold">{match[1]}</Text>
                  <Text fontSize="xs" color="#90AEAD">
                    {match[2]}
                  </Text>
                </List.Item>
              );
            }
            return (
              <List.Item key={item} fontSize="sm" color="#FBE9D0">
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
      <SectionHeading>{heading}</SectionHeading>
      <Box color="#FBE9D0" css={sectionMarkdownCss}>
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
      {/* Header */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'center', md: 'flex-start' }}
        gap={5}
        mb={6}
        pb={5}
        borderBottom="2px solid"
        borderColor="#874F41"
      >
        <Image
          src={`${API_URL}/avatar`}
          alt="Avatar"
          boxSize={{ base: '100px', md: '120px' }}
          borderRadius="full"
          border="3px solid"
          borderColor="#E64833"
          objectFit="cover"
          fallback={
            <Box
              boxSize={{ base: '100px', md: '120px' }}
              borderRadius="full"
              bg="#1B3640"
              border="3px solid"
              borderColor="#874F41"
            />
          }
        />
        <Box textAlign={{ base: 'center', md: 'left' }}>
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} color="#FBE9D0" fontWeight="bold">
            {resume.name}
          </Heading>
          <Text fontSize="lg" color="#E64833" fontWeight="semibold" mb={2}>
            {resume.title}
          </Text>
          <Flex
            wrap="wrap"
            gap={{ base: 1, md: 3 }}
            justify={{ base: 'center', md: 'flex-start' }}
          >
            {resume.contact.map((item) => {
              const linkMatch = item.match(/\[(.+?)]\((.+?)\)/);
              if (linkMatch) {
                return (
                  <Link
                    key={item}
                    href={linkMatch[2]}
                    target="_blank"
                    fontSize="sm"
                    color="#90AEAD"
                    _hover={{ color: '#FBE9D0' }}
                  >
                    {linkMatch[1]}
                  </Link>
                );
              }
              return (
                <Text key={item} fontSize="sm" color="#90AEAD">
                  {item}
                </Text>
              );
            })}
          </Flex>
        </Box>
      </Flex>

      {/* Two-column layout */}
      <Grid templateColumns={{ base: '1fr', md: '260px 1fr' }} gap={6}>
        {/* Sidebar */}
        <Box order={{ base: 2, md: 1 }}>
          {sidebar.map((s) => (
            <SidebarSection key={s.heading} heading={s.heading} content={s.content} />
          ))}
        </Box>

        {/* Main content */}
        <Box order={{ base: 1, md: 2 }}>
          {main.map((s) => (
            <Box key={s.heading} mb={6}>
              <SectionHeading>{s.heading}</SectionHeading>
              <Box color="#FBE9D0" css={sectionMarkdownCss}>
                <Markdown>{s.content}</Markdown>
              </Box>
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
};
