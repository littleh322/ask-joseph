import { useState } from 'react';
import { Box, Text, Flex, IconButton } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  url: string;
  filename: string;
}

export const PdfViewer = ({ url, filename }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <Box maxW="720px" mx="auto" px={{ base: 2, md: 4 }} py={6}>
      <Flex justify="space-between" align="center" mb={4} px={2}>
        <Text fontSize="xs" color="#90AEAD">
          {filename}
        </Text>
        {numPages > 1 && (
          <Flex align="center" gap={2}>
            <IconButton
              aria-label="Previous page"
              size="xs"
              variant="ghost"
              color="#90AEAD"
              _hover={{ bg: '#1B3640' }}
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => p - 1)}
            >
              <LuChevronLeft />
            </IconButton>
            <Text fontSize="xs" color="#90AEAD">
              {pageNumber} / {numPages}
            </Text>
            <IconButton
              aria-label="Next page"
              size="xs"
              variant="ghost"
              color="#90AEAD"
              _hover={{ bg: '#1B3640' }}
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((p) => p + 1)}
            >
              <LuChevronRight />
            </IconButton>
          </Flex>
        )}
      </Flex>
      <Box
        bg="#FDFBF7"
        borderRadius="lg"
        overflow="hidden"
        border="1px solid"
        borderColor="#874F41"
      >
        <Document
          file={url}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
        >
          <Page pageNumber={pageNumber} width={688} />
        </Document>
      </Box>
    </Box>
  );
};
