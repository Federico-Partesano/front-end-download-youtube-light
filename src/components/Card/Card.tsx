import { AspectRatio, Box, Button } from '@chakra-ui/react';
import React, { FC } from 'react';
import { RespVideoSearch } from '../../models/Resp';
import "./Card.scss";

interface ICard {
    video: RespVideoSearch;
    downloadDisabled: boolean
    handleDownload: (videoId: string, title: string) => void
  }

const HtmlDecode = (s: string) => {
    var el = document.createElement("div");
    el.innerHTML = s;
    return el.innerText || el.textContent;
  }

const Card: FC<ICard> = ({video, downloadDisabled, handleDownload}) => {


  const {
    snippet: { publishedAt, title },
    id: { videoId },
  } = video;

return (
    <Box
    onClick={() => console.log('id', video.id.videoId)}
      maxW="xxl"
      borderWidth="1px"
      borderRadius="lg"
      marginBottom={"20px"}
      overflow="hidden"
      position={"relative"}
    >
      <AspectRatio maxW="100%" maxH={"350px"} ratio={1}>
        <iframe
          title="naruto"
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
        />
      </AspectRatio>

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          {/* <Badge borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge> */}
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {/* {property.beds} beds &bull; {property.baths} baths */}
            {publishedAt}
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"

        >
          {HtmlDecode(title)}
        </Box>
      </Box>
      <Button colorScheme="telegram" disabled={downloadDisabled} marginBottom={"20px"} onClick={() => handleDownload(videoId, title)}>
        Download
      </Button>
   
    </Box>)
};

export default Card;