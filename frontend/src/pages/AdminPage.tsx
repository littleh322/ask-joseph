import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { LuArrowLeft, LuSave, LuUpload } from 'react-icons/lu';

const API_URL = 'http://localhost:8000';

export const AdminPage = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') ?? '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [markdown, setMarkdown] = useState('');
  const [filename, setFilename] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const isAuthed = token.length > 0;

  useEffect(() => {
    if (!isAuthed) return;
    fetch(`${API_URL}/resume`)
      .then((res) => res.json())
      .then((data: { filename: string; content: string }) => {
        setMarkdown(data.content);
        setFilename(data.filename ?? '');
      });
  }, [isAuthed]);

  const handleLogin = async () => {
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError('Invalid password');
        return;
      }
      const data: { token: string } = await res.json();
      setToken(data.token);
      sessionStorage.setItem('admin_token', data.token);
    } catch {
      setLoginError('Unable to reach server');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('');
    try {
      const res = await fetch(`${API_URL}/admin/resume`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: markdown }),
      });
      if (res.status === 401) {
        setToken('');
        sessionStorage.removeItem('admin_token');
        return;
      }
      const data: { filename: string; chunks: number } = await res.json();
      setFilename(data.filename);
      setSaveStatus(`Saved & ingested (${data.chunks} chunks)`);
    } catch {
      setSaveStatus('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadStatus('');
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_URL}/admin/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.status === 401) {
        setToken('');
        sessionStorage.removeItem('admin_token');
        return;
      }
      const data: { filename: string } = await res.json();
      setUploadStatus(`Uploaded: ${data.filename}`);
    } catch {
      setUploadStatus('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthed) {
    return (
      <Flex minH="100vh" bg="#244855" align="center" justify="center">
        <Box bg="#1B3640" p={8} borderRadius="lg" border="1px solid" borderColor="#874F41" w="360px">
          <Heading size="lg" color="#FBE9D0" mb={4}>
            Admin Login
          </Heading>
          <VStack gap={3}>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              bg="#244855"
              borderColor="#874F41"
              color="#FBE9D0"
              _placeholder={{ color: '#90AEAD' }}
            />
            {loginError && (
              <Text fontSize="sm" color="#E64833">
                {loginError}
              </Text>
            )}
            <Button w="100%" bg="#E64833" color="#FBE9D0" _hover={{ bg: '#D03D2A' }} onClick={handleLogin}>
              Sign In
            </Button>
          </VStack>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bg="#244855">
      {/* Header */}
      <Box bg="#1B3640" px={{ base: 4, md: 8 }} py={3} borderBottom="1px solid" borderColor="#874F41">
        <Flex maxW="960px" mx="auto" justify="space-between" align="center">
          <Flex align="center" gap={3}>
            <RouterLink to="/">
              <Button size="sm" variant="ghost" color="#90AEAD" _hover={{ bg: '#244855' }}>
                <LuArrowLeft />
                Resume
              </Button>
            </RouterLink>
            <Heading size="md" color="#FBE9D0">
              Admin
            </Heading>
          </Flex>
          <Text fontSize="xs" color="#90AEAD">
            {filename}
          </Text>
        </Flex>
      </Box>

      {/* Editor */}
      <Box flex="1" px={{ base: 4, md: 8 }} py={6}>
        <Box maxW="960px" mx="auto">
          {/* Avatar upload */}
          <Flex
            align="center"
            gap={3}
            mb={5}
            p={4}
            bg="#1B3640"
            borderRadius="lg"
            border="1px solid"
            borderColor="#874F41"
          >
            <Text fontSize="sm" color="#FBE9D0" fontWeight="bold">
              Avatar
            </Text>
            <Box position="relative">
              <Button
                as="label"
                size="sm"
                bg="#874F41"
                color="#FBE9D0"
                _hover={{ bg: '#6B3F33' }}
                cursor="pointer"
                disabled={uploading}
              >
                <LuUpload />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                />
              </Button>
            </Box>
            {uploadStatus && (
              <Text fontSize="xs" color="#90AEAD">
                {uploadStatus}
              </Text>
            )}
          </Flex>

          {/* Markdown editor */}
          <Box
            bg="#1B3640"
            borderRadius="lg"
            border="1px solid"
            borderColor="#874F41"
            p={4}
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontSize="sm" fontWeight="bold" color="#FBE9D0">
                Resume Markdown
              </Text>
              <Flex align="center" gap={2}>
                {saveStatus && (
                  <Text fontSize="xs" color="#90AEAD">
                    {saveStatus}
                  </Text>
                )}
                <Button
                  size="sm"
                  bg="#E64833"
                  color="#FBE9D0"
                  _hover={{ bg: '#D03D2A' }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  <LuSave />
                  {saving ? 'Saving...' : 'Save & Ingest'}
                </Button>
              </Flex>
            </Flex>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              minH="70vh"
              fontFamily="mono"
              fontSize="sm"
              bg="#244855"
              borderColor="#874F41"
              color="#FBE9D0"
              _placeholder={{ color: '#90AEAD' }}
              resize="vertical"
            />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};
