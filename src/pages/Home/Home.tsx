import {
  AspectRatio,
  Box,
  Container,
  Heading,
  Text,
  Input,
  Skeleton,
  Stack,
  useToast,
  Progress,
} from "@chakra-ui/react";
import axios from "axios";
import { error } from "console";
import React, { FC, useEffect, useState } from "react";
import * as yt from "youtube-search-without-api-key";
import { socketConnection } from "../../App";
import Card from "../../components/Card/Card";
import { basicApi } from "../../enviroument";

import "./Home.scss";
const downloadjs = require('downloadjs');

interface IHome {}
let selectedVideoId= "";
let selectedTrack = "audio.mp3";

let closeToast:   null | (() => void) = null;
const Home: FC<IHome> = () => {
  const [data, setData] = useState<any[]>();
  const toast = useToast();
  const [term, setTerm] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [canDownload, setCanDownload] = useState(false);
  const loadVideo = async (termVideo: string) => {
    if (termVideo.length < 3) return;
    setIsSearchLoading(true);
    const { data } = await axios.get(
      `${basicApi}/youtube/songs?term=${termVideo}`
    );
    setData(data);
    setIsSearchLoading(false);
  };
  const chekcStatus = async () => {
    const {
      data: { status },
    } = await axios.get<{ status: "downloading" | "await" }>(
      `${basicApi}/youtube/status`
    );
    setCanDownload(status === "downloading" ? true : false);
  };
  useEffect(() => {
      socketConnection?.on("status", ({ status }) => {
        console.log('change', status)

        if(status === "await"){
         closeToast && closeToast();
         var x=new XMLHttpRequest();
         x.open( "GET", `${basicApi}/youtube/downloaded-song` , true);
         x.responseType="blob";
         x.onload= function(e){downloadjs((e!.target! as any).response, selectedTrack, "audio/mp3");};
         x.send();
        }
      setCanDownload(status === "downloading" ? true : false);
    });
  }, [socketConnection]);

  useEffect(() => {
    chekcStatus();
  }, [])
  

  const handleDownload = async(videoId: string, title: string) => {
    selectedTrack = `${title}.mp3`;
    selectedVideoId = videoId
    setCanDownload(true);
    const {data} = await axios.get(`${basicApi}/youtube/song?videoId=${videoId}`);
    console.log('data', data)
    toast({
      position: "bottom",
      duration: null,
      render: ({onClose}) => {
        closeToast = onClose;
        return <Box color="white" p={3} bg="blue.500">
          <Progress size="xs" isIndeterminate />
          <Text textAlign={"center"}>downloading...</Text>
        </Box>
      },
    });
  };
  return (
    <div>
      <Container maxW="container.md">
        <Box textAlign="center" fontSize="xl">
          <Box mt="5" mb="5">
            <Heading className="special-elite-font" size="2xl">
              YouTube Downloader
            </Heading>
            <Text>Convert and download Youtube videos in MP3 free</Text>
          </Box>
          <Input
            onChange={({ currentTarget: { value } }: any) => {
              setTerm(value);
              loadVideo(value);
            }}
            placeholder="Basic usage"
          />
          <div>
            {data &&
              data.map((item) => {
                return (
                  <div key={item.id.videoId}>
                    <Card
                      handleDownload={handleDownload}
                      downloadDisabled={canDownload}
                      key={item.id.videoId}
                      video={item}
                    />
                  </div>
                );
              })}

            {isSearchLoading && (
              <>
                <Stack>
                  {Array.from({ length: 6 }, (_, i) => i).map((i) => (
                    <Skeleton key={i} borderRadius={"10px"} height="500px" />
                  ))}
                </Stack>
              </>
            )}
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
